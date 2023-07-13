import { Exclude, Expose } from 'class-transformer'
import { Misc } from 'src/game/basic/misc.basic'
import { GameServer } from 'src/game/server'
import { Size, Point } from 'src/global/global'
import { AssetLink } from 'src/structures/Transformer'
import { ImageSource } from 'src/structures/image-base'
import { uniqueId } from 'src/utils/uniqueId'
import { UniversalHitbox } from 'src/utils/universal-within'

@Exclude()
export class MiscEntity implements Partial<Misc> {
  mapId: number
  @AssetLink()
  @Expose({ name: 'url' })
  source: ImageSource
  @Expose()
  size: Size
  @Expose()
  readonly id = uniqueId()
  @Expose()
  point: Point
  constructor(props: Misc) {
    Object.assign(this, props)
  }
  afterCreating?: (this: Misc, gameServer: GameServer) => void

  preCreate(point: Point) {
    this.point = point
  }

  get universalHitbox(): UniversalHitbox {
    return { size: this.size, point: this.point }
  }
}
