import { MobDto } from "../../socket/events"
import Konva from "konva"
import { loadImage } from "../structures/fetchImages"
import { zIndexOf } from "../../constants"

export class BasicMob implements MobDto {
  id: string
  point: Point
  size: Size
  angle: number
  url: string
  hurtUrl: string

  imageNode: Konva.Image
  canHurt: boolean = true

  constructor(data: MobDto) {
    Object.assign(this, data)
  }

  draw(layer: Konva.Group) {
    loadImage(this.hurtUrl)
    this.imageNode = new Konva.Image({
      image: loadImage(this.url, (img) => this.imageNode.image(img)),
      offset: {
        x: this.size.width / 2,
        y: this.size.height / 2,
      },
      ...this.point,
      ...this.size,
      rotation: this.angle,
      id: `mob-${this.id}`,
    })

    layer.add(this.imageNode)
  }

  update() {
    this.imageNode.position(this.point)
    this.imageNode.rotation(this.angle - 90)
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
    this.imageNode.destroy()
  }
}
