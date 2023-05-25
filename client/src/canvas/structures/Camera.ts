import { Node } from "konva/lib/Node"
import { ChangeEvented, onChange } from "../utils/OnChange"
import { Group } from "konva/lib/Group"
import { GetSet } from "./GetSet"

export class Camera {
  point: ChangeEvented<Point>
  size: GetSet<Size>
  map: GetSet<Size>
  private cb: () => void
  constructor(startPoint: Point, private by: Array<Node | Group>) {
    this.point = onChange(startPoint)
  }

  update() {
    this.by.forEach(by => by.offset(this.point.value))
  }

}
