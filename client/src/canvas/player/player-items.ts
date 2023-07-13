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
import { getDistance, getPointByTheta } from "../animations/rotation"
import { GRID_SET_RANGE } from "../../constants"
import { GetSet } from "../structures/GetSet"
import {
  makeItemIconBg,
  makeItemIconBgEmpty,
  makeItemIconBgNotEmpty,
} from "../utils/make-item-icon"

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
  _items: PlayerItem<ItemsByTypes>[] = []
  space = GetSet(10)
  private itemsAreCraftableRN: CraftDto[]
  private craftsChanged: boolean
  isCrafting: null | string
  private isDrew: boolean = false
  declare player: Player
  private readonly gridMaxRange = GRID_SET_RANGE
  private descriptionNode: Konva.Group
  private setModeGrid: boolean = false
  private setModeText: Konva.Text

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
    node.getParent().clearCache()
    let duration = this.itemsAreCraftableRN.find(
      (item) => item.id === id
    ).craftDuration
    if (book) duration /= 2

    this.isCrafting = id

    node.width(0)
    animateTo(node, {
      to: { points: [{ width: this.itemSize.width }] },
      duration,
      noBack: true,
      onFinish: () => {
        this.isCrafting = null
      },
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
      opacityAll(1)
      if (this.craftsChanged) return
      const node = this.layer.findOne(`#crafts`)
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
        this.showDescription(item.itemId, itemGroup.absolutePosition(), true)
      })
      itemGroup.on("pointerleave", () => {
        document.body.style.cursor = "default"
        this.descriptionNode?.destroy()
        this.descriptionNode = null
      })
      itemGroup.on("click", () => this.craftItemRequest(item.id))
      const containerRect = makeItemIconBg({
        size: this.itemSize,
        id: `craft-${item.id}`,
      })
      const icon = new Konva.Image({
        image: loadImage(item.iconUrl, (image) => {
          icon.image(image)
          itemGroup.cache()
        }),
        id: `${this.player.id("craft", `${i}`, "icon")}`,
        ...this.itemIconSize,
        x: (this.itemSize.width - this.itemIconSize.width) / 2,
        y: (this.itemSize.height - this.itemIconSize.height) / 2,
      })
      itemGroup.add(containerRect, icon)
      itemGroup.cache()
      craftsGroup.add(itemGroup)
      if ((i + 1) % rows === 0 && i + 1 >= rows)
        x += this.itemSize.width + this.gap
    }
    Game.createAlwaysTop(this.layer, craftsGroup)
    this.isDrew = true
  }

  updateGridSettingMode() {
    if (!this.settingMode.id || (!this.settingMode.grid && !this.setModeGrid))
      return
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
    const tile = this.player.game().map.tileSize

    const cursor = combineClasses(this.player.cursor, screen)

    const cursorTile = combineClasses(
      cursor,
      new Point(tile.width / 2, tile.height / 2)
    )

    const pointAbsolutePos = combineClasses(
      new Point(screenPos),
      getPointByTheta(
        new Point(item.data.size.width / 2, item.data.size.height / 2),
        this.player.theta || 0,
        getDistance(cursor, screenPos) <= this.gridMaxRange
          ? getDistance(cursorTile, screenPos)
          : this.gridMaxRange
      )
    )
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

  startSetMode(itemId: number, newMode: boolean = false) {
    const itemNode = this.settingMode.node
    itemNode.rotation(0)

    if (!newMode && itemId === this.settingMode.id) {
      this.settingMode.id = null
      itemNode.visible(false)
      this.showSetModeText()
      itemNode.setAttr("image", null)
      return
    }
    const item = this._items.find(
      (item) => item.item.id == itemId
    ) as PlayerItem<Settable>
    this.settingMode.id = itemId
    this.settingMode.grid = this.setModeGrid || item.item.data.setMode.grid

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
          itemNode.setAttr("image", img).cache()
        )
      )
      .position(pos)
      .offset(offset)
      .size(item.item.data.size)
      .cache()

    this.updateGridSettingMode()
    this.showSetModeText()
    itemNode.visible(true)
  }

  setItemRequest() {
    if (!this.settingMode.id) return
    socket.emit("setItemRequest", [
      this.settingMode.id,
      this.player.cursor.x,
      this.player.cursor.y,
      this.setModeGrid,
    ])
  }

  setItemResponse() {
    const itemNode = this.settingMode.node
    this.settingMode.id = null
    this.settingMode.grid = false
    this.showSetModeText()
    itemNode.rotation(0).visible(false).setAttr("image", null).cache()
  }

  drawItems() {
    const startPos = this.getInventoryStartPos()
    const group = new Konva.Group({
      id: `${this.player.id("inventory")}`,
      ...startPos,
    })
    for (let i = 0; i < this.space(); i++) {
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
      itemGroup.on("mouseenter", () => {
        document.body.style.cursor = "pointer"
        this.showDescription(
          this._items[i]?.item?.id,
          itemGroup.absolutePosition()
        )
      })
      itemGroup.on("mouseleave", () => {
        document.body.style.cursor = "default"
        this.descriptionNode?.destroy()
        this.descriptionNode = null
      })
      itemGroup.on("pointerclick", (e) => {
        if (e.evt.button === 0) this.click(i)
        else if (e.evt.button === 2) this.dropItemRequest(i)
      })
      const containerRect = makeItemIconBg({
        size: this.itemSize,
        empty: !indexedItem,
        id: `${this.player.id("inventory", `${i}`, "container")}`,
      })

      const icon = new Konva.Image({
        image: indexedItem?.item.iconUrl
          ? loadImage(indexedItem?.item.iconUrl, (image) => {
              icon.image(image)
              itemGroup.cache()
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
        fontSize: 13,
        y: this.itemSize.height - 18,
        wrap: "none",
        text: `x${indexedItem?.quantity}`,
        fill: "white",
        visible: !!indexedItem,
      })
      itemGroup.add(containerRect, icon, indexOfItem, quantity)
      itemGroup.cache()
      group.add(itemGroup)
    }

    group.on("dragend", (e) => {
      const endPoint = new Point(e.evt.clientX, e.evt.clientY)
      const startPos = this.getInventoryStartPos()
      const pX = endPoint.x - startPos.x

      const itemIndexByPositionX = (x: number) => {
        if (
          x < 0 ||
          x > this.inventoryItemXByIndex(this.space() - 1) + this.itemSize.width
        )
          return -1
        for (let i = 0; i < this.space(); i++) {
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

  showDescription(id: number, pos: Point, crafts: boolean = false) {
    const item = this.player.game().items.find((it) => it.id === id)
    if (!item) return
    this.descriptionNode?.destroy()

    const textName = new KonvaText({
      text: item.name,
      fontSize: 20,
      stroke: "black",
      strokeWidth: 0.5,
      fill: "white",
      x: 15,
      y: 15,
    })

    let width = 450

    const description = new KonvaText({
      text: item.description || "",
      fontSize: 15,
      fill: "#ccc",
      wrap: "word",
      x: 15,
      y: 30 + textName.height(),
    })

    const longer = Math.max(textName.width(), description.width())

    if (longer > width - 30) {
      description.width(width - 30)
    } else {
      width = longer + 30
    }

    const bg = new Konva.Rect({
      cornerRadius: 10,
      width,
      fill: "#593b2a",
      opacity: 0.9,
      height:
        15 * (description.text() === "" ? 2 : 3) +
        textName.height() +
        (description.text() === "" ? 0 : description.height()),
    })

    const group = new Konva.Group({})

    if (crafts) {
      group.position(
        combineClasses(
          pos,
          new Point(this.itemSize.width + 15, this.itemSize.height / 2)
        )
      )
    } else {
      group.position(
        combineClasses(
          pos,
          new Point(
            -(bg.width() / 2 - this.itemIconSize.width / 2),
            -(this.itemSize.height / 2 + bg.height() + 15)
          )
        )
      )
    }
    group.add(bg, textName, description).cache()
    this.descriptionNode = group
    Game.createAlwaysTop(this.layer, group)
  }

  update() {
    this.drawCrafts()
    for (let i = 0; i < this.space(); i++) {
      const node = this.player.element(
        `#${this.player.id("inventory", `${i}`)}`
      )
      node.x(this.inventoryItemXByIndex(i))
      const playerItem = this._items[i]
      if (!playerItem) {
        if (node.y() !== 0) node.y(0)
        node.draggable(false)
        makeItemIconBgEmpty(
          this.player.element(
            `#${this.player.id("inventory", `${i}`, "container")}`
          )
        )

        this.player
          .element(`#${this.player.id("inventory", `${i}`, "quantity")}`)
          .visible(false)
        this.player
          .element(`#${this.player.id("inventory", `${i}`, "icon")}`)
          .setAttr("image", null)

        node.cache()
        return
      }

      node.draggable(true)
      if (node.y() === 0) node.y(-5)
      const quantity = this.player.element(
        `#${this.player.id("inventory", `${i}`, "quantity")}`
      )

      makeItemIconBgNotEmpty(
        this.player.element(
          `#${this.player.id("inventory", `${i}`, "container")}`
        )
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
        loadImage(playerItem.item.iconUrl, (img) => {
          itemIconNode.setAttr("image", img)
          node.cache()
        })
      )

      node.cache()
    }
  }

  resize() {
    const startPos = this.getInventoryStartPos()
    this.invGroup.position(startPos)
    this.setModeText?.position(
      new Point(
        5,
        this.layer.getStage().height() - this.setModeText?.height() - 5
      )
    )
  }

  getInventoryStartPos() {
    const screen = this.layer.getStage()
    const maxWidthOfSpace = (this.itemSize.width + this.gap) * this.space()
    return new Point(
      screen.width() / 2 - maxWidthOfSpace / 2,
      screen.height() - this.gap - this.itemSize.height
    )
  }

  showSetModeText() {
    if (!this.settingMode.id) {
      this.setModeText?.destroy()
      this.setModeText = null
    } else {
      let text = `Building method: ${
        this.setModeGrid ? "Grid" : "Free"
      }. Press G to change`

      if (this.setModeText) {
        this.setModeText.text(text)
      } else {
        this.setModeText = new KonvaText({
          fill: "#e2c340",
          fontSize: 15,
          text,
          fontStyle: "bold",
        })

        this.setModeText?.position(
          new Point(
            5,
            this.layer.getStage().height() - this.setModeText?.height() - 5
          )
        )
        Game.createAlwaysTop(this.layer, this.setModeText)
      }
    }
  }

  private registerEvents() {
    this.player.game().events.on("setmode.toggle", () => {
      if (!this.settingMode.id) return
      this.setModeGrid = !this.setModeGrid
      this.showSetModeText()
      this.startSetMode(this.settingMode.id, true)
    })
    socket.on("playerItems", ([items, crafts, space, bagUrl]) => {
      if (!this.bagUrl && bagUrl) {
        this.player.bagNode
          .image(
            loadImage(bagUrl, (img) => this.player.bagNode.image(img).cache())
          )
          .cache()
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

      this.player.actionable?.showAddButtonsFor()

      this._items = [...filteredItems, ...newItems]
      this.itemsAreCraftableRN = crafts.items
      this.craftsChanged = crafts.changed
      if (this.space() !== space) {
        this.invGroup?.destroy()
        this.isDrew = false
      }
      this.space(space)
      if (this.isDrew) {
        this.update()
      } else {
        this.drawItems()
      }
      this.drawCrafts()
    })
    socket.on("playerEquipment", ([weapon, timeout]) => {
      this.equiped = weapon
      this.updateEquipment()
      if (NB.from(timeout)) {
        this.player.timeout.try("weapon")
      }
    })
    socket.on("playerWearing", ([wearing, timeout]) => {
      this.weared = wearing
      this.updateWearing()
      if (NB.from(timeout)) {
        this.player.timeout.try("helmet")
      }
    })
    socket.on("playerCraft", ([status, itemId, isBook]) => {
      if (status) {
        this.craftItem(itemId, isBook)
      } else {
        this.isCrafting = null
      }
    })
  }
}
