import Konva from "konva"
import { DropDto } from "../../socket/events"
import { loadImage } from "../structures/fetchImages"

export class BasicDrop implements DropDto {
  id: string
  url: string
  hurtUrl: string
  point: Point
  size: Size

  private imageNode: Konva.Image
  private canHurt: boolean = true
  destroyed = false

  constructor(data: DropDto) {
    Object.assign(this, data)
  }

  draw(group: Konva.Layer | Konva.Group) {
    loadImage(this.hurtUrl)
    this.imageNode = new Konva.Image({
      ...this.point,
      image: loadImage(this.url, (img) => this.imageNode.image(img)),
      ...this.size,
      offset: {
        x: this.size.width / 2,
        y: this.size.height / 2,
      },
      rotation: $.randomNumber(0, 360),
    })

    group.add(this.imageNode)
    this.imageNode.zIndex(2)
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
