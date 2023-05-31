import { Layer } from "konva/lib/Layer"
import {
  Eatable,
  Equipable,
  Item,
  ItemsByTypes,
  Settable,
} from "../basic/item.basic"
import type { Player } from "./player"
import { Point, Size, combineClasses } from "../../global/init"
import Konva from "konva"
import { animateTo } from "../animations/to"
import { KonvaText } from "../structures/KonvaText"
import { loadImage } from "../structures/fetchImages"
import { socket } from "../../socket/socket"
import { BasicPlayerItems } from "../basic/player-items.basic"
import { Game } from "../game"
import { NB } from "../utils/NumberBoolean"
import { CraftDto } from "../../socket/events"
import { getPointByTheta } from "../animations/rotation"
import { GRID_SET_RANGE } from "../../constants"

interface PlayerItem<T extends ItemsByTypes> {
  item: Item<T>
  quantity: number
  equiped?: boolean
}

export class PlayerItems extends BasicPlayerItems {
  readonly itemSize = new Size(50, 50)
  readonly itemIconSize = new Size(40, 40)
  readonly gap = 10
  readonly upIfSelected = 5
  private _items: PlayerItem<ItemsByTypes>[] = []
  private space: number = 10
  private itemsAreCraftableRN: CraftDto[]
  private craftsChanged: boolean
  isCrafting: null | string
  private isDrew: boolean = false
  declare player: Player
  private readonly gridMaxRange = GRID_SET_RANGE

  private invGroup: Konva.Group

  constructor(player: Player) {
    super(player)

    this.registerEvents()
  }

  dropItemRequest(i: number) {
    if (this._items.length > i) {
      this.player.game().events.emit("dropItem.request", this._items[i].item.id)
    }
  }

  dropItem(itemId: number, all: boolean) {
    socket.emit("dropRequest", [itemId, NB.to(all)])
  }

  craftItem(id: string, book: boolean) {
    const node = this.player.element(`#craft-${id}`)
    let duration = this.itemsAreCraftableRN.find(
      (item) => item.id === id
    ).craftDuration
    if (book) duration /= 2
    node.width(0)
    animateTo(node, {
      to: { points: [{ width: this.itemSize.width }] },
      duration,
      noBack: true,
      onFinish: () => {},
    })
  }

  craftItemRequest(id: string) {
    socket.emit("craftRequest", [id])
  }

  click(i: number) {
    const selected = this._items[i]
    if (!selected) return
    if (selected.item.data.settable) {
      this.startSetMode(selected.item.id)
    } else {
      socket.emit("clickItem", [selected.item.id])
    }
  }

  drawCrafts() {
    const opacityAll = (opacity: number) => {
      this.itemsAreCraftableRN.forEach((item, i) => {
        item.id !== this.isCrafting &&
          this.player
            .element(`#${this.player.id("craft", `${i}`)}`)
            ?.opacity(opacity)
      })
    }

    if (this.isCrafting) {
      opacityAll(0.5)
      return
    }

    if (this.itemsAreCraftableRN) {
      const node = this.layer.findOne(`#crafts`)
      opacityAll(1)
      if (this.craftsChanged) return
      if (node) node.destroy()
    }

    const craftsGroup = new Konva.Group({
      id: `crafts`,
      x: this.gap,
      y: this.gap,
    })

    let rows = 4
    let x = 0
    for (let i = 0; i < this.itemsAreCraftableRN.length; i++) {
      const item = this.itemsAreCraftableRN[i]
      let y = (i < rows ? i : i % rows) * (this.itemSize.height + this.gap)
      const itemGroup = new Konva.Group({
        id: `${this.player.id("craft", `${i}`)}`,
        name: "no-click",
        x,
        ...this.itemSize,
        y,
      })
      itemGroup.on("pointerenter", () => {
        document.body.style.cursor = "pointer"
      })
      itemGroup.on("pointerleave", () => {
        document.body.style.cursor = "default"
      })
      itemGroup.on("click", () => this.craftItemRequest(item.id))
      const containerRect = new Konva.Rect({
        id: `craft-${item.id}`,
        fill: "#397463",
        cornerRadius: 10,
        ...this.itemSize,
      })
      const icon = new Konva.Image({
        image: loadImage(item.iconUrl, (image) => {
          icon.image(image)
        }),
        id: `${this.player.id("craft", `${i}`, "icon")}`,
        ...this.itemIconSize,
        x: (this.itemSize.width - this.itemIconSize.width) / 2,
        y: (this.itemSize.height - this.itemIconSize.height) / 2,
      })
      itemGroup.add(containerRect, icon)
      craftsGroup.add(itemGroup)
      if ((i + 1) % rows === 0 && i + 1 >= rows)
        x += this.itemSize.width + this.gap
    }
    Game.createAlwaysTop(this.layer, craftsGroup)
    this.isDrew = true
  }

  updateGridSettingMode() {
    if (!this.settingMode.id || !this.settingMode.grid) return
    const node = this.settingMode.node
    node?.rotation(-this.player.angle || 0)
    const screen = this.player.camera.point.value
    const screenPos = combineClasses(
      new Point(screen),
      new Point(this.player.point.x - screen.x, this.player.point.y - screen.y)
    )
    const { item } = this._items.find(
      (item) => item.item.id == this.settingMode.id
    ) as PlayerItem<Settable>
    const pointAbsolutePos = combineClasses(
      new Point(screenPos),
      getPointByTheta(
        new Point(item.data.size.width / 2, item.data.size.height / 2),
        this.player.theta || 0,
        this.gridMaxRange
      )
    )
    const tile = this.player.game().map.tileSize
    const gridPos = new Point(
      pointAbsolutePos.x - (pointAbsolutePos.x % tile.width),
      pointAbsolutePos.y - (pointAbsolutePos.y % tile.height)
    )

    gridPos.x -= tile.width / 2
    gridPos.y -= tile.height / 2

    gridPos.x -= screen.x
    gridPos.y -= screen.y
    this.settingMode.node.absolutePosition(gridPos)
  }

  startSetMode(itemId: number) {
    const itemNode = this.settingMode.node
    itemNode.rotation(0)

    if (itemId === this.settingMode.id) {
      this.settingMode.id = null
      itemNode.visible(false)
      itemNode.setAttr("image", null)
      return
    }
    const item = this._items.find(
      (item) => item.item.id == itemId
    ) as PlayerItem<Settable>
    this.settingMode.id = itemId
    this.settingMode.grid = item.item.data.setMode.grid

    const offset = this.settingMode.grid
      ? new Point(item.item.data.size.width / 2, item.item.data.size.height / 2)
      : combineClasses(
          new Point(
            item.item.data.size.width / 2,
            item.item.data.size.height / 2
          ),
          new Point(item.item.data.setMode.offset)
        )

    const pos = this.settingMode.grid
      ? combineClasses(
          new Point(this.player.size.width / 2, this.player.size.height / 2),
          new Point(item.item.data.setMode.offset)
        )
      : new Point(this.player.size.width / 2, this.player.size.height / 2)

    itemNode
      .setAttr(
        "image",
        loadImage(item.item.url, (img) =>
          itemNode.setAttr("image", img).cache().green(150)
        )
      )
      .position(pos)
      .offset(offset)
      .size(item.item.data.size)
      .cache()
      .green(150)

    this.updateGridSettingMode()

    itemNode.visible(true)
  }

  setItemRequest() {
    if (!this.settingMode.id) return
    socket.emit("setItemRequest", [this.settingMode.id])
  }

  setItemResponse() {
    const itemNode = this.settingMode.node
    this.settingMode.id = null
    this.settingMode.grid = false
    itemNode.rotation(0).visible(false).setAttr("image", null)
  }

  drawItems() {
    const startPos = this.getInventoryStartPos()
    const group = new Konva.Group({
      id: `${this.player.id("inventory")}`,
      ...startPos,
    })
    for (let i = 0; i < this.space; i++) {
      const indexedItem = this._items[i]

      const x = i * this.itemSize.width + i * this.gap
      const itemGroup = new Konva.Group({
        name: "no-click",
        id: `${this.player.id("inventory", `${i}`)}`,
        x,
        ...this.itemSize,
        y: indexedItem ? -this.upIfSelected : 0,
        draggable: !!indexedItem,
        dragBoundFunc: function (pos) {
          return {
            x: pos.x,
            y: this.absolutePosition().y,
          }
        },
      })
      itemGroup.on("pointerenter", () => {
        document.body.style.cursor = "pointer"
      })
      itemGroup.on("pointerleave", () => {
        document.body.style.cursor = "default"
      })
      itemGroup.on("click", (e) => {
        if (e.evt.button === 0) this.click(i)
        else if (e.evt.button === 2) this.dropItemRequest(i)
      })
      const containerRect = new Konva.Rect({
        fill: "#397463",
        cornerRadius: 10,
        ...this.itemSize,
      })

      const icon = new Konva.Image({
        image: indexedItem?.item.iconUrl
          ? loadImage(indexedItem?.item.iconUrl, (image) => {
              icon.image(image)
            })
          : null,
        id: `${this.player.id("inventory", `${i}`, "icon")}`,
        ...this.itemIconSize,
        x: (this.itemSize.width - this.itemIconSize.width) / 2,
      })

      const indexOfItem = new KonvaText({
        text: `${i + 1}`,
        fontSize: 13,
        x: 5,
        y: 5,
        fill: "white",
      })

      const quantity = new KonvaText({
        id: `${this.player.id("inventory", `${i}`, "quantity")}`,
        width: this.itemSize.width - 5,
        align: "right",
        fontSize: 15,
        y: this.itemSize.height - 20,
        text: `x${indexedItem?.quantity}`,
        fill: "white",
        visible: !!indexedItem,
      })
      itemGroup.add(containerRect, indexOfItem, icon, quantity)
      indexOfItem.zIndex(2)
      quantity.zIndex(2)
      group.add(itemGroup)
    }

    group.on("dragend", (e) => {
      const endPoint = new Point(e.evt.clientX, e.evt.clientY)
      const pX = endPoint.x - startPos.x

      const itemIndexByPositionX = (x: number) => {
        if (
          x < 0 ||
          x > this.inventoryItemXByIndex(this.space - 1) + this.itemSize.width
        )
          return -1
        for (let i = 0; i < this.space; i++) {
          const startX = this.inventoryItemXByIndex(i)
          if (x >= startX && x <= startX + this.itemSize.width) return i
        }
        return -1
      }

      const targetIndex = itemIndexByPositionX(pX)
      const currentIndex = e.target.index
      if (
        targetIndex !== currentIndex &&
        targetIndex !== -1 &&
        targetIndex < this._items.length
      ) {
        const newItems = [...this._items]
        newItems[currentIndex] = this._items[targetIndex]
        newItems[targetIndex] = this._items[currentIndex]
        this._items = newItems
      }
      this.update()
    })

    Game.createAlwaysTop(this.layer, group)
    this.invGroup = group
    this.drawCrafts()
  }

  inventoryItemXByIndex(i: number) {
    return i * this.itemSize.width + i * this.gap
  }

  update() {
    this.drawCrafts()
    for (let i = 0; i < this.space; i++) {
      const node = this.player.element(
        `#${this.player.id("inventory", `${i}`)}`
      )
      node.x(this.inventoryItemXByIndex(i))
      const playerItem = this._items[i]
      if (!playerItem) {
        if (node.y() !== 0) node.y(0)
        node.draggable(false)
        this.player
          .element(`#${this.player.id("inventory", `${i}`, "quantity")}`)
          .visible(false)
        this.player
          .element(`#${this.player.id("inventory", `${i}`, "icon")}`)
          .setAttr("image", null)
        return
      }

      node.draggable(true)
      if (node.y() === 0) node.y(-5)
      const quantity = this.player.element(
        `#${this.player.id("inventory", `${i}`, "quantity")}`
      )

      quantity.setAttr(
        "text",
        `x${playerItem.quantity < 0 ? 0 : playerItem.quantity}`
      )
      quantity.visible(true)

      const itemIconNode = this.player.element(
        `#${this.player.id("inventory", `${i}`, "icon")}`
      )
      itemIconNode.setAttr(
        "image",
        loadImage(playerItem.item.iconUrl, (img) =>
          itemIconNode.setAttr("image", img)
        )
      )
    }
  }

  resize() {
    const startPos = this.getInventoryStartPos()
    this.invGroup.position(startPos)
  }

  private getInventoryStartPos() {
    const screen = this.layer.getStage()
    const maxWidthOfSpace = (this.itemSize.width + this.gap) * this.space
    return new Point(
      screen.width() / 2 - maxWidthOfSpace / 2,
      screen.height() - this.gap - this.itemSize.height
    )
  }

  private registerEvents() {
    socket.on("playerItems", ([items, crafts, space, bagUrl]) => {
      if (!this.bagUrl && bagUrl) {
        this.player.bagNode.image(
          loadImage(bagUrl, (img) => this.player.bagNode.image(img))
        )
      }

      const currentItems = items.map((itemData) => ({
        ...itemData,
        item: new Item(itemData.item),
      }))

      const currentItemsIds = items.map((item) => item.item.id)

      // removing items
      const filteredItems = this._items.filter((item) =>
        currentItemsIds.includes(item.item.id)
      )
      // getting new items
      const newItems = currentItems.filter(
        (currItem) =>
          !filteredItems.find((item) => item.item.id === currItem.item.id)
      )
      // updating currents
      filteredItems.forEach((item) => {
        const currItem = currentItems.find((cI) => cI.item.id === item.item.id)
        item.equiped = currItem.equiped
        item.quantity = currItem.quantity
      })

      this._items = [...filteredItems, ...newItems]
      this.itemsAreCraftableRN = crafts.items
      this.craftsChanged = crafts.changed
      if (this.space !== space) {
        this.invGroup?.destroy()
        this.isDrew = false
      }
      this.space = space
      if (this.isDrew) {
        this.update()
      } else {
        this.drawItems()
      }
      this.drawCrafts()
    })
    socket.on("playerEquipment", ([weapon]) => {
      this.equiped = weapon
      this.updateEquipment()
    })
    socket.on("playerWearing", ([wearing]) => {
      this.weared = wearing
      this.updateWearing()
    })
    socket.on("playerCraft", ([status, itemId, isBook]) => {
      if (status) {
        this.craftItem(itemId, isBook)
      }
    })
  }
}
