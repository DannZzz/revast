import { Socket, io } from "socket.io-client"
import { MainSocket } from "./events"

export let socket: MainSocket
export const connectWS = (api: string) => {
  socket = io(api)
}

export const disconnectWS = () => {
  socket.disconnect()
  socket = null
}
