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
      close: () => socket?.close(),
    }
    return emitable
  }

  takeMessage(message: WsMessage, socket: MainSocket) {
    this.listeners.forEach((lst) => {
      if (lst.event === message.event) {
        // @ts-ignore
        lst.cb(socket, ...message.data)
      }
    })
  }

  on<K extends keyof ClientToServerEvents>(
    event: K,
    cb: (ws: MainSocket, ...data: Parameters<ClientToServerEvents[K]>) => void,
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
        return ws.close()
      }

      ws.autodeleteTimeout = new Timeout(() => {
        if (!ws.inGame) {
          delete this.server.clientList[ws.id]
          console.log('close cuz not in game', ws)
          ws.close()
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
          console.log('close cuz per 5')
          return ws.close()
        }
        const message = binaryMessageToObject(data)
        console.log(message.event)
        this.takeMessage(message, ws)
      })

      ws.on('close', () => {
        this.gameServer.to(ws.id)?.disconnect()
        delete this.server.clientList[ws.id]
        if (this.server.clients.size === 0) this.messagesPer5sInterval.stop()
      })
    })
  }
}
