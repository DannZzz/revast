import { UniversalHitbox, universalWithin } from 'src/utils/universal-within'
import { AreaStaticItems, GameMap, MapAreaName } from './GameMap'
import { CheckingOptions, StaticItems, filterStaticItems } from './StaticItems'
import { Bio } from 'src/game/basic/bio-item.basic'
import { BasicDrop } from 'src/game/basic/drop.basic'
import { StaticSettableItem } from 'src/game/basic/static-item.basic'
import { SettableCheckers } from 'src/game/basic/item.basic'
import { Point, Size } from 'src/global/global'
import { MAP_GRID_RENDER_AREA_SIZE } from 'src/constant'
import { Misc } from 'src/game/basic/misc.basic'

export interface Area {
  position: Point
  items: StaticItems
}

export class StaticItemsHandler {
  areas: Area[] = []
  map: GameMap

  for(hitbox: UniversalHitbox | 'all') {
    let areas =
      hitbox === 'all'
        ? this.areas
        : this.areas.filter((area) =>
            universalWithin(hitbox, {
              point: area.position,
              size: new Size(
                MAP_GRID_RENDER_AREA_SIZE,
                MAP_GRID_RENDER_AREA_SIZE,
              ),
            }),
          )

    const q = areas.map((area) => area.items)

    return new Handler(q)
  }

  init(map: GameMap) {
    this.map = map
    const size = map.absoluteSize

    for (let x = 0; x < size.width; x += MAP_GRID_RENDER_AREA_SIZE) {
      for (let y = 0; y < size.height; y += MAP_GRID_RENDER_AREA_SIZE) {
        this.areas.push({
          position: new Point(x, y),
          items: new StaticItems(),
        })
      }
    }
  }
}

class Handler {
  constructor(private itemsGroup: StaticItems[]) {}

  get bio(): Bio[] {
    return this.itemsGroup.reduce((aggr, group) => {
      aggr.push(
        ...group.bio.filter((item) => !aggr.find((it) => it.id === item.id)),
      )
      return aggr
    }, [])
  }

  get miscs(): Misc[] {
    return this.itemsGroup.reduce((aggr, group) => {
      aggr.push(
        ...group.miscs.filter((item) => !aggr.find((it) => it.id === item.id)),
      )
      return aggr
    }, [])
  }

  get settable(): StaticSettableItem[] {
    return this.itemsGroup.reduce((aggr, group) => {
      aggr.push(
        ...group.settable.filter(
          (item) => !aggr.find((it) => it.id === item.id),
        ),
      )
      return aggr
    }, [])
  }

  get drops(): BasicDrop<any>[] {
    return this.itemsGroup.reduce((aggr, group) => {
      aggr.push(
        ...group.drops.filter((item) => !aggr.find((it) => it.id === item.id)),
      )
      return aggr
    }, [])
  }

  addDrop(...drops: BasicDrop[]) {
    this.itemsGroup.forEach((group) => {
      group.addDrop(...drops)
    })
    return this
  }

  addMisc(...miscs: Misc[]) {
    this.itemsGroup.forEach((group) => {
      group.addMisc(...miscs)
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
