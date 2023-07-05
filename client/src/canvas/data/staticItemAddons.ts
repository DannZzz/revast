import Konva from "konva"
import { Point, Size, combineClasses } from "../../global/init"
import { Bio } from "../basic/bio-item.basic"
import { Group } from "konva/lib/Group"
import { Shape } from "konva/lib/Shape"
import { StaticSettableItem } from "../basic/static-item.basic"
import { Game } from "../game"
import { loadImage } from "../structures/fetchImages"

export type StaticItemAddonName =
  | "berry"
  | "campfire"
  | "furnace"
  | "point-machine"
  | "berry-seed"
  | "windmill"

const size = new Size(20, 20)
const berryPng = new Konva.Image({
  image: loadImage("/images/berry.png", (img) => {
    berryPng.image(img)
    berryPng.cache()
  }),
  ...size,
  offset: new Point(size.width / 2, size.height / 2),
}).cache()

export const StaticItemsAddons: {
  [k in StaticItemAddonName]: {
    alsoDraw?: (props: Bio | StaticSettableItem) => {
      items: Shape | Shape[] | Group | Group[]
      afterDraw?: () => void
    }
    drawByResourceChange?: (
      item: Bio | StaticSettableItem,
      currentResources: number
    ) => void
    drawSeparately?: (item: StaticSettableItem) => void
  }
} = {
  windmill: {
    alsoDraw: (item: StaticSettableItem) => {
      const size = item.size
      const group = new Konva.Group({
        offset: new Point(size.width / 2, size.height / 2),
        ...new Point(size.width / 2, size.height / 2),
      })
      const center = new Konva.Image({
        image: loadImage("/images/windmill-center.png", (img) =>
          center.image(img)
        ),
        ...size,
      })
      const wheel = new Konva.Image({
        image: loadImage("/images/windmill-circle.png", (img) =>
          wheel.image(img)
        ),
        offset: new Point(size.width / 2, size.height / 2),
        ...new Point(size.width / 2, size.height / 2),
        ...size,
      })
      group.add(wheel, center)

      var angularSpeed = 50
      var anim: Konva.Animation = new Konva.Animation(function (frame) {
        var angleDiff = (frame.timeDiff * angularSpeed) / 1000
        wheel.rotate(angleDiff)
        if (item.destroyed) anim.stop()
      })
      item.currentMode === 1 && anim.start()
      item.on("mode", (item) => {
        item.currentMode === 1 ? anim.start() : anim.stop()
      })

      item.on("destroy", () => {
        group.destroy()
      })

      return {
        items: group,
      }
    },
  },
  berry: {
    drawByResourceChange: (bio: Bio, currentResources: number) => {
      const groupPos = new Point(35, 40)

      const createCircle = (point: Point, i: number) => {
        const circleGroup = berryPng.clone({
          ...point,
        })
        return circleGroup
      }
      const getPoint = (i: number) => {
        switch (i) {
          case 0: {
            return new Point(20, 30)
          }
          case 1:
            return new Point(90, 30)
          case 2:
            return new Point(55, 40)
          case 3:
            return new Point(50, 70)
          case 4:
            return new Point(90, 60)
          case 5:
            return new Point(15, 65)
          default:
            return new Point(0, 0)
            break
        }
      }

      $.$ArrayLength(bio.data.maxResources, (i) => {
        const show = i + 1 <= currentResources
        if (!show) {
          bio.alsoSavedNodes[i]?.destroy()
          bio.alsoSavedNodes[i] = null
          return
        }
        if (bio.alsoSavedNodes[i]) return
        bio.alsoSavedNodes[i] = createCircle(
          combineClasses(groupPos, getPoint(i)),
          i
        )
        bio.node.add(bio.alsoSavedNodes[i])
      })
    },
  },
  "point-machine": {
    drawSeparately(item) {
      const center = item.point
      const size = item.size
      const ground = new Konva.Image({
        image: loadImage("/images/point-machine-ground.png", (img) =>
          ground.image(img)
        ),
        ...center,
        offset: new Point(size.width / 2, size.height / 2),
        ...size,
      })
      Game.groupAdd(item.layer, Game.settableHoistId(0), ground)

      const period = 2000
      var anim = new Konva.Animation((frame) => {
        var scale = 0.025 * Math.sin((frame.time * 2 * Math.PI) / period) + 1
        ground.scaleX(scale).scaleY(scale)
        if (item.destroyed) anim.stop()
      }).start()

      item.on("destroy", () => {
        ground.destroy()
      })
    },
    alsoDraw(item: StaticSettableItem) {
      const size = item.size

      const hole = new Konva.Image({
        image: loadImage("/images/point-machine-hole.png", (img) =>
          hole.image(img)
        ),

        offset: new Point(size.width / 2, size.height / 2),
        ...new Point(size.width / 2, size.height / 2),
        ...size,
      })

      var angularSpeed = 90
      var anim = new Konva.Animation(function (frame) {
        var angleDiff = (frame.timeDiff * angularSpeed) / 1000
        hole.rotate(angleDiff)
        if (item.destroyed) return anim.stop()
      })

      anim.start()

      item.on("destroy", () => {
        hole.destroy()
      })

      return {
        items: hole,
      }
    },
  },
  campfire: {
    alsoDraw: (props: StaticSettableItem) => {
      const center = new Point(props.size.width / 2, props.size.height / 2)
      const circle = new Konva.Circle({
        radius: 200,
        fill: "#FFC40066",
        opacity: 0.8,
        ...center,
      })
      const smallCircle = new Konva.Circle({
        radius: 120,
        fill: "#FFC40099",
        opacity: 0.8,
        ...center,
      })

      const fireGroup = new Konva.Group({ ...center })

      const circle1 = new Konva.Circle({ radius: 60, fill: "#FFC4009E" })
      const circle2 = new Konva.Circle({
        radius: 40,
        fill: "rgba(255,255,0,.8)",
      })
      const circle3 = new Konva.Circle({ radius: 20, fill: "#EA8033aa" })
      fireGroup.add(circle1, circle2, circle3)

      const period = 2000
      var anim = new Konva.Animation((frame) => {
        var scale = 0.025 * Math.sin((frame.time * 2 * Math.PI) / period) + 1
        fireGroup.scaleX(scale).scaleY(scale)
        if (props.destroyed) anim.stop()
      })

      anim.start()

      return {
        items: [circle, smallCircle, fireGroup] as any,
        afterDraw: () => {
          circle.zIndex(-10)
          smallCircle.zIndex(-9)
        },
      }
    },
  },
  furnace: {
    drawSeparately: (item) => {
      const center = item.point

      const circle = new Konva.Circle({
        radius: 200,
        fill: "#FFC40066",
        opacity: 0.8,
      })
      const smallCircle = new Konva.Circle({
        radius: 120,
        fill: "#FFC40099",
        opacity: 0.8,
      })

      const fireGroup = new Konva.Group({ ...center })
      fireGroup.add(circle, smallCircle)
      Game.groupAdd(item.layer, Game.settableHoistId(0), fireGroup)
      item.on("destroy", (item) => {
        fireGroup.destroy()
      })
      item.on("mode", (item) => {
        fireGroup.visible(item.currentMode === 1)
      })
    },
  },
  "berry-seed": {
    drawByResourceChange: (
      bio: StaticSettableItem,
      currentResources: number
    ) => {
      const groupPos = new Point(15, 10)

      const createCircle = (point: Point) => {
        const circleGroup = berryPng.clone({
          ...point,
        })
        return circleGroup
      }

      const getPoint = (i: number) => {
        switch (i) {
          case 0:
            return new Point(20, 30)

          case 1:
            return new Point(50, 40)

          case 2:
            return new Point(20, 60)

          default:
            return new Point(0, 0)
        }
      }

      $.$ArrayLength(bio.seedResource.maxResources, (i) => {
        const show = i + 1 <= currentResources

        if (!show) {
          bio.alsoSavedNodes[i]?.destroy()
          bio.alsoSavedNodes[i] = null
          return
        }
        if (bio.alsoSavedNodes[i]) return

        bio.alsoSavedNodes[i] = createCircle(
          combineClasses(groupPos, getPoint(i))
        )
        bio.node.add(bio.alsoSavedNodes[i])
      })
    },
  },
}
