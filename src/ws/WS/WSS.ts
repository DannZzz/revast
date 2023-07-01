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
import CollectedIps from 'src/utils/collected-ips'

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
      ip: socket?.ip,
      close: () => socket?.close(1000, 'player died'),
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
      let ip = req.socket.remoteAddress
      // let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
      // . . .
      console.log(
        'ws ips, headers: ',
        req.headers['x-forwarded-for'],
        req.socket.remoteAddress,
      )
      ws.ip = ip
      let userAgent = req.headers['user-agent']
      let origin = req.headers['origin']
      // . . .
      const allowedOrigins = [config.get('WEB')]
      if (
        process.env.NODE_ENV === 'production' &&
        (!origin || !allowedOrigins.includes(origin))
      ) {
        return ws.close(1000, 'blocked origin')
      }

      // checking ip
      if (
        !ip ||
        (process.env.NODE_ENV === 'production' ? ip?.length <= 5 : false) ||
        !CollectedIps.has(ip) ||
        CollectedIps.get(ip).connections >= 4 ||
        CollectedIps.get(ip).lastConnection > Date.now()
      ) {
        console.log('throw ip', ip, CollectedIps.get(ip))
        ws.close(1000, 'error')
        return
      }

      CollectedIps.get(ip).lastConnection = Date.now() + 2000
      CollectedIps.get(ip).connections++
      ws.autodeleteTimeout = new Timeout(() => {
        if (!ws.inGame) {
          delete this.server.clientList[ws.id]
          ws.close(1000, 'unused socket')
        }
      }, 8000).run()

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

      ws.on('close', (code, reason) => {
        // console.log(code, binaryMessageToObject(reason))
        console.log('closed', ip)
        CollectedIps.get(ip).connections--
        this.gameServer.to(ws.id)?.disconnect()
        delete this.server.clientList[ws.id]
        if (this.server.clients.size === 0) this.messagesPer5sInterval.stop()
      })

      ws.on('message', (d) => {
        if (typeof d === 'string') return
        ws.messagesPer5s++
        if (ws.messagesPer5s > MAXIMUM_MESSAGE_SIZE_FOR_WS_PER_5S) {
          return ws.close(1000, 'spam')
        }
        let message: WsMessage<string, {}> | false = binaryMessageToObject(d)
        if (!message) {
          console.log('invalid message, closing')
          ws.close()
          return
        }
        if (
          typeof message !== 'object' ||
          Array.isArray(message) ||
          !('event' in message) ||
          !('data' in message)
        )
          return ws.close()
        const { event, data } = message
        if (event !== 'joinServer' && !ws.requestToJoin)
          return console.log('not join server no request')

        this.takeMessage({ event, data }, ws)
      })
    })
  }
}
