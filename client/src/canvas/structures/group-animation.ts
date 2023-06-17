import { Chest, uuid } from "anytool"
import Konva from "konva"
import { StaticItemType } from "./StaticItems"
import { animateTo } from "../animations/to"
import { Point } from "../../global/init"

export class GroupAnimation {
  takeAttack(items: StaticItemType[], thetas: number[], layer: Konva.Layer) {
    const groups: Record<string, StaticItemType[]> = {}
    const id = (p: Point) => `${p.x}-${p.y}`
    const alone = [] as StaticItemType[]
    items.forEach((item, i, self) => {
      const anotherIndex = self.findLastIndex(
        (it) => it.point.x === item.point.x && it.point.y === item.point.y
      )
      if (
        (anotherIndex !== i && anotherIndex !== -1) ||
        id(item.point) in groups
      ) {
        if (!(id(item.point) in groups)) groups[id(item.point)] = []
        groups[id(item.point)].push(item)
      } else {
        alone.push(item)
      }
    })
    for (let k in groups) {
      const arr = groups[k]
      const group = new Konva.Group()
      group.add(...arr.map((n) => n.node.clone({ id: `${uuid(5)}` })))
      arr.forEach((it) => it.node.hide())
      layer.add(group)
      animateTo(group, {
        duration: 0.2,
        to: { points: [new Point(10, 0)] },
        onFinish: () => {
          group.destroy()
          arr.forEach((it) => it.node.show())
        },
      })
    }
    alone.forEach((al) => al.getAttacked(3))
  }
}
