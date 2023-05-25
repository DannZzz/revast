import { Point } from 'src/global/global'
import { Bio } from '../game/basic/bio-item.basic'
import { StaticSettableItem } from '../game/basic/static-item.basic'
import { BasicDrop } from 'src/game/basic/drop.basic'

export class StaticItems {
  private _bio: Bio[] = []
  private _settable: StaticSettableItem[] = []
  private _drops: BasicDrop[] = []

  get drops() {
    return [...this._drops]
  }

  addDrop(...drops: BasicDrop[]) {
    this._drops.push(...drops)
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

  someWithin(
    points:
      | Point[]
      | (() => [points: Point[]] | [point: Point, radius: number]),
    strict: boolean = false,
  ) {
    const argArray: [points: Point[]] | [point: Point, radius: number] =
      Array.isArray(points) ? [points] : points()
    return this.all.some((item) => {
      if (strict) {
        if ('withinStrict' in item) {
          // @ts-ignore
          return item.withinStrict(...argArray)
        } else {
          // @ts-ignore
          return item.within(...argArray)
        }
      } else {
        // @ts-ignore
        return 'ignoreCheckers' in item ? false : item.within(...argArray)
      }
    })
  }

  itemWithin(points: Point[]) {
    return this.all.find((item) => item.within(points))
  }

  itemWithinArray(points: Point[]) {
    return this.all.filter((item) => item.within(points))
  }

  playerDied(playerId: number) {
    this._settable = this._settable.filter(
      (settable) => settable.authorId !== playerId,
    )
  }

  removeSettable(id: string) {
    this._settable = this._settable.filter((settable) => settable.id !== id)
  }
}
