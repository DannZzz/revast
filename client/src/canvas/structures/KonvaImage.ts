import Konva from "konva"
import { Image } from "konva/lib/shapes/Image"
import { loadImage } from "./fetchImages"

export type ImageConfig = Konva.ImageConfig & {
  image: string
  cache?: boolean
  onLoad?: (this: KonvaImage, img: HTMLImageElement) => void
}

export class KonvaImage extends Image {
  constructor(config: ImageConfig) {
    const { onLoad, cache, image, ...otherProps } = config
    const cb = onLoad || (() => {})
    const loadedImage = loadImage(image, (img) => {
      cb.call(this, img)
      if (cache) this.cache()
    })

    super({ ...otherProps, image: loadedImage })
    if (cache) this.cache()
  }
}
