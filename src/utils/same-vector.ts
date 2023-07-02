import { Point } from 'src/global/global'

export const isSameVector = (...points: Point[]) => {
  const [first, ...otherPoints] = points
  return otherPoints.every(
    (point) => point?.x === first?.x && point?.y === first?.y,
  )
}
