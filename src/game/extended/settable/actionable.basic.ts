import { ItemProps, Settable } from 'src/game/basic/item.basic'
import {
  BasicStaticItem,
  StaticSettableItem,
} from 'src/game/basic/static-item.basic'
import { Players } from 'src/game/server'
import { StaticItemsHandler } from 'src/structures/StaticItemsHandler'
import { ActionableSettableItem } from './actionable.settable'
import {
  ActionableHolderProps,
  ActionableItemHolder,
} from './actionable-holder'
import { ImageSource, Images } from 'src/structures/image-base'
import { Point, Size } from 'src/global/global'

export type ActionableInitializator = (settable: ActionableSettableItem) => void

export interface ActionableSettableDrawOptions {
  backgroundSource: string
  size: Size
  offset?: Point
}

export type ExtendedSettable<T = Settable> = {
  reactRadius: number
  holders: ActionableHolderProps[]
  onInit: ActionableInitializator
  draw: ActionableSettableDrawOptions
  onHolderDataChange: (holder: ActionableItemHolder) => void
} & T

export class BasicActionableStatic extends BasicStaticItem {
  data: ItemProps<ExtendedSettable>
  constructor(props: ItemProps<ExtendedSettable>) {
    super(props)
  }

  toSettable(
    authorId: number,
    players: Players,
    staticItems: StaticItemsHandler,
  ): StaticSettableItem {
    const item = new ActionableSettableItem(
      authorId,
      this.data,
      players,
      staticItems,
    )
    return item
  }
}
