import {
  boxBox,
  boxCircle,
  boxPoint,
  circleBox,
  circleCircle,
  circlePoint,
  circlePolygon,
  pointBox,
  pointCircle,
  pointPolygon,
  polygonBox,
  polygonCircle,
  polygonPoint,
  polygonPolygon,
} from 'intersects'
import { Point, Size, Vector2d } from 'src/global/global'
import { Converter } from 'src/structures/Converter'

export type UniversalHitbox =
  | Vector2d
  | Vector2d[]
  | { point: Vector2d; size: Size }
  | { point: Vector2d; radius: number }

const toBox = (d: {
  point: Vector2d
  size: Size
}): [number, number, number, number] => {
  return [...Converter.pointToXYArray(d.point), d.size.width, d.size.height]
}

export const universalWithin = (
  first: UniversalHitbox,
  second: UniversalHitbox,
): boolean => {
  if ('size' in first) {
    const converted = toBox(first)
    if ('size' in second) {
      return boxBox(...converted, ...toBox(second))
    }

    if ('radius' in second) {
      return boxCircle(
        ...converted,
        ...Converter.pointToXYArray(second.point),
        second.radius,
      )
    }

    if (Array.isArray(second)) {
      return polygonBox(Converter.pointArrayToXYArray(second), ...converted)
    }

    return boxPoint(...converted, ...Converter.pointToXYArray(second))
  }

  if ('radius' in first) {
    const converted: [number, number, number] = [
      ...Converter.pointToXYArray(first.point),
      first.radius,
    ]
    if ('size' in second) {
      return circleBox(...converted, ...toBox(second))
    }

    if ('radius' in second) {
      return circleCircle(
        ...converted,
        ...Converter.pointToXYArray(second.point),
        second.radius,
      )
    }

    if (Array.isArray(second)) {
      return polygonCircle(Converter.pointArrayToXYArray(second), ...converted)
    }

    return circlePoint(...converted, ...Converter.pointToXYArray(second))
  }

  if (Array.isArray(first)) {
    const converted = Converter.pointArrayToXYArray(first)
    if ('size' in second) {
      return polygonBox(converted, ...toBox(second))
    }

    if ('radius' in second) {
      return polygonCircle(
        converted,
        ...Converter.pointToXYArray(second.point),
        second.radius,
      )
    }

    if (Array.isArray(second)) {
      return polygonPolygon(Converter.pointArrayToXYArray(second), converted)
    }

    return polygonPoint(converted, ...Converter.pointToXYArray(second), 1)
  }

  const converted = Converter.pointToXYArray(first)

  if ('size' in second) {
    return pointBox(...converted, ...toBox(second))
  }

  if ('radius' in second) {
    return pointCircle(
      ...converted,
      ...Converter.pointToXYArray(second.point),
      second.radius,
    )
  }

  if (Array.isArray(second)) {
    return polygonPoint(Converter.pointArrayToXYArray(second), ...converted, 1)
  }

  return first.x === second.x && first.y === second.y
}
