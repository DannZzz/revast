import Konva from "konva"
import { Player } from "./player"
import { Game } from "../game"
import { PlayerJoinedDto } from "../../socket/events"
import { animateTo } from "../animations/to"
import { loadImage } from "../structures/fetchImages"

interface NodeGroup {
  group: Konva.Group
  arc: Konva.Arc
  inProcess: boolean
  timeout: number
}

export class PlayerTimeout {
  private weaponNode: NodeGroup = <any>{
    group: null,
    arc: null,
    inProcess: false,
  }
  private helmetNode: NodeGroup = <any>{
    group: null,
    arc: null,
    inProcess: false,
  }
  private buildingNode: NodeGroup = <any>{
    group: null,
    arc: null,
    inProcess: false,
  }
  private size = 100
  private gap = 10
  private radius = 40

  constructor(
    private layer: Konva.Layer,
    private layer2: Konva.Layer,
    timeout: PlayerJoinedDto["timeout"]
  ) {
    this.buildingNode.timeout = timeout[2]
    this.helmetNode.timeout = timeout[1]
    this.weaponNode.timeout = timeout[0]
    this.draw()
  }

  draw() {
    const mainGroup = new Konva.Group({
      y: this.layer.getStage().height() - this.gap,
      x: this.gap,
    })

    const createGroup = (
      node: NodeGroup,
      i: number,
      arcColor: string,
      imgPath: string
    ): void => {
      const y = this.size + i * (this.size + this.gap)
      node.group = new Konva.Group({
        offsetY: y,
        visible: false,
      })

      node.arc = new Konva.Arc({
        x: this.size / 2,
        y: this.size / 2,
        outerRadius: this.radius,
        innerRadius: this.radius - 5,
        angle: 360,
        fill: arcColor,
      })

      const img = new Konva.Image({
        image: loadImage(imgPath, (image) => img.image(image)),
        width: this.radius,
        height: this.radius,
        offset: {
          x: this.radius / 2,
          y: this.radius / 2,
        },
        x: this.size / 2,
        y: this.size / 2,
      })
      node.group.add(img, node.arc)
      mainGroup.add(node.group)
    }

    createGroup(this.buildingNode, 0, "#586182", "images/building-timeout.png")
    createGroup(this.helmetNode, 1, "#e95682", "images/helmet-timeout.png")
    createGroup(this.weaponNode, 2, "#b7ae9f", "images/weapon-timeout.png")

    Game.createAlwaysTop(this.layer2, mainGroup)
  }

  try(type: "building" | "weapon" | "helmet") {
    const gr: NodeGroup = this[`${type}Node`]
    if (!gr || gr.inProcess) return
    gr.inProcess = true
    gr.arc.angle(360)
    gr.group.visible(true)
    animateTo(gr.arc, {
      to: { points: [{ angle: 0 }] },
      duration: gr.timeout,
      noBack: true,
      onFinish: () => {
        gr.inProcess = false
        gr.group.visible(false)
        gr.arc.angle(360)
      },
    })
  }
}
