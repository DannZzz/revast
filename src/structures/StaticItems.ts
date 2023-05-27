import { Point } from 'src/global/global'
import { Bio } from '../game/basic/bio-item.basic'
import { StaticSettableItem } from '../game/basic/static-item.basic'
import { BasicDrop } from 'src/game/basic/drop.basic'
import { UniversalHitbox } from 'src/utils/universal-within'

export class StaticItems {
  bio: Bio[] = []
  settable: StaticSettableItem[] = []
  drops: BasicDrop[] = []

  addDrop(...drops: BasicDrop[]) {
    this.drops.push(...drops)
    return this
  }

  removeDrop(id: string) {
    this.drops = this.drops.filter((drop) => drop.id !== id)
    return this
  }

  addBios(...bios: Bio[]) {
    this.bio.push(...bios)
    return this
  }

  addSettables(...settables: StaticSettableItem[]) {
    this.settable.push(...settables)
    return this
  }

  playerDied(playerId: number) {
    this.settable = this.settable.filter(
      (settable) => settable.authorId !== playerId,
    )
  }

  removeSettable(id: string) {
    this.settable = this.settable.filter((settable) => settable.id !== id)
  }

  get all() {
    return [...this.bio, ...this.settable]
  }

  someWithin(hitbox: UniversalHitbox, strict: boolean = false) {
    return this.all.some((item) => {
      if (strict) {
        if ('withinStrict' in item) {
          return item.withinStrict(hitbox)
        } else {
          return item.within(hitbox)
        }
      } else {
        return 'ignoreCheckers' in item ? false : item.within(hitbox)
      }
    })
  }

  itemWithin(hitbox: UniversalHitbox) {
    return this.all.find((item) => item.within(hitbox))
  }

  itemWithinArray(hitbox: UniversalHitbox) {
    return this.all.filter((item) => item.within(hitbox))
  }
}
