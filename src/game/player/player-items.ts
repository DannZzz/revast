import { Transformer } from 'src/structures/Transformer'
import {
  Eatable,
  Equipable,
  Item,
  ItemsByTypes,
  Wearable,
} from '../basic/item.basic'
import type { Player } from './player'
import { Chest } from 'anytool/dist/Chest'
import { getPointByTheta } from '../animations/rotation'
import { itemById, Items } from 'src/data/items'
import { EquipmentEntity } from 'src/entities/equipment.entity'
import { ItemEntity } from 'src/entities/item.entity'
import { PlayerItemsEntity } from 'src/entities/player-items.entity'
import { Biome } from 'src/structures/GameMap'
import { BasicStaticItem } from '../basic/static-item.basic'
import {
  BAG_SPACE,
  PLAYER_ITEMS_SPACE,
  SERVER_API,
  START_ITEMS,
} from 'src/constant'
import { BasicDrop } from '../basic/drop.basic'
import { Images } from 'src/structures/image-base'
import { Size } from 'src/global/global'
import { WearingEntity } from 'src/entities/wearing.entity'

interface PlayerItem<T extends ItemsByTypes> {
  item: Item<T>
  quantity: number
  equiped?: boolean
  weared?: boolean
}

export class PlayerItems {
  private _isCrafting: null | number = null
  readonly specialItems = { bag: <number>44 }
  private _items = new Chest<number, PlayerItem<ItemsByTypes>>(
    START_ITEMS() as any,
  )

  private itemsAreCraftableRN: Chest<number, Item<ItemsByTypes>> = new Chest()
  private craftableItemsAreChanged: boolean

  get space() {
    return PLAYER_ITEMS_SPACE + (this.specialItems.bag ? BAG_SPACE : 0)
  }

  constructor(private player: Player) {
    this.player.actions.state.actualStates.fire.onChange(() => {
      this.update()
    })
    this.player.actions.state.actualStates.workbench.onChange((newVal) => {
      this.update()
    })
  }

  get isCrafting() {
    return this._isCrafting
  }

  set isCrafting(val) {
    this._isCrafting = val
  }

  hasEmptySpace() {
    return this._items.size < this.space
  }

  has(id: number): boolean
  has(id: number, quantity: number): boolean
  has(id: number, quantity?: number): boolean {
    id = +id
    if (!this._items.has(id)) return false
    if (quantity === undefined) return true
    const item = this._items.get(id)
    return item.quantity >= quantity
  }

  addable(id: number): boolean
  addable(id: number, crafting: boolean): boolean
  addable(id: number, crafting: boolean = false): boolean {
    if (this.has(id)) return true
    if (!crafting) return this.hasEmptySpace()
    const item = Items.get(id)
    if (!item || !item.craftable) return false
    if (item.data.notAddable) return true
    let clone = this.items
    const craft = $(item.craftable.required)
    clone.forEach((it) => {
      if (craft.$has(it.item.id)) {
        it.quantity -= craft[it.item.id]
      }
    })
    return this.filterItems(clone).size < this.space
  }

  addItem(id: number, quantity: number): boolean {
    if (!quantity) return false
    const item = Items.get(id)
    if (!this.addable(id) || !item) return false
    if (!this._items.has(id)) {
      this._items.set(+id, {
        item,
        quantity,
        equiped: false,
      })
    } else {
      this._items.get(id).quantity += quantity
    }
    this._items = this.filterItems(this._items)
    this.update()
    return true
  }

  setItem(itemId: number): number {
    if (!this.has(itemId)) return -1
    const item = itemById(itemId) as BasicStaticItem
    const pointOfItem = getPointByTheta(
      this.player.point(),
      this.player.theta(),
      Math.abs(item.data.setMode.offset.y),
    )
    const settable = item.toSettable(
      this.player.uniqueId,
      this.player.gameServer,
    )
    settable.preDraw(pointOfItem, this.player.theta(), this.player.angle())
    // checking settable items and bios
    if (
      //
      this.player.staticItems.someWithin(() => {
        if (settable.data.setMode.itemSize.type === 'circle')
          return [settable.centerPoint, settable.data.setMode.itemSize.radius]
        return [settable.points]
      }, true)
    )
      return -1

    // checking water
    if (
      !settable.data.onThe.water &&
      this.player.gameServer().map.biomeOf(settable.centerPoint) == Biome.ocean
    )
      return -1

    // checking other players
    if (
      this.player
        .gameServer()
        .alivePlayers.some((player) => settable.withinStrict(player.points))
    )
      return -1
    this.player.staticItems.addSettables(settable)
    this._items.get(itemId).quantity--
    this._items = this.filterItems(this._items)
    this.update()
    return itemId
  }

  dropItem(id: number, all: boolean = false) {
    if (!this.has(id)) return
    const selected = this._items.get(id)
    const quantity = all ? selected.quantity : 1

    selected.quantity -= quantity
    this._items = this.filterItems(this._items)
    this.update()

    const item = new BasicDrop({
      authorId: this.player.id(),
      data: { id, quantity },
      duration: 15,
      hp: 70,
      size: new Size(75, 75),
      hitboxRadius: 30,
      source: Images.DROP_BOX,
      hurtSource: Images.HURT_DROP_BOX,
      point: this.player.point().clone(),
      onEnd: (drop) => {
        this.player.staticItems.removeDrop(drop.id)
      },
      take(player, data) {
        player.items.addable(data.id) &&
          player.items.addItem(data.id, data.quantity)
      },
    })
    this.player.staticItems.addDrop(item)
  }

  craftItem(id: number) {
    const item = Items.get(id)
    if (!item.craftable || !this.addable(id, true) || this.isCrafting) return
    const craft = $(item.craftable.required)
    if (
      craft.$some((quantity, idOr) => {
        return !this.has(+idOr, quantity)
      })
    ) {
      return
    }

    if (item.data.specialName && this.specialItems[item.data.specialName])
      return

    const items = this.items
    items.forEach((it) => {
      if (craft.$has(it.item.id)) {
        it.quantity -= craft[it.item.id]
      }
    })
    this._items = this.filterItems(items)
    this.isCrafting = id
    this.update()
    const isBook = this.equiped?.item.data.specialName === 'book'
    this.player.socket().emit('playerCraft', [true, +id, isBook])
    setTimeout(() => {
      this.isCrafting = null
      if (item.data.specialName === 'bag') {
        this.specialItems[item.data.specialName] = item.id
        this.update()
      } else {
        this.addItem(id, 1)
      }
      this.player.lbMember.add(item.craftable.givesXp)
      this.player.socket().emit('playerCraft', [false, +id])
    }, (item.craftable.duration * 1000) / (isBook ? 2 : 1))
  }

  private filterItems(
    items: PlayerItem<ItemsByTypes>[] | Chest<number, PlayerItem<ItemsByTypes>>,
  ): Chest<number, PlayerItem<ItemsByTypes>> {
    const chest = new Chest<number, PlayerItem<ItemsByTypes>>()
    ;(items as any)
      .filter((item) => item.quantity > 0)
      .forEach((item) => chest.set(item.item.id, item))
    return chest
  }

  get items() {
    return $([...this._items.map((item) => ({ ...item }))])
  }

  requestEquip(id: number) {
    const item = this._items.find((it) => it.item.id === id)
    if (!item || !item.item.isEquipable()) return
    const clone = this.items
    this._items.forEach((item) => {
      if (!item.item.isEquipable()) return
      if (item.item.id === id) item.equiped = !item.equiped
      else item.equiped = false
    })
    this.update()
  }

  requestWearing(id: number) {
    const item = this._items.find((it) => it.item.id === id)
    if (!item || !item.item.isWearable()) return
    const clone = this.items
    this._items.forEach((item) => {
      if (!item.item.isWearable()) return
      if (item.item.id === id) item.weared = !item.weared
      else item.weared = false
    })
    this.update()
  }

  get equiped(): PlayerItem<Equipable> | null {
    return (this._items.find((it) => it.equiped) as any) || null
  }

  get weared(): PlayerItem<Wearable> | null {
    return (this._items.find((it) => it.weared) as any) || null
  }

  click(id: number) {
    if (!this.player.actions.click.can) return
    const selected = this._items.get(id)
    // console.log(selected, selected.item.id, typeof selected.item.id)
    if (!selected) return
    if (selected.item.isEquipable()) {
      this.requestEquip(selected.item.id)
    }
    if (selected.item.isEatable()) {
      this.eat(selected.item)
    }
    if (selected.item.isWearable()) {
      this.requestWearing(selected.item.id)
    }
  }

  eat(id: number): void
  eat(item: Item<Eatable>): void
  eat(arg1: number | Item<Eatable>) {
    let item: Item<Eatable>
    if (typeof arg1 == 'number') {
      item = Items.get(arg1) as any
      if (!item || !item.isEatable()) return
    } else {
      item = arg1
    }
    if (!this.has(item.id)) return
    const items = this.items
    items[items.findIndex((it) => it.item.id == item.id)].quantity--
    this.player.bars.hungry.value += item.data.toFood || 0
    this.player.bars.hp.value += item.data.toHealth || 0
    this.player.bars.socketUpdate()
    this._items = this.filterItems(items)
    this.update()
  }

  setCraftableItems() {
    if (this.isCrafting) return

    const allCraftableItems = Items.filter((item) => !!item.craftable)
    const itemsAreCraftableRN = allCraftableItems.filter((item) => {
      if (item.data.maxAmount) {
        if (
          this.has(item.id, item.data.maxAmount) ||
          this.specialItems[item.data.specialName]
        )
          return false
      }
      if (item.craftable.state) {
        if (
          $(item.craftable.state).$some(
            (value, key) =>
              value && !this.player.actions.state.actualStates[key](),
          )
        )
          return false
      }
      return $(item.craftable.required).$every((quantity, idOr) => {
        return this.has(idOr, quantity)
      })
    })
    this.craftableItemsAreChanged = !$(itemsAreCraftableRN).$same(
      this.itemsAreCraftableRN,
    )
    this.itemsAreCraftableRN = itemsAreCraftableRN
  }

  update() {
    const socket = this.player.socket()
    this.setCraftableItems()
    socket.emit('playerItems', [
      this._items.map((playerItem) =>
        Transformer.toPlain(
          new PlayerItemsEntity({
            ...playerItem,
            item: new ItemEntity(playerItem.item.data),
          }),
        ),
      ),
      {
        items: this.itemsAreCraftableRN.map((item) =>
          Transformer.toPlain(new ItemEntity(item.data)),
        ),
        changed: this.craftableItemsAreChanged,
      }, //
      this.space,
      this.specialItems.bag
        ? SERVER_API(`/assets/${Items.get(this.specialItems.bag).source}`)
        : null,
    ])
    const equipment = this.equiped
    socket.emit('playerEquipment', [
      equipment
        ? Transformer.toPlain(new EquipmentEntity(equipment.item.data))
        : null,
    ])
    const wearing = this.weared
    socket.emit('playerWearing', [
      wearing
        ? Transformer.toPlain(new WearingEntity(wearing.item.data))
        : null,
    ])
  }
}
