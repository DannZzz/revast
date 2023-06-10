import { StaticItemsHandler } from 'src/structures/StaticItemsHandler'
import { ItemProps, Settable } from '../../basic/item.basic'
import {
  BasicStaticItem,
  StaticSettableItem,
} from '../../basic/static-item.basic'
import { Players } from '../../server'
import { ExtendedSettable } from './actionable.basic'
import { SeedSettableItem } from './seed.settable'
import { StaticItems } from 'src/structures/StaticItems'
import { SpecialItemTypes } from 'src/data/config-type'

export type ExtendedSeed<T = Settable> = {
  maxResource: number
  growthTime: number
  dehydrateTime: number
  resourceInterval: number
  resourceId: number
  configureMode: {
    grown: number
    dehydrated: number
    dehydratedEmpty: number
  }
} & T

const customSettingeFilterSeed: Settable['customSettingFilter'] = (
  staticItems,
  settable: SeedSettableItem,
  map,
): boolean => {
  if (
    staticItems.someWithin(settable.universalHitbox, {
      strict: true,
      ignoreTypes: [SpecialItemTypes.plot],
    })
  )
    return false
  // let isTherePlot = staticItems.itemWithin(settable.centerPoint, {
  //   strict: true,
  //   onlyTypes: [SpecialItemTypes.plot],
  // })
  if (
    !settable.inPlot() &&
    !['beach', 'forest'].includes(map.areaOf(settable.centerPoint)[0])
  )
    return false

  return true
}

export class BasicSeed extends BasicStaticItem {
  constructor(readonly data: ItemProps<ExtendedSettable>) {
    data.customSettingFilter = customSettingeFilterSeed
    super(data)
  }

  toSettable(
    authorId: number,
    players: Players,
    staticItems: StaticItemsHandler,
  ): StaticSettableItem {
    const item = new SeedSettableItem(authorId, this.data, players, staticItems)
    return item
  }
}
