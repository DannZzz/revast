import {
  CraftDuration,
  CraftGivingXP,
  DrawPosByType,
  EquipableItemVariant,
  EquipmentItemSize,
  HelmetsDefenseByResourceType,
  RangeByType,
} from 'src/data/config-type'
import { ResourceTypes } from 'src/game/basic/bio-item.basic'
import {
  Craftable,
  EquipableItemType,
  Item,
  ItemProps,
  ItemsByTypes,
  Wearable,
  WearableEffect,
} from 'src/game/basic/item.basic'
import { Point, Size } from 'src/global/global'
import { Images } from '../image-base'
import { Craft } from '../Craft'

class ItemCreator {
  private _data: Partial<ItemProps<ItemsByTypes>>
  readonly extend = <any>{ craftable: [] }

  setVariant(variant: EquipableItemVariant) {
    this.extend.drawPosition = DrawPosByType[variant]
    this.extend.range = RangeByType[variant]
    return this
  }

  name(val: string) {
    this.extend.name = val
    return this
  }

  setItemResourceType(resource: ResourceTypes) {
    if (!this.extend.craftable[0]) this.extend.craftable[0] = {}
    this.extend.craftable[0].givesXp = CraftGivingXP[resource]
    this.extend.craftable[0].duration = CraftDuration[resource]

    if (this.extend.type === 'helmet') {
      this.extend.defense = {
        player: HelmetsDefenseByResourceType[resource][0],
        mob: HelmetsDefenseByResourceType[resource][1],
      }
    }

    return this
  }

  wearableEffect(effect: Partial<WearableEffect>) {
    this.extend.effect = new WearableEffect(effect)
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

  equipableDefault() {
    this.extend.equipable = true
    this.extend.startRotationWith = 0
    this.extend.toggleClicks = 1
    this.extend.resourceGettingPower = {}
    return this
  }

  sources(source: keyof typeof Images, iconSource: keyof typeof Images) {
    this.extend.source = Images[source]
    this.extend.iconSource = Images[iconSource]
    return this
  }

  source(key: keyof typeof Images) {
    this.extend.source = Images[key]
    return this
  }

  iconSource(key: keyof typeof Images) {
    this.extend.iconSource = Images[key]
    return this
  }

  data(val: Partial<ItemProps<ItemsByTypes>>) {
    this._data = val
    return this
  }

  setEquipmentItemSize(key: keyof typeof EquipmentItemSize) {
    this.extend.size = EquipmentItemSize[key]
    return this
  }

  wearable() {
    this.extend.effect = new WearableEffect({})
    this.extend.drawPosition = new Point()
    this.extend.size = new Size(226, 216)
    this.extend.wearing = true
    return this
  }

  defense(player: number, mob: number) {
    this.extend.defense = { player, mob }
    return this
  }

  build() {
    // if (this.extend.defense)
    // console.log(new Item({ ...this.extend, ...this._data }))
    const { craftable, ...otherProps } = this.extend
    craftable.forEach((crft) => {
      Craft.addCraft(this.extend.id, crft)
    })
    return new Item({ ...otherProps, ...this._data })
  }
}

const createItem = (
  id: number,
  type?: EquipableItemType | Wearable['type'],
  specialName?: string,
) => {
  const item = new ItemCreator()
  item.extend.id = id
  if (type) item.extend.type = type
  if (specialName) item.extend.specialName = specialName
  return item
}

export default createItem
