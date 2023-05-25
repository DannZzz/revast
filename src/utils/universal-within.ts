import {
  circleCircle,
  circlePoint,
  circlePolygon,
  pointCircle,
  pointPolygon,
  polygonCircle,
  polygonPoint,
  polygonPolygon,
} from 'intersects'
import { Point } from 'src/global/global'
import { Converter } from 'src/structures/Converter'

export type UniversalHitbox = Point | Point[] | { point: Point; radius: number }

export const universalWithin = (
  first: UniversalHitbox,
  second: UniversalHitbox,
): boolean => {
  if (Array.isArray(first)) {
    const converted = Converter.pointArrayToXYArray(first)
    if (Array.isArray(second)) {
      return polygonPolygon(converted, Converter.pointArrayToXYArray(second))
    }

    if ('radius' in second) {
      return polygonCircle(
        converted,
        ...Converter.pointToXYArray(second.point),
        second.radius,
      )
    }

    return polygonPoint(converted, ...Converter.pointToXYArray(second), 1)
  }

  if ('radius' in first) {
    const converted: [number, number, number] = [
      ...Converter.pointToXYArray(first.point),
      first.radius,
    ]
    if (Array.isArray(second)) {
      return circlePolygon(...converted, Converter.pointArrayToXYArray(second))
    }

    if ('radius' in second) {
      return circleCircle(
        ...converted,
        ...Converter.pointToXYArray(second.point),
        second.radius,
      )
    }

    return circlePoint(...converted, ...Converter.pointToXYArray(second))
  }

  const converted = Converter.pointToXYArray(first)

  if (Array.isArray(second)) {
    return pointPolygon(...converted, Converter.pointArrayToXYArray(second), 1)
  }

  if ('radius' in second) {
    return pointCircle(
      ...converted,
      ...Converter.pointToXYArray(second.point),
      second.radius,
    )
  }

  return first.x === second.x && first.y === second.y
}
