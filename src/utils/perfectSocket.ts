import { Socket } from 'socket.io'

export const perfectSocket = <T extends Socket>(socket: T): T => {
  return socket ? socket : ({ emit: () => {}, on: () => {} } as any)
}
