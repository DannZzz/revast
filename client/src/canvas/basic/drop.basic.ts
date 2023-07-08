import Konva from "konva"
import { DropDto } from "../../socket/events"
import { loadImage } from "../structures/fetchImages"
import { zIndexOf } from "../../constants"

export class BasicDrop implements DropDto {
  id: string
  url: string
  hurtUrl: string
  point: Point
  size: Size

  private imageNode: Konva.Image
  private canHurt: boolean = true
  destroyed = false
  private layer: Konva.Layer
  private layer2: Konva.Group

  constructor(data: DropDto) {
    Object.assign(this, data)
  }

  take(layer: Konva.Layer, layer2: Konva.Group) {
    this.layer = layer
    this.layer2 = layer2
    return this
  }

  draw() {
    const group: Konva.Group = this.layer.findOne("#game-settable-1")
    loadImage(this.hurtUrl)
    this.imageNode = new Konva.Image({
      ...this.point,
      image: loadImage(this.url, (img) => this.imageNode.image(img)),
      ...this.size,
      listening: false,
      offset: {
        x: this.size.width / 2,
        y: this.size.height / 2,
      },
      rotation: $.randomNumber(0, 360),
    })

    group.add(this.imageNode)
  }

  hurt() {
    if (!this.canHurt) return
    this.canHurt = false
    this.imageNode.image(
      loadImage(this.hurtUrl, (img) => this.imageNode.image(img))
    )
    const t = setTimeout(() => {
      this.canHurt = true
      this.imageNode.image(loadImage(this.url))
      clearTimeout(t)
    }, 150)
  }

  destroy() {
    if (!this.destroyed) {
      this.imageNode.destroy()
      this.destroyed = true
    }
  }
}
