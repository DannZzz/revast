import { Exclude, Expose, Transform } from 'class-transformer'
import { Point, Size } from 'src/global/global'
import { ItemProps, TwoHandModeNode } from '../game/basic/item.basic'
import { AssetLink } from 'src/structures/Transformer'

@Exclude()
export class WearingEntity {
  @AssetLink()
  @Expose({ name: 'url' })
  source?: string
  iconSource: string

  @Expose()
  drawPosition: Point

  @Expose()
  size: Size

  constructor(data: Partial<WearingEntity>) {
    Object.assign(this, data)
  }
}
