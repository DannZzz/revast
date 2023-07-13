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
import { getDistance, getPointByTheta } from '../animations/rotation'
import { itemById, Items } from 'src/data/items'
import { EquipmentEntity } from 'src/entities/equipment.entity'
import { ItemEntity } from 'src/entities/item.entity'
import { PlayerItemsEntity } from 'src/entities/player-items.entity'
import { Biome } from 'src/structures/GameMap'
import { BasicStaticItem } from '../basic/static-item.basic'
import {
  BAG_SPACE,
  GRID_SET_RANGE,
  PLAYER_ITEMS_SPACE,
  SERVER_API,
  START_ITEMS,
  TIMEOUT_BUILDING,
  TIMEOUT_UNPICK_WEAPON,
  TIMEOUT_UNWEAR_HELMET,
} from 'src/constant'
import { BasicDrop } from '../basic/drop.basic'
import { Images } from 'src/structures/image-base'
import { Point, Size, combineClasses } from 'src/global/global'
import { WearingEntity } from 'src/entities/wearing.entity'
import { UniversalHitbox } from 'src/utils/universal-within'
import { Craft } from 'src/structures/Craft'
import { CraftEntity } from 'src/entities/craft.entity'
import { SpecialItemTypes } from 'src/data/config-type'
import { PlayerItemTimeout } from '../types/player.types'
import { NB } from 'src/utils/NumberBoolean'
import { isNumber } from 'class-validator'

interface PlayerItem<T extends ItemsByTypes> {
  item: Item<T>
  quantity: number
  equiped?: boolean
  weared?: boolean
}

export class PlayerItems {
  private _isCrafting: null | string = null
  readonly specialItems = { bag: <number>null } // 44
  _items = new Chest<number, PlayerItem<ItemsByTypes>>(START_ITEMS() as any)

  readonly timeout: PlayerItemTimeout = {
    weapon: 0,
    helmet: 0,
    building: 0,
  }

  private craftsRN: Chest<string, Craft> = new Chest()
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
    this.player.actions.state.actualStates.water.onChange((newVal) => {
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
  addable(id: number, craftingId: string): boolean
  addable(id: number, craftingId?: string): boolean {
    if (this.has(id)) return true
    if (!craftingId) return this.hasEmptySpace()
    const item = Items.get(id)
    const craftData = Craft.data.get(craftingId)
    if (!item || !craftData) return false
    if (item.data.notAddable) return true
    let clone = this.items
    const craft = $(craftData.craftable)
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
    if (item.data.specialName === 'bag') {
      if (this.specialItems.bag) return false
      this.specialItems[item.data.specialName] = item.id
      this.update()
      return true
    }
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

  setItem(
    itemId: number,
    cursorX: number,
    cursorY: number,
    grid: boolean,
  ): number {
    if (this.timeout.building > Date.now() || this.isCrafting) return -1
    if (!this.has(itemId)) return -1
    const item = itemById(itemId) as BasicStaticItem
    if (!('hp' in item.data)) return -1
    if (isNumber(item.data.max)) {
      const items = this.player.staticItems
        .for('all')
        .settable.filter(
          (item) =>
            item.data.id === itemId && item.authorId === this.player.uniqueId,
        )
      if (items.length >= item.data.max) return -1
    }
    let point: Point, theta: number, angle: number

    if (grid || item.data.setMode.grid) {
      theta = angle = 0

      const cursor = combineClasses(
        this.player.camera.point(),
        new Point(cursorX, cursorY),
      )
      const tile = this.player.gameServer.map.tileSize

      const cursorTile = combineClasses(
        cursor,
        new Point(tile.width / 2, tile.height / 2),
      )

      const absolutePoint = getPointByTheta(
        combineClasses(
          new Point(item.data.size.width / 2, item.data.size.height / 2),
          this.player.point(),
        ),
        this.player.theta(),
        getDistance(cursor, this.player.point()) <= GRID_SET_RANGE
          ? getDistance(cursorTile, this.player.point())
          : GRID_SET_RANGE,
      )
      point = new Point(
        absolutePoint.x - (absolutePoint.x % tile.width),
        absolutePoint.y - (absolutePoint.y % tile.height),
      )

      point.x -= tile.width / 2
      point.y -= tile.height / 2
    } else {
      theta = this.player.theta()
      angle = this.player.angle()
      point = getPointByTheta(
        this.player.point(),
        this.player.theta(),
        Math.abs(item.data.setMode.offset.y),
      )
    }

    const settable = item.toSettable(
      this.player.uniqueId,
      this.player.gameServer.alivePlayers,
      this.player.staticItems,
    )
    settable.preDraw(point, theta, angle)
    const staticItems = this.player.staticItems.for(settable.universalHitbox)
    if ('customSettingFilter' in settable.data) {
      if (
        !settable.data.customSettingFilter(
          staticItems,
          settable,
          this.player.gameServer.map,
        )
      )
        return -1
    } else {
      // checking settable items and bios
      if (
        //
        staticItems.someWithin(settable.universalHitbox, {
          strict: true,
          ignore: settable.data.ignoreCheckers,
          type: settable.data.type,
        })
      )
        return -1

      // checking water
      if (
        !settable.data.onThe.water &&
        this.player.gameServer.map.find(
          this.player.gameServer.map.areaOf(settable.centerPoint),
        ).type === Biome.water &&
        !staticItems.someWithin(point, {
          strict: true,
          type: SpecialItemTypes.bridge,
          ignore: 'type',
        })
      )
        return -1

      if (!settable.data.ignoreCheckers) {
        // checking other players
        if (
          this.player.gameServer.alivePlayers.some(
            (player) =>
              player.id() !== this.player.id() &&
              settable.withinStrict(player.points),
          )
        )
          return -1

        // checkin mobs
        const itemUniversalHitBox: UniversalHitbox =
          settable.data.setMode.itemSize.type === 'circle'
            ? {
                point: settable.centerPoint,
                radius: settable.data.setMode.itemSize.radius,
              }
            : settable.points
        if (
          this.player.gameServer.mobs.all.some((mob) =>
            mob.within(itemUniversalHitBox),
          )
        )
          return -1
      }
    }

    this.player.staticItems.for(settable.universalHitbox).addSettables(settable)
    this.timeout.building = Date.now() + TIMEOUT_BUILDING * 1000
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
      hp: 30,
      size: new Size(75, 75),
      hitboxRadius: 30,
      source: Images.DROP_BOX,
      hurtSource: Images.HURT_DROP_BOX,
      point: this.player.point().clone(),
      onEnd: (drop) => {
        this.player.staticItems.for(drop.universalHitbox).removeDrop(drop.id)
      },
      take(player, data) {
        player.items.addable(data.id) &&
          player.items.addItem(data.id, data.quantity)
      },
    })
    this.player.staticItems.for(item.universalHitbox).addDrop(item)
  }

  craftItem(craftId: string) {
    const craftData = Craft.data.get(craftId)
    if (!craftData) return
    const item = Items.get(craftData.itemId)
    if (
      !item.craftable ||
      !this.addable(craftData.itemId, craftId) ||
      this.isCrafting
    )
      return
    const craft = $(craftData.craftable.required)
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
    this.isCrafting = craftData.id
    const isBook = this.equiped?.item.data.specialName === 'book'
    this.player.socket().emit('playerCraft', [true, craftId, isBook])
    this.update()
    const t = setTimeout(
      () => {
        this.isCrafting = null
        this.player.socket().emit('playerCraft', [false, craftId])
        if (item.data.specialName === 'bag') {
          this.specialItems[item.data.specialName] = item.id
          this.update()
        } else {
          this.addItem(craftData.itemId, 1)
        }
        this.player.lbMember.add(craftData.craftable.givesXp)
        clearTimeout(t)
      },
      this.player.settings.instaCraft()
        ? 100
        : (craftData.craftable.duration * 1000) / (isBook ? 2 : 1),
    )
  }

  filterItems(
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
    if (this.timeout.weapon > Date.now()) return
    const item = this._items.find((it) => it.item.id === id)
    if (!item || !item.item.isEquipable()) return
    const clone = this.items
    this._items.forEach((item) => {
      if (!item.item.isEquipable()) return
      if (item.item.id === id) {
        item.equiped = !item.equiped
        if (item.item.data.type === 'weapon' && item.equiped)
          this.timeout.weapon = Date.now() + TIMEOUT_UNPICK_WEAPON * 1000
      } else item.equiped = false
    })
    this.update()
  }

  requestWearing(id: number) {
    if (this.timeout.helmet > Date.now()) return
    const item = this._items.find((it) => it.item.id === id)
    if (!item || !item.item.isWearable()) return
    const clone = this.items
    this._items.forEach((item) => {
      if (!item.item.isWearable()) return
      if (item.item.id === id) {
        item.weared = !item.weared
        if (item.item.data.type === 'helmet' && item.weared)
          this.timeout.helmet = Date.now() + TIMEOUT_UNWEAR_HELMET * 1000
      } else item.weared = false
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
    this.player.bars.h2o.value += item.data.toWater || 0
    item.data.custom?.(this.player)
    this.player.bars.socketUpdate()
    this.player.damage(-item.data.toHealth || 0, 'absolute')
    this._items = this.filterItems(items)
    this.update()
    if (item.data.giveAfterEat) this.addItem(item.data.giveAfterEat, 1)
  }

  setCraftableItems() {
    if (this.isCrafting) return

    const allCraftableItems = Craft.data
    const craftsRN = allCraftableItems.filter((craft) => {
      const item = Items.get(craft.itemId)
      if (item.data.maxAmount) {
        if (
          this.has(item.id, item.data.maxAmount) ||
          this.specialItems[item.data.specialName]
        )
          return false
      }
      if (craft.craftable.state) {
        if (
          $(craft.craftable.state).$some(
            (value, key) =>
              value && !this.player.actions.state.actualStates[key](),
          )
        )
          return false
      }
      return $(craft.craftable.required).$every((quantity, idOr) => {
        return this.has(+idOr, quantity)
      })
    })
    this.craftableItemsAreChanged = !$(craftsRN).$same(this.craftsRN)
    this.craftsRN = craftsRN
  }

  update() {
    this.setCraftableItems()
    const socket = this.player.socket()

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
        items: this.craftsRN.map((crft) =>
          Transformer.toPlain(
            new CraftEntity({
              id: crft.id,
              craftDuration: crft.craftable.duration,
              iconSource: Items.get(crft.itemId).iconSource,
              itemId: crft.itemId,
            }),
          ),
        ),
        changed: this.craftableItemsAreChanged,
      }, //
      this.space,
      this.specialItems.bag
        ? SERVER_API(`/api/images/${Items.get(this.specialItems.bag).source}`)
        : null,
    ])
    const equipment = this.equiped
    socket.emit('playerEquipment', [
      equipment
        ? Transformer.toPlain(new EquipmentEntity(equipment.item.data))
        : null,
      NB.to(this.timeout.weapon > Date.now()),
    ])
    const wearing = this.weared
    socket.emit('playerWearing', [
      wearing
        ? Transformer.toPlain(new WearingEntity(wearing.item.data))
        : null,
      NB.to(this.timeout.helmet > Date.now()),
    ])
    this.player.actions.actionablesUpdate()
  }
}
