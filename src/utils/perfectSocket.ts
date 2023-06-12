import { MainSocket } from 'src/ws/events/events'

export const perfectSocket = <T extends MainSocket>(socket: T): T => {
  return socket
    ? socket
    : ({ send: () => {}, emit: () => {}, on: () => {} } as any)
}
