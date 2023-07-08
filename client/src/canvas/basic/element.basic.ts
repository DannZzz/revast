import { uuid } from "anytool"
import { Layer } from "konva/lib/Layer"
import { NodeConfig, Node } from "konva/lib/Node"
import { Point, Size, combineClasses } from "../../global/init"
import { EventEmitter, EventObject } from "../utils/EventEmitter"
import Konva from "konva"

interface BasicElementProps {
  layer: Layer
  layer2: Konva.Group
  point: Point
  size?: Size
  angle?: number
  theta?: number
}

export type ElementProps<T extends object = {}> = T & BasicElementProps

export abstract class BasicElement<T extends EventObject = {}> {
  protected _id: string
  layer: Layer
  layer2: Konva.Group
  private _point: Point
  private _size: Size = new Size(120, 116)
  angle?: number
  theta?: number
  _cursor?: Point
  readonly events = new EventEmitter<T>()

  constructor(props: ElementProps) {
    this.layer = props.layer
    this.layer2 = props.layer2
    this._point = props.point
    if (props.size) this._size = props.size
    this.angle = props.angle
    this.registerEvents()
  }

  get cursor() {
    return this._cursor || new Point(0, 0)
  }

  set cursor(val) {
    this._cursor = new Point(val)
  }

  get stage() {
    return this.layer.getStage()
  }

  id(): string
  id(...selectors: string[]): string
  id(...selectors: string[]): string {
    return [this._id, ...selectors].join("-")
  }

  element(): Node<NodeConfig>
  element(selector: string): Node<NodeConfig>
  element(selector?: string) {
    return this.stage.findOne(selector ? selector : `#${this.id()}`)
  }

  get point() {
    return new Point(this._point?.x, this._point?.y)
  }

  get size() {
    return new Size(this._size?.width, this._size?.height)
  }

  set point(point: Point) {
    this._point = point
    // this.element()?.position(
    //   combineClasses(
    //     point,
    //     new Point(-(this.size.width / 2), -(this.size.height / 2))
    //   )
    // )
  }

  set size(size: Size) {
    this._size = size
    this.element()?.size(size)
  }

  calculatePointForCentering(container: Size): Point {
    return new Point(
      container.width / 2 - this.size.width / 2,
      container.height / 2 - this.size.height / 2
    )
  }

  abstract draw(): void
  abstract registerEvents(): void
  // abstract update(): void
}
