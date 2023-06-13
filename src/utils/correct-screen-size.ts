import { Size } from 'src/global/global'

export const correctScreenSize = (size: Size, maxSize: Size) => {
  let correctSize = new Size(size.width, size.height)
  if (!size.width || !size.height || size.width < 0 || size.height < 0)
    return null
  if (size.width >maxSize.width) {
    correctSize.width =maxSize.width
  }
  if (size.height >maxSize.height) {
    correctSize.height =maxSize.height
  }
  return correctSize
}
