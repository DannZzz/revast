import { UniversalHitbox } from 'src/utils/universal-within'
import { AreaStaticItems, GameMap, MapAreaName } from './GameMap'
import { StaticItems } from './StaticItems'
import { Bio } from 'src/game/basic/bio-item.basic'
import { BasicDrop } from 'src/game/basic/drop.basic'
import { StaticSettableItem } from 'src/game/basic/static-item.basic'

export class StaticItemsHandler {
  areas: AreaStaticItems = {}
  map: GameMap

  for(hitbox: UniversalHitbox): Handler
  for(areas: MapAreaName[]): Handler
  for(_areas: UniversalHitbox | MapAreaName[]) {
    let areas: any[] = []
    if (!(Array.isArray(_areas) && typeof _areas[0] === 'string')) {
      // @ts-ignore
      areas = this.map.biomeOf(_areas)
    } else {
      areas = _areas as any
    }
    const q = areas.map((area) => this.areas[area])

    return new Handler(q)
  }

  init(map: GameMap) {
    this.map = map
    map.biomes.forEach((biome) => {
      this.areas[biome.name] = new StaticItems()
    })
  }
}

class Handler {
  constructor(private itemsGroup: StaticItems[]) {}

  get bio() {
    return this.itemsGroup.reduce((aggr, group) => {
      aggr.push(...group.bio)
      return aggr
    }, [])
  }

  get settable() {
    return this.itemsGroup.reduce((aggr, group) => {
      aggr.push(...group.settable)
      return aggr
    }, [])
  }

  get drops() {
    return this.itemsGroup.reduce((aggr, group) => {
      aggr.push(...group.drops)
      return aggr
    }, [])
  }

  addDrop(...drops: BasicDrop[]) {
    this.itemsGroup.forEach((group) => {
      group.addDrop(...drops)
    })
    return this
  }

  removeDrop(id: string) {
    this.itemsGroup.forEach((group) => {
      group.drops = group.drops.filter((drop) => drop.id !== id)
    })
    return this
  }

  addBios(...bios: Bio[]) {
    //
    this.itemsGroup.forEach((group) => {
      group.addBios(...bios)
    })
    return this
  }

  addSettables(...settables: StaticSettableItem[]) {
    this.itemsGroup.forEach((group) => {
      group.addSettables(...settables)
    })
    return this
  }

  playerDied(playerId: number) {
    this.itemsGroup.forEach((group) => {
      group.settable = group.settable.filter(
        (settable) => settable.authorId !== playerId,
      )
    })
  }

  removeSettable(id: string) {
    this.itemsGroup.forEach((group) => {
      group.settable = group.settable.filter((settable) => settable.id !== id)
    })
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
