import Konva from "konva"
import { MiscDto } from "../../socket/events"
import { loadImage } from "../structures/fetchImages"

export class BasicMisc implements MiscDto {
  id: string
  url: string
  point: Point
  size: Size

  private imageNode: Konva.Image
  destroyed = false
  private layer: Konva.Layer
  private layer2: Konva.Group

  constructor(data: MiscDto) {
    Object.assign(this, data)
  }

  take(layer: Konva.Layer, layer2: Konva.Group) {
    this.layer = layer
    this.layer2 = layer2
    return this
  }

  draw() {
    const group: Konva.Group = this.layer.findOne("#game-misc-1")
    this.imageNode = new Konva.Image({
      ...this.point,
      listening: false,
      image: loadImage(this.url, (img) => this.imageNode.image(img).cache()),
      ...this.size,
      // offset: {
      //   x: this.size.width / 2,
      //   y: this.size.height / 2,
      // },
    }).cache()

    group.add(this.imageNode)
  }

  destroy() {
    if (!this.destroyed) {
      this.imageNode.destroy()
      this.destroyed = true
    }
  }
}
