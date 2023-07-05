import { ItemProps, Settable } from 'src/game/basic/item.basic'
import { StaticSettableItem } from 'src/game/basic/static-item.basic'
import { Players } from 'src/game/server'
import { GetSet } from 'src/structures/GetSet'
import { StaticItemsHandler } from 'src/structures/StaticItemsHandler'
import { ExtendedSettable } from './actionable.basic'
import { UniversalHitbox } from 'src/utils/universal-within'
import { Player } from 'src/game/player/player'
import Chest from 'anytool/dist/Chest'
import { Transformer } from 'src/structures/Transformer'
import { ActionableHolderEntity } from 'src/entities/actionable-holder.entity'
import { Items } from 'src/data/items'
import { ActionableSettableDrawOptionsEntity } from 'src/entities/actionable-settable-draw-options.entity'
import { ActionableItemHolder } from './actionable-holder'

export class ActionableSettableItem extends StaticSettableItem {
  data: ItemProps<ExtendedSettable>
  allowed: number[] = null
  holders: ActionableItemHolder[] = []
  constructor(
    authorId: number,
    data: ItemProps<ExtendedSettable>,
    players: Players,
    staticItems: StaticItemsHandler,
  ) {
    super(authorId, data, players, staticItems)

    this.on('destroy', (item: ActionableSettableItem) => {
      item.actionablePlayers.forEach((player) => {
        player.socket().emit('removeActionable', [item.id])
      })
      item.data.onDestroy?.(item)
    })

    this.holders = this.data.holders.map(
      (holderProps) => new ActionableItemHolder(holderProps),
    )
    if (this.data.onHolderDataChange) {
      this.holders.forEach((holder) =>
        holder.data.onChange((val) => this.data.onHolderDataChange(holder)),
      )
    }
    if (this.holders.length > 0) {
      this.allowed = this.holders.map((holder) => holder.allow).flat()
    }
    this.data?.onInit?.(this)
  }

  get universalActionableHitbox(): UniversalHitbox {
    return {
      radius: this.data.reactRadius,
      point: this.centerPoint,
    }
  }

  actionablePlayers: Chest<number, Player> = new Chest()

  actionable(player: Player) {
    if (player.within(this.universalActionableHitbox)) {
      if (this.actionablePlayers.has(player.uniqueId)) return
      this.actionablePlayers.set(player.uniqueId, player)
      this.update()
    } else {
      if (this.actionablePlayers.has(player.uniqueId)) {
        this.actionablePlayers.delete(player.uniqueId)
        player.socket().emit('removeActionable', [this.id])
      }
    }
  }

  update() {
    this.actionablePlayers.forEach((player) => {
      if (!player.within(this.universalActionableHitbox)) {
        this.actionablePlayers.delete(player.uniqueId)
        player.socket().emit('removeActionable', [this.id])
      }
    })

    this.actionablePlayers.forEach((player) => {
      player.online() &&
        player.socket().emit('actionableHolder', [
          this.id,
          this.data.type,
          Transformer.toPlain(
            new ActionableSettableDrawOptionsEntity({
              backgroundSource: this.data.draw.backgroundSource,
              size: this.data.draw.size,
              offset: this.data.draw.offset,
            }),
          ),
          this.allowed,
          this.holders.map((holder) =>
            Transformer.toPlain(
              new ActionableHolderEntity({
                iconSource: Items.get(holder.id())?.iconSource,
                quantity: holder.quantity(),
                drawOffset: holder.drawOffset,
                noBackground: holder.noBackground,
                itemId: holder.id(),
                takeable: holder.takeable,
              }),
            ),
          ),
        ])
    })
  }

  hold(id: number, quantity: number, player: Player) {
    if (player.items.isCrafting) return
    let q = quantity
    if (!player.items.has(id)) return
    const item = player.items._items.get(id)

    q = item.quantity < q ? item.quantity : q

    if (q > 10) q = 10
    for (let holder of this.holders) {
      if (holder.allows(id) && (holder.id() === 0 || holder.id() === id)) {
        if (holder.quantity() + q > holder.max) {
          q = holder.max - holder.quantity()
        }
        if (q <= 0) {
          return
        }
        holder.add(id, q)
        player.items.addItem(id, -q)
        this.update()
        break
      }
    }
  }

  take(i: number, player: Player) {
    if (player.items.isCrafting) return
    const holder = this.holders[i]

    if (!holder || !holder.takeable) return

    if (player.items.addable(holder.id())) {
      player.items.addItem(holder.id(), holder.quantity())
      holder.take()
      this.update()
    }
  }

  isPlayerActionable(playerId: number) {
    return this.actionablePlayers.has(playerId)
  }
}
