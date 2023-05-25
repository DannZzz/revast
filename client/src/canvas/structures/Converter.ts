export class Converter {
  static pointToXYArray(point: Point): [x: number, y: number] {
    return [point.x, point.y]
  }

  static pointArrayToXYArray(points: Point[]): number[] {
    return points.map((point) => [point.x, point.y]).flat()
  }
}
