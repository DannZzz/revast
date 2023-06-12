import Konva from "konva"
import { WalkEffect } from "../socket/events"
import { animateTo } from "./animations/to"

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

export class GameAttr {
  static walkEffect(
    layer: Konva.Layer,
    effect: WalkEffect,
    point: Point,
    angle: number
  ) {
    const g = this.group(layer)
    if (effect === WalkEffect.water) {
      const node = WaterWalkEffectGroup.clone({ ...point, rotation: angle })
      g.add(node)
      animateTo(node, {
        duration: 2.5,
        noBack: true,
        onFinish: () => node.destroy(),
        to: { points: [{ opacity: 0, scale: 2 }] },
      })
    }
  }

  static group(layer: Konva.Layer): Konva.Group {
    return layer.findOne("#game-attr")
  }
}
