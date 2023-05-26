import { Vector2d } from 'src/global/global'

export class Converter {
  static pointToXYArray(point: Vector2d): [x: number, y: number] {
    return [point.x, point.y]
  }

  static pointArrayToXYArray(points: Vector2d[]): number[] {
    return points.map((point) => [point.x, point.y]).flat()
  }
}
