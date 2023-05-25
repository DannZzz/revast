const imagesCache = {}

export function loadImage(url: string): Img
export function loadImage(url: string, onLoad: (img: Img) => void): Img
export function loadImage(
  url: string,
  onLoad?: (img: Img) => void
): Img | void {
  if (url in imagesCache) return imagesCache[url]
  const img = new Image()
  img.onload = () => {
    imagesCache[url] = img
    onLoad?.(img)
  }
  img.crossOrigin = "Anonymous"
  img.src = url
  return img
}
