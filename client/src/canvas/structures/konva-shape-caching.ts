import { Chest } from "anytool"
import Konva from "konva"
import { Node, NodeConfig } from "konva/lib/Node"

export interface CachedShape {
  nodes: Record<any, any>
}

export class KonvaShapeCache {
  private static cacheData = new Chest<string, CachedShape>()

  static make<T extends any>(
    thisArg: T,
    key: string,
    draw: (this: T, data: CachedShape) => void,
    clone: (this: T, data: CachedShape) => void
  ) {
    if (this.check(key)) {
      clone.call(thisArg, this.cacheData.get(key))
    } else {
      const data: CachedShape = { nodes: {} }
      draw.call(thisArg, data)
      this.cacheData.set(key, data)
    }
  }

  static check(key: string) {
    return this.cacheData.has(key)
  }
}
