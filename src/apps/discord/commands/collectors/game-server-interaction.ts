import { Chest } from 'anytool'
import GameServers from 'src/servers/game-servers'
import { DJCommandLikeArguments } from '../Command'

interface DJInteractionData {
  expects?: { args: DJCommandLikeArguments; after: DJInteractionDataCallback }
  currentServer?: string
}

type DJInteractionDataCallback = (this: DJInteractionData, args: string) => void

export class DJGameServerInteraction {
  static readonly collectors = new Chest<string, DJInteractionData>()

  static isExpecting(id: string) {
    return !!this.collectors.get(id)?.expects
  }

  static expect(
    id: string,
    args: DJCommandLikeArguments,
    after: DJInteractionDataCallback,
  ) {
    const expects = { args, after }
    if (this.collectors.has(id)) {
      this.collectors.get(id).expects = expects
    } else {
      this.collectors.set(id, { expects })
    }
    return this
  }

  static tryFor(id: string, args: string) {}

  static servers() {
    return [...GameServers.values()]
  }
}
