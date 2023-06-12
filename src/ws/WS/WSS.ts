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
import { BSON } from 'bson'

export class Wss {
  listeners: Array<{ event: string; cb: Function }> = []

  constructor(
    private server: MainServer,
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
    this.server.on('connection', (ws: MainSocket) => {
      ws.id = `ws-${(() => {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
        }
        return s4() + s4() + '-' + s4()
      })()}`
      this.server.clientList[ws.id] = ws
      // ws.binaryType = 'arraybuffer'
      ws.on('message', (data) => {
        const message = binaryMessageToObject(data)
        this.takeMessage(message, ws)
      })

      ws.on('close', () => {
        this.gameServer.to(ws.id)?.disconnect()
        delete this.server.clientList[ws.id]
      })
    })
  }
}
