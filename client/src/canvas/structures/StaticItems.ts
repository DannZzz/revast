import { Bio } from "../basic/bio-item.basic"
import { BasicDrop } from "../basic/drop.basic"
import { BasicMisc } from "../basic/misc.basic"
import { StaticSettableItem } from "../basic/static-item.basic"

export type StaticItemType = Bio | StaticSettableItem

export class StaticItems {
  private _bio: Bio[] = []
  private _settable: StaticSettableItem[] = []
  private _drops: BasicDrop[] = []
  private _miscs: BasicMisc[] = []

  get drops() {
    return [...this._drops]
  }

  set drops(val) {
    this._drops = val
  }

  addDrop(...drops: BasicDrop[]) {
    this._drops.push(...drops)
    return this
  }

  get miscs() {
    return [...this._miscs]
  }

  set miscs(val) {
    this._miscs = val
  }

  addMisc(...miscs: BasicMisc[]) {
    this._miscs.push(...miscs)
    return this
  }

  removeDrop(id: string) {
    this._drops = this._drops.filter((drop) => drop.id !== id)
    return this
  }

  get bio() {
    return [...this._bio]
  }

  set bio(val) {
    this._bio = val
  }

  addBios(...bios: Bio[]) {
    this._bio.push(...bios)
    return this
  }

  get settable() {
    return [...this._settable]
  }

  set settable(val) {
    this._settable = val
  }

  addSettables(...settables: StaticSettableItem[]) {
    this._settable.push(...settables)
    return this
  }

  get all() {
    return [...this._bio, ...this._settable]
  }
}
