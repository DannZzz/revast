import { EventEmitter, Listener } from "../canvas/utils/EventEmitter"
import {
  ClientToServerEvents,
  MainSocket,
  ServerToClientEvents,
} from "./events"

export let socket: WS
export const connectWS = (api: string) => {
  socket = new WS(api)
}

export const disconnectWS = () => {
  socket?.close()
  socket = null
}

type SC = {
  [k in keyof ServerToClientEvents]: Parameters<ServerToClientEvents[k]>
}

type CS = {
  [k in keyof ClientToServerEvents]: Parameters<ClientToServerEvents[k]>
}

class WS {
  private socket: WebSocket

  listeners: Listener<SC, keyof SC>[] = []

  constructor(url: string) {
    this.socket = new WebSocket(url)
    this.socket.binaryType = "arraybuffer"

    this.socket.onmessage = (ev) => {
      const eventObj: any = JSON.parse(
        creatingProcess(convertProcessFromArray(ev.data))
      )
      this.listeners.forEach(
        (l) => l.event === eventObj.event && l.cb(...eventObj.data)
      )
    }
  }

  on<K extends keyof SC>(event: K, cb: (...data: SC[K]) => void): void {
    this.listeners.push(new Listener(event, cb))
  }

  emit<K extends keyof CS>(event: K, ...data: CS[K]): void {
    wsSend(this.socket, killingProcess(JSON.stringify({ event, data })))
  }

  close() {
    this.socket.close()
  }
}

function wsSend(socket: WebSocket, data: any) {
  // readyState - true, если есть подключение
  if (!socket.readyState) {
    setTimeout(function () {
      wsSend(socket, data)
    }, 100)
  } else {
    socket.send(data)
  }
}

function killingProcess(str: string) {
  var string = btoa(unescape(encodeURIComponent(str))),
    charList = string.split(""),
    uintArray = []
  for (var i = 0; i < charList.length; i++) {
    uintArray.push(charList[i].charCodeAt(0))
  }
  return new Uint8Array(uintArray)
}

function creatingProcess(uintArray) {
  var encodedString = String.fromCharCode.apply(null, uintArray),
    decodedString = decodeURIComponent(escape(atob(encodedString)))
  return decodedString
}

function convertProcessFromArray(ab) {
  return Buffer.from(new Uint8Array(ab))
}
