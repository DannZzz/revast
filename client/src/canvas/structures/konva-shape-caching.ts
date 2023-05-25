import { Chest } from "anytool";
import Konva from "konva";
import { NodeConfig } from "konva/lib/Node";

export class KonvaShapeCache {
  private static cacheData = new Chest<string, any>()
  
  static draw<T extends Konva.Shape | Konva.Group>(key: string, element: () => T, cloneOptions: NodeConfig): T {
    if (this.cacheData.has(key)) return this.cacheData.get(key).clone(cloneOptions)
    const el = element()
    el.cache()
    this.cacheData.set(key, el)
    return el
  }

  static check<T = any>(key: string): T {
    return this.cacheData.get(key)
  }

  static setManually(key: string, data: any) {
    this.cacheData.set(key, data)
  }
}