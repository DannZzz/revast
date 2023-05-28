import { uuid } from 'anytool'
import Chest from 'anytool/dist/Chest'
import { Craftable } from 'src/game/basic/item.basic'

export class Craft {
  static data: Chest<string, Craft> = new Chest()

  static addCraft(forItem: number, craftable: Craftable) {
    const id = `craft-${uuid(10)}-${this.data.size}`
    this.data.set(id, new Craft(id, forItem, craftable))
  }

  private constructor(
    readonly id: string,
    readonly itemId: number,
    readonly craftable: Craftable,
  ) {}
}
