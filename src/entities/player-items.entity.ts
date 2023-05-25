import { ValidateNested } from 'class-validator'
import { ItemEntity } from './item.entity'
import { Type } from 'class-transformer'

export class PlayerItemsEntity {
  @Type(() => ItemEntity)
  @ValidateNested()
  item: ItemEntity
  quantity: number
  equiped?: boolean

  constructor(data: Partial<PlayerItemsEntity>) {
    Object.assign(this, data)
  }
}
