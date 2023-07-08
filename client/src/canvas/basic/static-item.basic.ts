import { Layer } from "konva/lib/Layer"
import { Point, combineClasses } from "../../global/init"
import { Item, ItemProps, Settable } from "./item.basic"
import Konva from "konva"
import { Group } from "konva/lib/Group"
import { loadImage } from "../structures/fetchImages"
import {
  Highlight,
  HighlightType,
  NumberBoolean,
  SetMode,
  SettableModeDto,
  StaticSettableDto,
} from "../../socket/events"
import { StaticItemsAddons } from "../data/staticItemAddons"
import { Shape } from "konva/lib/Shape"
import { Game } from "../game"
import { EventEmitter } from "../utils/EventEmitter"
import { getPointByTheta } from "../animations/rotation"

export class BasicStaticItem extends Item<Settable> {
  constructor(props: ItemProps<Settable>) {
    const { ...otherProps } = props
    super(otherProps)
  }
}

type StaticItemEvents = {
  destroy: [item: StaticSettableItem]
  mode: [item: StaticSettableItem]
}

export class StaticSettableItem
  extends EventEmitter<StaticItemEvents>
  implements StaticSettableDto
{
  constructor(data: StaticSettableDto) {
    super()
    Object.assign(this, data)
  }
  noAttackedAnimation: NumberBoolean
  currentMode: number
  modes: SettableModeDto[]
  iconUrl: string
  size: Size
  setMode: SetMode
  point: Point
  rotation: number = 0
  id: string
  type?: string
  highlight?: Highlight<HighlightType>
  layer: Layer
  layer2: Konva.Group
  destroyed: boolean = false
  showHp?: { radius: number; angle: number }
  showHpArc: Konva.Arc
  seedResource?: { resources: number; maxResources: number }

  alsoSavedNodes: Array<Shape | Group> = []

  attacked: { tween?: Konva.Tween; theta?: number } = {}

  get mode() {
    return this.modes[this.currentMode]
  }

  node: Group
  private highlightNode: Shape

  get centerPoint() {
    return new Point(this.point.x, this.point.y)
  }

  take(layer: Layer, layer2: Konva.Group) {
    this.layer = layer
    this.layer2 = layer2
    return this
  }

  fixedPosition() {
    return new Point(
      this.point.x - this.size.width / 2,
      this.point.y - this.size.height / 2
    )
  }

  getAttacked(theta: number, showHpAngle?: number) {
    if (this.noAttackedAnimation) return
    const to = getPointByTheta(this.centerPoint, theta, 10)

    if (
      !this.attacked.tween ||
      this.attacked.theta?.toFixed(2) !== theta.toFixed(2)
    ) {
      this.attacked.tween = new Konva.Tween({
        node: this.node,
        duration: 0.15,
        ...to,
        onFinish: () => this.attacked.tween.reverse(),
      })
    }

    this.attacked.theta = theta

    // this.attacked.tween.reset()
    this.attacked.tween.play()
    if (showHpAngle && "tryArcAngle" in this) this.tryArcAngle(showHpAngle)
  }

  tryMode(val: number) {
    const oldCover = this.mode.cover
    this.currentMode = val
    let coverChanged = this.mode.cover !== oldCover

    this.emit("mode", this)
    const node = <Konva.Image>this.node.findOne(`#${this.id}-image`)

    const size = this.mode.size || this.size

    node.size(size).offset(new Point(size.width / 2, size.height / 2))

    node.image(loadImage(this.mode.url, (img) => node.image(img)))

    if (coverChanged) {
      this.node.moveTo(
        this.layer.findOne(Game.settableHoistId(this.mode.cover))
      )
    }
  }

  draw() {
    const itemGroup = new Konva.Group({
      id: this.id,
      x: this.point.x,
      y: this.point.y,
      listening: false,
      offset: {
        x: this.size.width / 2,
        y: this.size.height / 2,
      },
    })

    const size = this.mode.size || this.size

    const image = new Konva.Image({
      id: `${this.id}-image`,
      image: loadImage(this.mode.url, (img) => image.setAttr("image", img)),
      ...size,
      offsetX: size.width / 2,
      offsetY: size.height / 2,
      listening: false,
      x: this.size.width / 2,
      y: this.size.height / 2,
      rotation: this.rotation,
    })

    itemGroup.add(image)

    this.node = itemGroup

    if (this.type in StaticItemsAddons) {
      const also = StaticItemsAddons[this.type].alsoDraw?.(this)
      if (also) {
        itemGroup.add(
          ...(Array.isArray(also.items) ? also.items : [also.items])
        )
        also?.afterDraw?.()
      }

      StaticItemsAddons[this.type].drawSeparately?.(this)
      if (this.seedResource?.resources)
        StaticItemsAddons[this.type]?.drawByResourceChange?.(
          this,
          this.seedResource.resources
        )
    }

    if (this.showHp) {
      this.showHpArc = new Konva.Arc({
        x: this.size.width / 2,
        listening: false,
        y: this.size.height / 2,
        outerRadius: this.showHp.radius,
        innerRadius: this.showHp.radius - 5,
        angle: this.showHp.angle,
        fill: "#fd5d00",
        stroke: "#252525",
        strokeWidth: 0.5,
        visible: this.showHp.angle !== 360,
      })
      itemGroup.add(this.showHpArc)
    }

    ;(this.layer.findOne(Game.settableHoistId(this.mode.cover)) as any).add(
      itemGroup
    )

    this.emit("mode", this)

    if (this.highlight) {
      let highlightNode: Konva.Circle | Konva.Rect
      if (this.highlight.type === "circle") {
        highlightNode = new Konva.Circle({
          ...this.point,
          ...this.highlight.data,
          listening: false,
          id: `${this.id}-highlight`,
          globalCompositeOperation: "destination-out",
          fill: "rgba(255,255,255)",
          stroke: "white",
        })
      } else {
        highlightNode = new Konva.Rect({
          id: `${this.id}-highlight`,

          ...this.size,
          offsetX: this.size.width / 2,
          offsetY: this.size.height / 2,
          x: this.point.x + this.size.width / 2,
          y: this.point.y + this.size.height / 2,
          rotation: this.rotation,
          globalCompositeOperation: "destination-out",
          fill: "rgba(255,255,255)",
          stroke: "white",
        })
      }
      // this.highlightNode = highlightNode
      // Game.createHighlight(this.layer2, highlightNode)
    }
  }

  tryArcAngle(angle: number) {
    this.showHpArc?.angle(angle).visible(angle !== 360)
  }

  destroy() {
    this.emit("destroy", this)
    this.destroyed = true
    this.node.destroy()
    this.highlightNode?.destroy()
    this.attacked.tween?.destroy()
  }
}
