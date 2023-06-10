import { ItemProps } from 'src/game/basic/item.basic'
import { StaticSettableItem } from 'src/game/basic/static-item.basic'
import { Players } from 'src/game/server'
import { StaticItemsHandler } from 'src/structures/StaticItemsHandler'
import { ExtendedSettable } from './actionable.basic'
import { ExtendedSeed } from './seed.basic'
import { GetSet } from 'src/structures/GetSet'
import { Player } from 'src/game/player/player'
import { Point } from 'src/global/global'
import { SpecialItemTypes } from 'src/data/config-type'
import { Timeout } from 'src/structures/timers/timeout'
import { Interval } from 'src/structures/timers/interval'
import { Timer } from 'src/structures/timers/timer'

export class SeedSettableItem extends StaticSettableItem {
  data: ItemProps<ExtendedSeed>
  timeouts: Record<'growthTime' | 'dehydrateTime' | 'resourceInterval', Timer>
  readonly resource = GetSet(0)
  readonly inPlot = GetSet(false)
  readonly isGrown = GetSet(false)
  readonly growthTime = GetSet(0)
  readonly resourceInterval = GetSet(0)
  readonly dehydrated = GetSet(false)
  constructor(
    authorId: number,
    data: ItemProps<ExtendedSettable>,
    players: Players,
    staticItems: StaticItemsHandler,
  ) {
    super(authorId, data, players, staticItems)
  }

  preDraw(point: Point, theta: number, rotation: number): void {
    super.preDraw(point, theta, rotation)
    this.growthTime(this.data.growthTime)
    this.resourceInterval(this.data.resourceInterval)
    const inPlot = this.staticItems
      .for(this.centerPoint)
      .itemWithin(this.centerPoint, {
        strict: true,
        onlyTypes: [SpecialItemTypes.plot],
      })

    if (inPlot) {
      super.preDraw(inPlot.point.clone(), 0, 0)
      this.inPlot(true)
      this.growthTime(this.growthTime() / 2)
      this.resourceInterval(this.resourceInterval() / 2)
    }

    this.resource.onChange((val) => {
      if (val > this.data.maxResource) return this.data.maxResource
      if (!this.dehydrated()) this.try()
      const playerSockets = this.players
        .filter(
          (player) =>
            player.online() &&
            player.cache.get('staticSettables', true).includes(this.id),
        )
        .map((player) => player.socket())

      playerSockets.forEach((socket) =>
        socket.emit('staticItemMiscellaneous', [this.id, val, this.data.type]),
      )

      if (val === 0) {
        this.currentModeIndex(
          this.dehydrated()
            ? this.data.configureMode.dehydratedEmpty
            : this.data.configureMode.grown,
        )
      }
    })

    this.on('destroy', (item) => {
      item.timeouts.growthTime.stop()
      item.timeouts.resourceInterval.stop()
      item.timeouts.dehydrateTime.stop()
    })

    this.timeouts.growthTime = new Timeout(
      this.grown.bind(this),
      this.growthTime() * 1000,
    ).run()

    this.timeouts.dehydrateTime = new Timeout(() => {
      this.currentModeIndex(
        this.resource() === 0
          ? this.data.configureMode.dehydratedEmpty
          : this.data.configureMode.dehydrated,
      )
      this.dehydrated(true)
      this.timeouts.resourceInterval.stop()
    }, this.data.dehydrateTime * 1000)

    this.timeouts.resourceInterval = new Interval(() => {
      if (this.resource() + 1 === this.data.maxResource) {
        this.timeouts.resourceInterval.stop()
      }
      this.resource(this.resource() + 1)
    }, this.resourceInterval() * 1000)
  }

  grown() {
    this.isGrown(true)
    this.try()
    this.dehydrate()
  }

  dehydrate() {
    this.timeouts.dehydrateTime.run()
  }

  hydrate() {
    if (!this.isGrown()) return
    this.timeouts.dehydrateTime.stop()
    this.dehydrate()
    if (this.dehydrated()) {
      this.dehydrated(false)
      this.try()
    }
  }

  try() {
    if (this.timeouts.resourceInterval.isRunning()) {
      return
    }

    this.currentModeIndex(this.data.configureMode.grown)
    if (this.resource() >= this.data.maxResource) {
      return
    }
    this.timeouts.resourceInterval.run()
  }

  getAttacked(from: Point, by: Player): void {
    // hydrating
    if (
      by.items.equiped?.item.data.specialName === SpecialItemTypes.watering_can
    ) {
      this.hydrate()
    } else {
      if (this.resource() > 0) {
        if (by.items.addable(this.data.resourceId)) {
          by.items.addItem(this.data.resourceId, 1)
          this.resource(this.resource() - 1)
        }
      }
    }
    super.getAttacked(from, by)
  }
}
