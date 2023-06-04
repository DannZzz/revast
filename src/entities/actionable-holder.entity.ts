import { Expose } from 'class-transformer'
import { Point } from 'src/global/global'
import { AssetLink } from 'src/structures/Transformer'

export class ActionableHolderEntity {
  quantity: number
  itemId: number
  drawOffset: Point
  noBackground: boolean
  takeable: boolean

  @AssetLink()
  @Expose({ name: 'iconUrl' })
  iconSource: string

  constructor(data: ActionableHolderEntity) {
    Object.assign(this, data)
  }
}
