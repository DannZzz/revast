import Konva from "konva"
import { WalkEffect } from "../socket/events"
import { animateTo } from "./animations/to"
import { getPointByTheta } from "./animations/rotation"

const WaterWalkEffectGroup = new Konva.Group({ opacity: 0.5 })
  .add(
    new Konva.Circle({
      radius: 40,
      fill: "cyan",
    }),
    new Konva.Circle({
      radius: 15,
      fill: "cyan",
      offsetX: 60,
    }),
    new Konva.Circle({
      radius: 15,
      fill: "cyan",
      offsetX: -60,
    })
  )
  .cache()

const FootPrint = new Konva.Rect({
  opacity: 0.4,
  fill: "black",
  width: 34,
  height: 20,
  offset: {
    x: 17,
    y: 10,
  },
  cornerRadius: 5,
}) // 50 30

export class GameAttr {
  static walkEffect(
    layer: Konva.Layer,
    effect: WalkEffect,
    point: Point,
    angle: number,
    footPrint?: any
  ) {
    const g = this.group(layer)
    switch (effect) {
      case WalkEffect.water:
        {
          const node = WaterWalkEffectGroup.clone({ ...point, rotation: angle })
          g.add(node)
          animateTo(node, {
            duration: 2.5,
            noBack: true,
            onFinish: () => node.destroy(),
            to: { points: [{ opacity: 0, scale: 2 }] },
          })
        }
        break

      case WalkEffect.footprints:
        {
          let pnt = getPointByTheta(
            point,
            ((footPrint ? angle : angle - 180) / 180) * Math.PI,
            25
          )
          const node = FootPrint.clone({ ...pnt, rotation: angle - 90 })
          g.add(node)
          animateTo(node, {
            duration: 4,
            noBack: true,
            onFinish: () => node.destroy(),
            to: { points: [{ opacity: 0 }] },
          })
        }
        break

      default:
        break
    }
  }

  static group(layer: Konva.Layer): Konva.Group {
    return layer.findOne("#game-attr")
  }
}
