import Konva from "konva"
import { Point, combineClasses } from "../../global/init"
import { Bio } from "../basic/bio-item.basic"
import { Group } from "konva/lib/Group"
import { Shape } from "konva/lib/Shape"
import { StaticSettableItem } from "../basic/static-item.basic"
import { Game } from "../game"

export type StaticItemAddonName = "berry" | "campfire" | "furnace"

export const StaticItemsAddons: {
  [k in StaticItemAddonName]: {
    alsoDraw?: (props: Bio | StaticSettableItem) => {
      items: Shape | Shape[] | Group | Group[]
      afterDraw?: () => void
    }
    drawByResourceChange?: (bio: Bio, currentResources: number) => void
    drawSeparately?: (item: StaticSettableItem) => void
  }
} = {
  berry: {
    alsoDraw: (props: Bio) => {
      const groupOfBerries = new Konva.Group({
        x: 35,
        y: 40,
      })

      const createCircle = (point: Point, i: number) => {
        const circleGroup = new Konva.Group({
          ...point,
        })
        const circle = new Konva.Circle({
          // id: `${props.id}-berry-${i}`,
          radius: 10,
          fill: "#AD232B",
          stroke: "black",
          strokeWidth: 0.5,
        })
        const circleWithin = new Konva.Circle({
          radius: 3.5,
          fill: "#E66368",
          x: 0,
          y: -2,
        })
        circleGroup.visible(i + 1 <= props.data.currentResources)
        props.alsoSavedNodes[i] = circleGroup
        circleGroup.add(circle, circleWithin)
        return circleGroup
      }

      $.$ArrayLength(props.data.maxResources, (i) => {
        switch (i) {
          case 0: {
            groupOfBerries.add(createCircle(new Point(20, 30), i))
            break
          }
          case 1:
            groupOfBerries.add(createCircle(new Point(70, 30), i))
            break
          case 2:
            groupOfBerries.add(createCircle(new Point(45, 40), i))
            break
          case 3:
            groupOfBerries.add(createCircle(new Point(40, 70), i))
            break
          case 4:
            groupOfBerries.add(createCircle(new Point(70, 60), i))
            break
          case 5:
            groupOfBerries.add(createCircle(new Point(15, 65), i))
            break
          default:
            break
        }
      })

      return { items: groupOfBerries }
    },
    drawByResourceChange: (bio: Bio, currentResources: number) => {
      $.$ArrayLength(bio.data.maxResources, (i) => {
        bio.alsoSavedNodes[i]?.visible(i + 1 <= currentResources)
      })
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
        fireGroup.scale({ x: scale, y: scale })
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
}
