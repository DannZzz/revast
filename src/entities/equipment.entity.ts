import { Exclude, Expose, Transform } from 'class-transformer'
import { Point, Size } from 'src/global/global'
import { ItemProps, TwoHandModeNode } from '../game/basic/item.basic'
import { AssetLink } from 'src/structures/Transformer'

@Exclude()
export class EquipmentEntity {
  @AssetLink()
  @Expose({ name: 'url' })
  source?: string
  iconSource: string

  @Expose()
  flip?: boolean

  @Expose()
  drawPosition: Point

  @Expose()
  startRotationWith: number

  @Expose()
  toggleClicks?: number

  @Expose()
  size: Size

  @Expose()
  twoHandMode?: {
    active?: TwoHandModeNode
    noActive?: TwoHandModeNode
  }

  @Expose()
  range: number

  constructor(data: Partial<EquipmentEntity>) {
    Object.assign(this, data)
  }
}
