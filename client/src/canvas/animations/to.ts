import { Filter, Node } from "konva/lib/Node"
import { Point, combineClasses } from "../../global/init"

type ToOption = Point & {
  rotation?: { amount: number; absolute?: true }
  offset?: Point
  angle?: number
  fill?: string
  visible?: boolean
  scale?: number
  opacity?: number
} & Size
interface AnimateOptions {
  to?: { points: Partial<ToOption>[]; absolute?: true }
  backTo?: { point: Point }
  onFinish?: (animate: (i?: number) => void) => void
  onFinishBeforeBack?: () => void
  duration: number
  noBack?: true
}

export const animateTo = (node: Node, options: AnimateOptions) => {
  const {
    to,
    onFinish = () => {},
    onFinishBeforeBack = () => {},
    duration,
    noBack = false,
    backTo = null,
  } = options

  const startConfig = {
    start: [],
    back: [],
  }

  to.points.forEach((point) => {
    const start: any = {}
    const back: any = {}
    if (!isNaN(point.x)) {
      start.x = to.absolute ? point.x : node.x() + point.x
      back.x = node.x()
    }
    if (!isNaN(point.y)) {
      start.y = to.absolute ? point.y : node.y() + point.y
      back.y = node.y()
    }
    if (point.rotation) {
      start.rotation = point.rotation.absolute
        ? point.rotation.amount
        : (node.rotation() || 0) + point.rotation.amount
      back.rotation = node.rotation() || 0
    }

    if (!isNaN(point.opacity)) {
      start.opacity = point.opacity
      back.opacity = node.opacity()
    }

    if (point.offset) {
      if (!isNaN(point.offset.x)) {
        start.offsetX = point.offset.x
        back.offsetX = node.offsetX()
      }
      if (!isNaN(point.offset.y)) {
        start.offsetY = point.offset.y
        back.offsetY = node.offsetY()
      }
    }

    if (!isNaN(point.scale)) {
      start.scaleX = point.scale
      start.scaleY = point.scale
      back.scaleX = node.scaleX()
      back.scaleY = node.scaleY()
    }

    if (!isNaN(point.width)) {
      start.width = point.width
      back.width = node.width()
    }

    if (!isNaN(point.height)) {
      start.height = point.height
      back.height = node.height()
    }

    if (!isNaN(point.angle)) {
      start.angle = point.angle
      // @ts-ignore
      back.angle = node?.angle?.() || 0
    }

    if (point.fill) {
      start.fill = point.fill
      back.fill = node.getAttr("fill")
    }
    if (typeof point.visible === "boolean") {
      start.visible = !!point.visible
      back.visible = node.visible()
    }

    startConfig.start.push(start)
    startConfig.back.push(back)
  })

  const animate = (i: number = 0) => {
    if (!node.getLayer()) return

    node.to({
      ...startConfig.start[i],
      duration,
      onFinish: () => {
        onFinishBeforeBack()
        if (noBack) {
          onFinish(animate)
        } else {
          node.to({
            ...startConfig.back[i],
            ...(backTo ? backTo.point : {}),
            duration,
            onFinish: () => {
              onFinish(animate)
            },
          })
        }
      },
    })
  }

  animate()
}

export const animate2to = (
  first: [node: Node, options: AnimateOptions],
  second: [node: Node, options: AnimateOptions],
  onFinish: (animate: (type: "first" | "second") => void) => void
) => {
  const animate = (type: "first" | "second") => {
    switch (type) {
      case "first":
        animate1()
        break

      case "second":
        animate2()
        break

      default:
        break
    }
  }

  const animate1 = () =>
    animateTo(first[0], { ...first[1], onFinish: () => onFinish(animate) })
  const animate2 = () =>
    animateTo(second[0], { ...second[1], onFinish: () => onFinish(animate) })
  animate("first")
}
