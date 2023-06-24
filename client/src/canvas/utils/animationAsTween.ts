import Konva from "konva"

type EaseFunction = (t: number, b: any, c: any, d: any) => number

interface AnimateNode {
  node: Konva.Node
  properties?: Partial<Konva.TweenConfig>
  ease?: EaseFunction
}

export default function animationAsTween(
  nodes: AnimateNode[],
  duration: number
): Promise<void> {
  return new Promise((resolve) => {
    const anim = new Konva.Animation((frame) => {
      nodes.forEach(
        ({
          node,
          ease = <EaseFunction>Konva.Easings.Linear,
          properties = {},
        }) => {
          const animatedProps: Konva.TweenConfig = <any>{}
          Object.keys(properties).forEach((key) => {
            const startValue = node[key]()
            const value = properties[key]
            const endValue = value
            // console.log(frame.time, startValue, endValue - startValue, duration)
            const progress = ease(
              frame.time,
              startValue,
              endValue - startValue,
              duration
            )
            animatedProps[key] = progress
          })
          node.setAttrs(animatedProps)
        }
      )
      if (frame.time > duration) {
        anim.stop()
        // nodes.forEach(({ node, properties }) => node.setAttrs(properties))
        resolve()
      }
    })
    anim.start()
  })
}
