import { Point } from "../../global/init"

export const getDistance = (i: Point, f: Point) => {
  return Math.abs(Math.sqrt(Math.pow(f.x - i.x, 2) + Math.pow(f.y - i.y, 2)))
}

export const getAngle = (p1: Point, p2: Point) => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

export const getPointByTheta = (
  from: Point,
  theta: number,
  range: number
): Point => {
  return new Point(
    from.x + range * Math.cos(theta),
    from.y + range * Math.sin(theta)
  )
}

// es matem a xaxax
