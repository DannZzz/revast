import { Point, Size, combineClasses } from 'src/global/global'

export class BasicMath {
  static xy(index: number, colls: Size, tile: Size = new Size(1, 1)) {
    return new Point(
      Math.floor(index % colls.width) * tile.width + tile.width,
      Math.floor(index / colls.height) * tile.height + tile.height,
    )
  }

  static pointWithinRect(
    point: Point | [Point, Point],
    rect: { size: Size; point: Point } | [topLeft: Point, bottomRight: Point],
  ) {
    let corners: [Point, Point] = [null, null]
    let [topLeft, bottomRight] = Array.isArray(point) ? point : [point, point]
    if (Array.isArray(rect)) {
      corners = rect
    } else {
      corners[0] = rect.point
      corners[1] = combineClasses(
        rect.point,
        new Point(rect.size.width, rect.size.height),
      )
    }

    const [thisTopLeft, thisBottomRight] = corners

    if (topLeft.x > thisBottomRight.x || thisTopLeft.x > bottomRight.x)
      return false

    if (topLeft.y > thisBottomRight.y || thisTopLeft.y > bottomRight.y)
      return false

    return true
  }

  // static cornersFromTwoPoints(
  //   point1: Point,
  //   point2: Point,
  // ): [topLeft: Point, bottomRight: Point] {
  //   const leftX = Math.min(point1.x, point2.x)
  //   const rightX = leftX === point1.x ? point2.x : point1.x
  // }

  static pythagorean(sideA: number, sideB: number) {
    return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2))
  }
}
