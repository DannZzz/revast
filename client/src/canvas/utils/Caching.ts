import { Group } from "konva/lib/Group"
import { Shape } from "konva/lib/Shape"

export class ShapeCache {
  private static _cache: { [k: string]: Shape | Group } = {}

  /**
   * Don't forget to .cache()
   */
  static try(
    uniqueType: string,
    drawShape: () => Shape | Group,
    adjustmentByCloning: any
  ): Shape | Group {
    if (uniqueType in this._cache) {
      return this._cache[uniqueType].clone(adjustmentByCloning)
    }
    const shape = drawShape()
    this._cache[uniqueType] = shape
    return shape
  }
}
