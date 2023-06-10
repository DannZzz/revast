import { Point, Size } from 'src/global/global'
import { ImageSource, Images } from '../image-base'
import {
  Craftable,
  Highlight,
  HighlightType,
  ItemProps,
  Settable,
  SettableMode,
  SpecialSettable,
} from 'src/game/basic/item.basic'
import {
  BasicStaticItem,
  StaticSettableItem,
} from 'src/game/basic/static-item.basic'
import {
  WallDoorByResourceType,
  WallDoorCraftDuration,
} from 'src/data/config-type'
import { Craft } from '../Craft'
import {
  ActionableInitializator,
  BasicActionableStatic,
  ExtendedSettable,
} from 'src/game/extended/settable/actionable.basic'
import {
  ActionableHolderProps,
  ActionableItemHolder,
} from 'src/game/extended/settable/actionable-holder'
import { BasicSeed, ExtendedSeed } from 'src/game/extended/settable/seed.basic'

class SettableCreator {
  readonly extend = <any>{
    modes: [
      {
        cover: 1,
      },
    ],
    onThe: {},
    craftable: [],
  }
  private _data: any = {}

  hp(val: number) {
    this.extend.hp = val
    return this
  }

  name(val: string) {
    this.extend.name = val
    return this
  }

  duration(seconds: number) {
    this.extend.durationSeconds = seconds
    return this
  }

  itIsWall(wallType: keyof typeof WallDoorByResourceType) {
    this.extend.hp = WallDoorByResourceType[wallType]
    this.size(125, 125).setMode(new Point(0, -125), {
      type: 'circle',
      radius: 45,
    })
    if (!this.extend.craftable) this.extend.craftable = {}
    if (!this.extend.craftable[0]) this.extend.craftable[0] = {}
    this.extend.craftable[0].duration = WallDoorCraftDuration[wallType]
    this.extend.craftable[0].givesXp = 100
    this.extend.showHpRadius = 45
    return this
  }

  mainMode(data: Partial<SettableMode>) {
    this.extend.modes[0] = { ...this.extend.modes[0], ...data }
    return this
  }

  disableCover() {
    this.extend.modes[0].cover = 0
    return this
  }

  cover(val: number) {
    this.extend.modes[0].cover = val
    return this
  }

  craftable(craftable: Partial<Craftable>) {
    if (!this.extend.craftable[0]) this.extend.craftable[0] = craftable
    else
      this.extend.craftable[0] = { ...this.extend.craftable[0], ...craftable }
    return this
  }

  extraCraftable(...craftables: Craftable[]) {
    this.extend.craftable.push(...craftables)
    return this
  }

  sources(source: keyof Images, iconSource: keyof Images) {
    this.extend.source = Images[source]
    this.extend.iconSource = Images[iconSource]
    return this
  }

  source(key: keyof Images) {
    this.extend.source = Images[key]
    return this
  }

  iconSource(key: keyof Images) {
    this.extend.iconSource = Images[key]
    return this
  }

  setMode(
    offset: Point,
    itemSize: Settable['setMode']['itemSize'],
    grid: boolean = false,
  ) {
    this.extend.setMode = { offset, itemSize, grid }
    return this
  }

  mode(...modes: SettableMode[]) {
    this.extend.modes.push(
      ...modes.map((mode) => ({
        ...mode,
        source: mode.source && Images[mode.source],
      })),
    )
    return this
  }

  special(spec: SpecialSettable) {
    this.extend.special = spec
    return this
  }

  onThe(...keys: Array<keyof Settable['onThe']>) {
    this.extend.onThe = keys.reduce(
      (aggr, key) => (aggr[key] = true),
      {},
    ) as any
    return this
  }

  size(width: number, height: number): SettableCreator {
    this.extend.size = new Size(width, height)
    return this
  }

  data<T = ItemProps<Settable>>(data: Partial<T>) {
    this._data = data
    return this
  }

  highlight<T extends HighlightType>(hl: Highlight<T>) {
    this.extend.highlight = hl
    return this
  }

  holders(...holders: ActionableHolderProps[]) {
    this.extend.holders = holders
    return this
  }

  onInit(cb: ActionableInitializator) {
    this.extend.onInit = cb
    return this
  }

  actionable(
    settable: Partial<
      ExtendedSettable<{
        draw: { backgroundSource: ImageSource } & ExtendedSettable['draw']
      }>
    >,
  ) {
    if (settable.draw) {
      settable.draw.backgroundSource = Images[
        settable.draw.backgroundSource
      ] as any
    }

    Object.assign(this.extend, settable)
    return this
  }

  seed(settable: Partial<ExtendedSeed>) {
    Object.assign(this.extend, settable)
    return this
  }

  onDestroy(cb: (settable: StaticSettableItem) => void) {
    this.extend.onDestroy = cb
    return this
  }

  buildSeed() {
    this.format()
    return new BasicSeed({ ...this.extend, ...this._data })
  }

  buildActionable() {
    this.format()
    return new BasicActionableStatic({ ...this.extend, ...this._data })
  }

  build() {
    this.format()
    return new BasicStaticItem({ ...this.extend, ...this._data })
  }

  private format() {
    this.extend.modes[0] = {
      source: this.extend.source,
      ...this.extend.modes[0],
    }
    this.extend.modes = this.extend.modes.map(
      (modeProps) => new SettableMode(modeProps),
    )

    const { craftable, ...otherProps } = this.extend
    craftable.forEach((crft) => {
      Craft.addCraft(this.extend.id, crft)
    })
    delete this.extend.craftable
    return this
  }
}

const createSettable = (id: number, type?: string) => {
  const creator = new SettableCreator()
  creator.extend.id = id
  if (type) creator.extend.type = type
  return creator
}

export default createSettable
