import { Point, Size } from 'src/global/global'
import { ItemProps, Settable, SettableMode } from '../game/basic/item.basic'
import { Exclude, Expose, Transform } from 'class-transformer'
import { AssetLink } from 'src/structures/Transformer'
import { StaticSettableItem } from '../game/basic/static-item.basic'
import { GetSet } from 'src/structures/GetSet'
import { percentFrom, percentOf } from 'src/utils/percentage'

@Exclude()
export class StaticSettableEntity implements Partial<StaticSettableItem> {
  constructor(data: Partial<StaticSettableEntity>) {
    Object.assign(this, data)
    if (data.data.showHpRadius) {
      this.showHp = {
        radius: data.data.showHpRadius,
        angle: percentOf(percentFrom(data.tempHp(), data.data.hp), 360),
      }
    }
  }

  data: ItemProps<Settable>
  points: Point[]
  authorId: number
  theta: number
  tempHp?: GetSet<number>

  @Expose()
  showHp?: {
    radius: number
    angle: number
  }

  @Expose()
  @Transform(({ value }) => value())
  modeEnabled: GetSet<boolean>

  @AssetLink()
  @Expose()
  get modeUrl() {
    return this.data.mode?.source
  }

  @Expose()
  get cover() {
    return this.data.cover
  }

  @Expose()
  get type() {
    return this.data.type
  }

  @Expose()
  get highlight() {
    return this.data.highlight
  }

  @Expose()
  point: Point
  @Expose()
  rotation: number
  @Expose()
  id: string

  @AssetLink()
  @Expose()
  get url() {
    return this.data.source
  }

  @AssetLink()
  @Expose()
  get iconUrl() {
    return this.data.iconSource
  }

  @Expose()
  get size() {
    return this.data.size
  }

  @Expose()
  get setMode() {
    return this.data.setMode
  }
}
