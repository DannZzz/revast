import * as WebSocket from 'ws'
import {
  ClientToServerEvents,
  MainServer,
  MainSocket,
  ServerToClientEvents,
} from '../events/events'
import { GameServer } from 'src/game/server'
import { binaryMessageToObject, emitDataToBinary } from './binary-converter'
import { Emitable, WsMessage } from './type'
import registerListeners from './register-listeners'
import config from 'config'
import c from 'config'
import { Timeout } from 'src/structures/timers/timeout'
import { Interval } from 'src/structures/timers/interval'
import { MAXIMUM_MESSAGE_SIZE_FOR_WS_PER_5S } from 'src/constant'
import { Player } from 'src/game/player/player'

export class Wss {
  listeners: Array<{ event: string; cb: Function }> = []
  readonly messagesPer5sInterval = new Interval(
    () =>
      this.server.clients.forEach((socket) => {
        ;(socket as any).messagesPer5s = 0
      }),
    5000,
  )
  constructor(
    readonly server: MainServer,
    private readonly gs: () => GameServer,
  ) {
    this.init()
    registerListeners.call(this)
  }

  get gameServer() {
    return this.gs()
  }

  emitable(socketId: string): Emitable {
    const socket = this.server.clientList[socketId]

    const emitable: Emitable = {
      emit: <K extends keyof ServerToClientEvents>(
        event: K,
        ...data: Parameters<ServerToClientEvents[K]>
      ) => {
        const bin = emitDataToBinary(event, data)
        socket?.send(bin)
      },
      id: socket?.id,
      close: () => socket?.close(null, 'player died'),
    }
    return emitable
  }

  takeMessage(message: WsMessage, socket: MainSocket) {
    this.listeners.forEach((lst) => {
      if (lst.event === message?.event) {
        // @ts-ignore
        lst.cb(
          { ws: socket, player: this.gameServer.to(socket.id) },
          ...(Array.isArray(message?.data) ? message.data : []),
        )
      }
    })
  }

  on<K extends keyof ClientToServerEvents>(
    event: K,
    cb: (
      config: { ws: MainSocket; player?: Player },
      ...data: Parameters<ClientToServerEvents[K]>
    ) => void,
  ) {
    this.listeners.push({ event, cb })
    return this
  }

  private init() {
    this.server.on('connection', (ws: MainSocket, req) => {
      let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
      // . . .
      let userAgent = req.headers['user-agent']
      let origin = req.headers['origin']
      // . . .
      // console.log(origin, ip)

      const allowedOrigins = [config.get('WEB')]
      if (
        process.env.NODE_ENV === 'production' &&
        (!origin || !allowedOrigins.includes(origin))
      ) {
        return ws.close(null, 'blocked origin')
      }

      ws.autodeleteTimeout = new Timeout(() => {
        if (!ws.inGame) {
          delete this.server.clientList[ws.id]
          ws.close(null, 'unused socket')
        }
      }, 5000).run()

      this.messagesPer5sInterval.run()
      ws.messagesPer5s = 0
      ws.id = `ws-${(() => {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
        }
        return s4() + s4() + '-' + s4()
      })()}`
      ws.inGame = false
      this.server.clientList[ws.id] = ws
      // ws.binaryType = 'arraybuffer'
      ws.on('message', (data) => {
        ws.messagesPer5s++
        if (ws.messagesPer5s > MAXIMUM_MESSAGE_SIZE_FOR_WS_PER_5S) {
          return ws.close(null, 'spam')
        }
        const message = binaryMessageToObject(data)
        this.takeMessage(message, ws)
      })

      ws.on('close', (code, reason) => {
        // console.log(code, binaryMessageToObject(reason))
        this.gameServer.to(ws.id)?.disconnect()
        delete this.server.clientList[ws.id]
        if (this.server.clients.size === 0) this.messagesPer5sInterval.stop()
      })
    })
  }
}
