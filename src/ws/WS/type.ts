import { ServerToClientEvents } from '../events/events'

export interface WsMessage<
  K extends string = string,
  T extends Record<any, any> = {},
> {
  event: K
  data: T[K]
}

export interface Emitable {
  emit: <K extends keyof ServerToClientEvents>(
    event: K,
    ...data: Parameters<ServerToClientEvents[K]>
  ) => void
  id?: string
  close: () => void
  ip?: string
}
