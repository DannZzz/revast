import { Point, Size } from 'src/global/global'
import { Images } from '../image-base'
import {
  Craftable,
  Highlight,
  HighlightType,
  ItemProps,
  Settable,
  SettableMode,
  SpecialSettable,
} from 'src/game/basic/item.basic'
import { BasicStaticItem } from 'src/game/basic/static-item.basic'
import {
  WallDoorByResourceType,
  WallDoorCraftDuration,
} from 'src/data/config-type'
import { Craft } from '../Craft'

class SettableCreator {
  readonly extend = <any>{ cover: true, onThe: {}, craftable: [] }
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

  disableCover() {
    this.extend.cover = false
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

  setMode(offset: Point, itemSize: Settable['setMode']['itemSize']) {
    this.extend.setMode = { offset, itemSize }
    return this
  }

  mode(mode: SettableMode) {
    this.extend.mode = mode
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

  data(data: Partial<ItemProps<Settable>>) {
    this._data = data
    return this
  }

  highlight<T extends HighlightType>(hl: Highlight<T>) {
    this.extend.highlight = hl
    return this
  }

  build() {
    const { craftable, ...otherProps } = this.extend
    craftable.forEach((crft) => {
      Craft.addCraft(this.extend.id, crft)
    })
    return new BasicStaticItem({ ...otherProps, ...this._data })
  }
}

const createSettable = (id: number, type?: string) => {
  const creator = new SettableCreator()
  creator.extend.id = id
  if (type) creator.extend.type = type
  return creator
}

export default createSettable
