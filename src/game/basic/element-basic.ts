import { uuid } from 'anytool'
import { Point, Size } from 'src/global/global'
import { GetSet } from 'src/structures/GetSet'
import { EventEmitter, EventObject } from 'src/utils/EventEmitter'
import { uniqueId } from 'src/utils/uniqueId'

interface BasicElementProps {
  point: Point
  size?: Size
  angle?: number
  theta?: number
}

export type ElementProps<T extends object = {}> = T & BasicElementProps

export abstract class BasicElement<T extends EventObject = {}> {
  private _id: string
  readonly point: GetSet<Point>
  readonly size: GetSet<Size>
  readonly angle?: GetSet<number>
  readonly theta?: GetSet<number>
  readonly events = new EventEmitter<T>()

  constructor(props: ElementProps) {
    this.point = GetSet(props.point)
    this.size = GetSet(props.size)
    this.angle = GetSet(props.angle || 0)
    this.theta = GetSet(props.theta || 0)
    this._id = uniqueId()
  }
  id(): string
  id(...selectors: string[]): string
  id(...selectors: string[]): string {
    return [this._id, ...selectors].join('-')
  }

  calculatePointForCentering(container: Size): Point {
    return new Point(
      container.width / 2 - this.size().width / 2,
      container.height / 2 - this.size().height / 2,
    )
  }
}
