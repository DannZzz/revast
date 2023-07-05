import { Point, Size } from 'src/global/global'
import { ItemProps, Settable, SettableMode } from '../game/basic/item.basic'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { AssetLink } from 'src/structures/Transformer'
import { StaticSettableItem } from '../game/basic/static-item.basic'
import { GetSet } from 'src/structures/GetSet'
import { percentFrom, percentOf } from 'src/utils/percentage'
import { SeedSettableItem } from 'src/game/extended/settable/seed.settable'
import { NB } from 'src/utils/NumberBoolean'

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

    if (data instanceof SeedSettableItem) {
      this.seedResource = {
        resources: data.resource(),
        maxResources: data.data.maxResource,
      }
    }
  }

  data: ItemProps<Settable>
  points: Point[]
  authorId: number
  theta: number
  tempHp?: GetSet<number>

  @Transform(({ value }) => value?.())
  @Expose({ name: 'currentMode' })
  currentModeIndex?: GetSet<number>

  @Expose()
  showHp?: {
    radius: number
    angle: number
  }

  @Expose()
  seedResource?: {
    resources: number
    maxResources: number
  }

  @Expose()
  get noAttackedAnimation() {
    return NB.to(this.data.noAttackedAnimation)
  }

  @Type(() => SettableMode)
  @Expose()
  get modes() {
    return this.data.modes
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
