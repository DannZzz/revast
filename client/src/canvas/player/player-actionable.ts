import Konva from "konva"
import { PlayerItems } from "./player-items"
import { _window } from "../utils/window"
import { Game } from "../game"
import { socket } from "../../socket/socket"
import { loadImage } from "../structures/fetchImages"
import { KonvaText } from "../structures/KonvaText"
import { ActionableHolderDto } from "../../socket/events"
import { Point, Size, combineClasses } from "../../global/init"

export class PlayerActionable {
  actionableGroup: Konva.Group
  actionabledHoldersGroup: Konva.Group
  actionableIconNode: Konva.Image
  rightMargin = 50
  readonly itemIconSize = new Size(50, 50)
  constructor(private layer2: Konva.Layer, private items: PlayerItems) {
    this.draw()
    this.items.space.onChange(() => this.drawButtons())
    this.registerSocket()
  }
  addButtonsGroup: Konva.Group
  allow: number[] = null
  holderIds: number[] = []

  currentlyShowing: string
  readonly addButtonSize = new Size(20, 20)

  draw() {
    this.actionableGroup = new Konva.Group()

    this.addButtonsGroup = new Konva.Group()
    this.resize()

    this.actionableIconNode = new Konva.Image({
      image: null,
    })
    this.actionabledHoldersGroup = new Konva.Group()
    this.actionableGroup.add(
      this.actionableIconNode,
      this.actionabledHoldersGroup
    )

    this.drawButtons()

    Game.createAlwaysTop(
      this.layer2,
      this.actionableGroup,
      this.addButtonsGroup
    )
  }

  resize() {
    const wSize = _window.size()
    this.actionableGroup.position({
      x: wSize.width - this.rightMargin,
      y: wSize.height / 2,
    })
    this.addButtonsGroup.position(this.calcButtonsPosition())
  }

  calcButtonsPosition() {
    const p = this.items.getInventoryStartPos()
    return new Point(p.x, p.y)
  }

  showAddButtonsFor() {
    if (!this.addButtonsGroup) return
    const allow = this.allow
    const inventoryPos = this.calcButtonsPosition()

    if (!Array.isArray(this.allow)) return this.addButtonsGroup.hide()
    this.addButtonsGroup.position(inventoryPos)
    if (allow.length === 0) {
      this.addButtonsGroup.children.forEach((node, i) => {
        const item = this.items._items[i]
        return node.visible(
          !!item &&
            (this.holderIds.includes(0) ||
              this.holderIds.includes(item.item.id))
        )
      })
    } else {
      this.addButtonsGroup.children.forEach((node, i) =>
        node.visible(allow.includes(this.items._items[i]?.item.id))
      )
    }
    this.addButtonsGroup.show()
  }

  drawButtons() {
    this.addButtonsGroup.destroyChildren()
    const itemSize = this.items.itemSize
    const buttonSize = this.addButtonSize
    for (let i = 0; i < this.items.space(); i++) {
      this.addButtonsGroup.add(createButton.call(this, i))
    }
    function createButton(this: PlayerActionable, i: number) {
      const x =
        itemSize.width / 2 -
        buttonSize.width / 2 +
        i * (itemSize.width + buttonSize.width / 2)
      const y = 10 - buttonSize.height * 2
      const node: Konva.Image = new Konva.Image({
        name: "no-click",
        image: loadImage("/images/add-game-btn.png", (img) =>
          node.image(img).cache()
        ),
        ...buttonSize,
        x,
        y,
      })
      node.on("pointerenter", () => {
        document.body.style.cursor = "pointer"
      })
      node.on("pointerleave", () => {
        document.body.style.cursor = "default"
      })
      node.on("click", (e) => {
        if (e.evt.button === 0) {
          if (this.items._items[i])
            socket.emit("requestActionableHolder", [
              this.currentlyShowing,
              this.items._items[i].item.id,
              e.evt.shiftKey,
            ])
        }
      })
      node.cache()
      return node
    }
    this.showAddButtonsFor()
  }

  registerSocket() {
    socket.on(
      "actionableHolder",
      ([settableId, settableType, drawOptions, allow, holders]) => {
        this.allow = allow
        this.actionableIconNode
          ?.image(
            loadImage(drawOptions.backgroundUrl, (img) =>
              this.actionableIconNode.image(img)
            )
          )
          .size(drawOptions.size)
          .offset({
            x: drawOptions.size.width / 2,
            y: drawOptions.size.height / 2,
          })
        this.actionableGroup.offset(
          combineClasses(
            drawOptions.offset
              ? new Point(drawOptions.offset)
              : new Point(0, 0),
            new Point(this.rightMargin, 0)
          )
        )

        this.actionabledHoldersGroup.destroyChildren()

        this.currentlyShowing = settableId
        this.holderIds = []
        holders.forEach((holder, i) => {
          this.holderIds.push(holder.itemId)
          if (holder.quantity > 0) {
            const { group } = this.createHolder(holder, i)

            this.actionabledHoldersGroup.add(group)
          }
        })
        this.showAddButtonsFor()
      }
    )
    socket.on("removeActionable", ([settableId]) => {
      if (this.currentlyShowing === settableId) {
        this.allow = null
        this.currentlyShowing = null
        this.actionabledHoldersGroup.destroyChildren()
        this.actionableIconNode?.image(null)
        this.showAddButtonsFor()
      }
    })
  }

  createHolder(holder: ActionableHolderDto, i: number) {
    const hGroup = new Konva.Group({
      listening: holder.takeable,
      offset: holder.drawOffset,
    })

    hGroup.on("click", (e) => {
      if (e.evt.button === 0) {
        socket.emit("requestActionableHolderTake", [this.currentlyShowing, i])
      }
    })

    const size = this.itemIconSize
    const icon = new Konva.Image({
      image: loadImage(holder.iconUrl, (img) => icon.image(img)),
      ...size,
      offset: {
        x: size.width / 2,
        y: size.height / 2,
      },
    })

    const quantity = new KonvaText({
      offset: {
        x: size.width / 2,
        y: size.height / 2,
      },
      text: `x${holder.quantity}`,
      width: size.width,
      align: "center",
      fontSize: 18,
      stroke: "black",
      strokeWidth: 0.5,
      fill: "white",
      y: size.height - 5,
    })

    hGroup.add(icon, quantity)
    return { icon, quantity, group: hGroup }
  }
}
