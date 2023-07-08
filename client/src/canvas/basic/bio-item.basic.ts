import { uuid } from "anytool"
import Konva from "konva"
import { Group } from "konva/lib/Group"
import { Layer } from "konva/lib/Layer"
import { Point, Size, combineClasses } from "../../global/init"
import { animateTo } from "../animations/to"
import { getAngle, getPointByTheta } from "../animations/rotation"
import { PlayerItems } from "../player/player-items"
import { ResourceGetting } from "./item.basic"
import { Shape } from "konva/lib/Shape"
import { doPolygonsIntersect, rectToPolygon } from "../utils/polygons"
import { ChangeEvented, onChange } from "../utils/OnChange"
import { loadImage } from "../structures/fetchImages"
import { BioDto } from "../../socket/events"
import { ShapeCache } from "../utils/Caching"
import { StaticItemsAddons } from "../data/staticItemAddons"
import { KonvaShapeCache } from "../structures/konva-shape-caching"

export type ResourceTypes = "wood" | "stone" | "berry"

class ShapeValidPosition {
  isRectPosition(): this is RectPosition {
    return this instanceof RectPosition
  }

  isPolygonPosition(): this is PolygonPosition {
    return this instanceof PolygonPosition
  }
}

export class RectPosition extends ShapeValidPosition {
  constructor(readonly from: Point, readonly size: Size) {
    super()
  }
}

export class PolygonPosition extends ShapeValidPosition {
  readonly points: Point[]
  constructor(...points: Point[]) {
    super()
    this.points = points
  }
}

type ValidPosition = RectPosition | PolygonPosition

export type BioItemProps = BioDto

// export interface BioItemProps {
//   type: ResourceTypes
//   resources: number
//   validPosition: ValidPosition
//   readonly id: string
//   size: Size
//   getWithEverything?: true
//   source: string
//   rechargeAmount: number
//   alsoDraw?: (props: Bio) => Shape | Shape[] | Group | Group[]
//   drawByResourceChange: (thisBio: Bio) => void
// }

export class BasicBioItem {
  constructor(readonly data: BioItemProps) {}

  generateBySize() {
    return new Bio({
      ...this.data,
    })
  }
}

export class Bio {
  private layer: Layer

  node: Konva.Group
  // private _interval
  alsoSavedNodes: Array<Shape | Group> = []
  attacked: { tween?: Konva.Tween; theta?: number } = {}
  // private bioGroup: ChangeEvented<Group>
  // resources: ChangeEvented<number>
  constructor(readonly data: BioItemProps) {
    // this.resources = onChange(data.resources)
    // this.bioGroup = onChange<Group>(null)
    // this.bioGroup.onChange((group) => {
    //   this.resources.onChange((value) => {
    //     data.drawByResourceChange(this)
    //   })
    // })
  }

  get point() {
    return this.data.point
  }

  get id() {
    return this.data.id
  }

  get url() {
    return this.data.url
  }

  get type() {
    return this.data.type
  }

  get centerPoint() {
    return new Point(
      this.point.x + this.data.size.width / 2,
      this.point.y + this.data.size.height / 2
    )
  }

  fixedPosition() {
    return this.point
  }

  take(layer: Layer) {
    this.layer = layer
    return this
  }

  getAttacked(theta: number) {
    const to = getPointByTheta(this.fixedPosition(), theta, 10)

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
  }

  draw(layer: Layer | Group) {
    if (!this.point) return

    const bioGroup = new Konva.Group({
      id: this.id,
      ...this.point,
      perfectDrawEnabled: false,
      listening: false,
    })

    const image = new Konva.Image({
      image: loadImage(this.url, (img) => {
        image.image(img)
      }),
      ...this.data.size,
      listening: false,
    })
    this.node = bioGroup
    bioGroup.add(image)
    bioGroup.listening(false)
    if (this.type in StaticItemsAddons) {
      const also = StaticItemsAddons[this.type]?.alsoDraw?.(this)
      if (also) {
        bioGroup.add(...(Array.isArray(also.items) ? also.items : [also.items]))
        also?.afterDraw?.()
      }
      StaticItemsAddons[this.type]?.drawByResourceChange?.(
        this,
        this.data.currentResources
      )
    }
    layer.add(bioGroup)
  }

  destroy() {
    this.node.destroy()
    this.attacked.tween?.destroy()
  }
}
