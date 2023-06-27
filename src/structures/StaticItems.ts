import { Point } from 'src/global/global'
import { Bio } from '../game/basic/bio-item.basic'
import { StaticSettableItem } from '../game/basic/static-item.basic'
import { BasicDrop } from 'src/game/basic/drop.basic'
import { UniversalHitbox } from 'src/utils/universal-within'
import { SettableCheckers } from 'src/game/basic/item.basic'
import { Misc } from 'src/game/basic/misc.basic'

export interface CheckingOptions {
  strict?: boolean
  ignoreTypes?: string[]
  ignore?: SettableCheckers
  type?: string
  onlyTypes?: string[]
}

export class StaticItems {
  bio: Bio[] = []
  settable: StaticSettableItem[] = []
  drops: BasicDrop[] = []
  miscs: Misc[] = []

  addDrop(...drops: BasicDrop[]) {
    this.drops.push(...drops)
    return this
  }

  addMisc(...miscs: Misc[]) {
    this.miscs.push(...miscs)
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

  someWithin(
    hitbox: UniversalHitbox,
    options: CheckingOptions | boolean = false,
  ) {
    return this.all.some(filterStaticItems(hitbox, options))
  }

  itemWithin(
    hitbox: UniversalHitbox,
    options: CheckingOptions | boolean = false,
  ) {
    return this.all.find(filterStaticItems(hitbox, options))
  }

  itemWithinArray(
    hitbox: UniversalHitbox,
    options: CheckingOptions | boolean = false,
  ) {
    return this.all.filter(filterStaticItems(hitbox, options))
  }
}

export function filterStaticItems(
  hitbox: UniversalHitbox,
  options: CheckingOptions | boolean,
): (item: Bio | StaticSettableItem) => boolean {
  let _options: CheckingOptions =
    typeof options === 'boolean' ? { strict: options } : options

  const { strict, ignoreTypes = [], ignore, type, onlyTypes = [] } = _options
  return (item) => {
    if (ignoreTypes.includes(item.data.type)) return false

    const can = onlyTypes.length > 0 ? onlyTypes.includes(item.data.type) : true

    if (strict) {
      if (
        ignore === 'all' ||
        ('ignoreCheckers' in item.data && item.data.ignoreCheckers == 'all')
      )
        return false
      if (
        (ignore === 'type' ||
          ('ignoreCheckers' in item.data &&
            item.data.ignoreCheckers == 'type')) &&
        item?.data?.type !== type
      )
        return false

      if ('withinStrict' in item) {
        return item.withinStrict(hitbox) && can
      } else {
        return item.within(hitbox) && can
      }
    } else {
      return 'ignoreCheckers' in item ? false : item.within(hitbox) && can
    }
  }
}
