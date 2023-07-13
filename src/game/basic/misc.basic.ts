import { Point, Size } from 'src/global/global'
import { ImageSource } from 'src/structures/image-base'
import { unique, uuid } from 'anytool'
import { UniversalHitbox } from 'src/utils/universal-within'
import { GameServer } from '../server'
import { uniqueId } from 'src/utils/uniqueId'

export interface BasicMiscProps {
  source: ImageSource
  size: Size
  mapId: number
  afterCreating?: (this: Misc, gameServer: GameServer) => void
}

export class BasicMisc {
  constructor(readonly props: BasicMiscProps) {}

  generate(gameServer: GameServer): Misc {
    return new Misc(this.props, gameServer)
  }
}

export class Misc implements BasicMiscProps {
  mapId: number
  source: ImageSource
  size: Size
  readonly id = uniqueId()

  point: Point
  afterCreating?: (this: Misc, gameServer: GameServer) => void
  constructor(props: BasicMiscProps, readonly gameServer: GameServer) {
    Object.assign(this, props)
  }

  preCreate(point: Point) {
    this.point = point
    if (this.afterCreating) this.afterCreating.call(this, this.gameServer)
  }

  get universalHitbox(): UniversalHitbox {
    return { size: this.size, point: this.point }
  }
}
