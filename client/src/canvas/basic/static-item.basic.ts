import { Layer } from "konva/lib/Layer"
import { Point } from "../../global/init"
import { Item, ItemProps, Settable } from "./item.basic"
import Konva from "konva"
import { Group } from "konva/lib/Group"
import { loadImage } from "../structures/fetchImages"
import {
  Highlight,
  HighlightType,
  SetMode,
  StaticSettableDto,
} from "../../socket/events"
import { StaticItemsAddons } from "../data/staticItemAddons"
import { Shape } from "konva/lib/Shape"
import { Game } from "../game"
import { zIndexOf } from "../../constants"

export class BasicStaticItem extends Item<Settable> {
  constructor(props: ItemProps<Settable>) {
    const { ...otherProps } = props
    super(otherProps)
  }
}

export class StaticSettableItem implements StaticSettableDto {
  constructor(data: StaticSettableDto) {
    Object.assign(this, data)
  }
  mode: { enabled: boolean; cover: boolean }
  modeUrl: string
  cover: boolean
  url: string
  iconUrl: string
  size: Size
  setMode: SetMode
  point: Point
  rotation: number = 0
  id: string
  type?: string
  highlight?: Highlight<HighlightType>
  layer: Layer
  layer2: Layer
  destroyed: boolean = false
  showHp?: { radius: number; angle: number }
  showHpArc: Konva.Arc

  private node: Group
  private highlightNode: Shape

  get centerPoint() {
    return new Point(this.point.x, this.point.y)
  }

  take(layer: Layer, layer2: Layer) {
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

  tryMode(val: { enabled: boolean; cover: boolean }) {
    if (!this.modeUrl || this.modeUrl.endsWith("undefined")) return
    this.mode = val
    const node = <Konva.Image>this.node.findOne(`#${this.id}-image`)
    node.image(
      loadImage(this.mode.enabled ? this.modeUrl : this.url, (img) =>
        node.image(img)
      )
    )
    this.node.moveTo(
      this.mode.cover
        ? this.layer.findOne("#game-settable")
        : this.layer.findOne("#game-settable-1")
    )
  }

  draw() {
    const gr: any = this.layer.findOne("#game-settable")

    const itemGroup = new Konva.Group({
      id: this.id,
      x: this.point.x - this.size.width / 2,
      y: this.point.y - this.size.height / 2,
    })
    const image = new Konva.Image({
      id: `${this.id}-image`,
      image: loadImage(this.url, (img) => image.setAttr("image", img)),
      ...this.size,
      offsetX: this.size.width / 2,
      offsetY: this.size.height / 2,
      x: this.size.width / 2,
      y: this.size.height / 2,
      rotation: this.rotation,
    })
    itemGroup.add(image)
    if (this.type in StaticItemsAddons) {
      const also = StaticItemsAddons[this.type]?.alsoDraw(this)
      if (also) {
        itemGroup.add(
          ...(Array.isArray(also.items) ? also.items : [also.items])
        )
        also?.afterDraw?.()
      }
    }

    if (this.showHp) {
      this.showHpArc = new Konva.Arc({
        x: this.size.width / 2,
        y: this.size.height / 2,
        outerRadius: this.showHp.radius,
        innerRadius: this.showHp.radius - 5,
        angle: this.showHp.angle,
        fill: "#fd5d00",
        stroke: "#252525",
        strokeWidth: 1,
        visible: this.showHp.angle !== 360,
      })
      itemGroup.add(this.showHpArc)
    }

    if (this.cover) {
      gr.add(itemGroup)
    } else {
      ;(this.layer.findOne("#game-settable-2") as any).add(itemGroup)
    }

    this.node = itemGroup
    this.tryMode(this.mode)

    if (this.highlight) {
      let highlightNode: Konva.Circle | Konva.Rect
      if (this.highlight.type === "circle") {
        highlightNode = new Konva.Circle({
          ...this.point,
          ...this.highlight.data,
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
      Game.createHighlight(this.layer2, highlightNode)
      this.highlightNode = highlightNode
    }
  }

  tryArcAngle(angle: number) {
    this.showHpArc?.angle(angle).visible(angle !== 360)
  }

  destroy() {
    this.destroyed = true
    this.node.destroy()
    this.highlightNode?.destroy()
  }
}
