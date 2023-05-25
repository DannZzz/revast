import { Point, Size } from 'src/global/global'

export const pointsOfRotatedRectangle = (
  center: Point,
  { width, height }: Size,
  angle: number,
): [topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point] => {
  const Top_Right = new Point(0, 0),
    Top_Left = new Point(0, 0),
    Bot_Right = new Point(0, 0),
    Bot_Left = new Point(0, 0)

  Top_Right.x =
    center.x + (width / 2) * Math.cos(angle) - (height / 2) * Math.sin(angle)
  Top_Right.y =
    center.y + (width / 2) * Math.sin(angle) + (height / 2) * Math.cos(angle)

  Top_Left.x =
    center.x - (width / 2) * Math.cos(angle) - (height / 2) * Math.sin(angle)
  Top_Left.y =
    center.y - (width / 2) * Math.sin(angle) + (height / 2) * Math.cos(angle)

  Bot_Left.x =
    center.x - (width / 2) * Math.cos(angle) + (height / 2) * Math.sin(angle)
  Bot_Left.y =
    center.y - (width / 2) * Math.sin(angle) - (height / 2) * Math.cos(angle)

  Bot_Right.x =
    center.x + (width / 2) * Math.cos(angle) + (height / 2) * Math.sin(angle)
  Bot_Right.y =
    center.y + (width / 2) * Math.sin(angle) - (height / 2) * Math.cos(angle)
  return [Top_Left, Top_Right, Bot_Right, Bot_Left]
}
