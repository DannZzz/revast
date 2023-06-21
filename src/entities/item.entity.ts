import { Exclude, Expose } from 'class-transformer'
import {
  Craftable,
  Eatable,
  Equipable,
  Item,
  ItemProps,
  ItemsByTypes,
  Resource,
} from '../game/basic/item.basic'
import { AssetLink } from 'src/structures/Transformer'
import { Size } from 'src/global/global'

type Data = Item<ItemsByTypes>[]

@Exclude()
export class ItemEntity implements ItemProps {
  source?: string
  iconSource: string
  craftable?: Craftable

  name: string

  @Expose()
  setMode?: any

  @Expose()
  size?: Size

  @Expose()
  id: number

  @AssetLink()
  @Expose()
  get url() {
    return this.source
  }

  @AssetLink()
  @Expose()
  get iconUrl() {
    return this.iconSource
  }

  @Expose()
  get craftDuration() {
    return this.craftable?.duration
  }

  @Expose()
  get settable() {
    return 'setMode' in this
  }

  constructor(data: ItemProps) {
    Object.assign(this, data)
  }
}

@Exclude()
export class ItemCompactEntity implements ItemProps {
  constructor(data: ItemProps) {
    Object.assign(this, data)
  }
  @Expose()
  id: number

  @AssetLink()
  @Expose()
  get iconUrl() {
    return this.iconSource
  }

  source?: string
  iconSource: string
  craftable?: Craftable
  flip?: boolean
  @Expose()
  name: string
}
