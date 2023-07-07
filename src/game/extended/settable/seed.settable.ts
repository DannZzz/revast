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
import { FARM_ITEM_BUFF } from 'src/constant'
import { Tick } from 'src/structures/Tick'

export class SeedSettableItem extends StaticSettableItem {
  data: ItemProps<ExtendedSeed>
  timeouts: Record<'growthTime' | 'dehydrateTime' | 'resourceInterval', Tick>
  readonly resource = GetSet(0)
  readonly inPlot = GetSet(false)
  readonly isGrown = GetSet(false)
  readonly growthTime = GetSet(0)
  readonly resourceInterval = GetSet(0)
  readonly dehydrated = GetSet(false)
  readonly dehydrateInterval = GetSet(0)
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
    this.dehydrateInterval(this.data.dehydrateTime)
    const inPlot = this.staticItems
      .for(this.centerPoint)
      .itemWithin(this.centerPoint, {
        strict: true,
        onlyTypes: [SpecialItemTypes.plot],
      })

    if (inPlot) {
      super.preDraw(inPlot.point.clone(), 0, 0)
      this.inPlot(true)
      this.dehydrateInterval(this.dehydrateInterval() * 2)
    }

    if (
      this.players.get(this.authorId).items?.weared?.item.data.specialName ===
      SpecialItemTypes.peasant
    ) {
      this.growthTime(this.growthTime() / FARM_ITEM_BUFF)
      this.resourceInterval(this.resourceInterval() / FARM_ITEM_BUFF)
    }

    this.resource.onChange((val, old) => {
      if (val > this.data.maxResource) return this.data.maxResource
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
            : this.data.configureMode.empty,
        )
      } else if (old === 0) {
        this.currentModeIndex(
          this.dehydrated()
            ? this.data.configureMode.dehydrated
            : this.data.configureMode.grown,
        )
      }
    })

    this.timeouts.growthTime = new Tick(this.growthTime())

    this.timeouts.dehydrateTime = new Tick(this.dehydrateInterval(), {
      reversed: true,
    })

    this.timeouts.resourceInterval = new Tick(this.resourceInterval())
  }

  everySecond() {
    if (this.timeouts.growthTime.limited()) return
    if (!this.isGrown()) {
      this.isGrown(true)
      this.currentModeIndex(this.data.configureMode.grown)
      this.timeouts.dehydrateTime.take()
      this.timeouts.resourceInterval.take()
    }

    if (this.timeouts.dehydrateTime.limited()) {
      if (!this.dehydrated()) {
        this.dehydrated(true)
        this.currentModeIndex(
          this.resource() === 0
            ? this.data.configureMode.dehydratedEmpty
            : this.data.configureMode.dehydrated,
        )
      }
      return
    }

    if (this.isFull()) {
      this.timeouts.resourceInterval.take()
      return
    }

    // if (this.resource() + 1 === this.data.maxResource) {
    //   this.timeouts.resourceInterval.stop()
    // }
    if (this.timeouts.resourceInterval.limited()) return
    this.resource(this.resource() + 1)
    this.timeouts.resourceInterval.take()
  }

  isFull() {
    return this.resource() >= this.data.maxResource
  }

  // grown() {
  //   this.isGrown(true)
  //   this.try()
  //   this.dehydrate()
  // }

  // dehydrate() {
  //   this.timeouts.dehydrateTime.take()
  // }

  hydrate() {
    if (!this.isGrown()) return
    this.timeouts.dehydrateTime.take()
    if (this.dehydrated()) {
      this.dehydrated(false)
      this.currentModeIndex(
        this.resource() === 0
          ? this.data.configureMode.empty
          : this.data.configureMode.grown,
      )
      this.timeouts.resourceInterval.take()
    }
  }

  // try() {
  //   if (this.timeouts.resourceInterval.limited()) {
  //     return
  //   }

  //   this.currentModeIndex(this.data.configureMode.grown)
  //   if (this.resource() >= this.data.maxResource) {
  //     return
  //   }
  //   this.timeouts.resourceInterval.run()
  // }

  getAttacked(from: Point, by: Player): void {
    // hydrating
    if (
      by.items.equiped?.item.data.specialName === SpecialItemTypes.watering_can
    ) {
      this.hydrate()
    } else {
      if (this.resource() > 0) {
        if (by.items.addable(this.data.resourceId)) {
          if (this.isFull()) this.timeouts.resourceInterval.take()
          by.items.addItem(
            this.data.resourceId,
            by.items.equiped?.item.data.specialName ===
              SpecialItemTypes.pitchfork
              ? 2
              : 1,
          )
          this.resource(this.resource() - 1)
        }
      }
    }
    super.getAttacked(from, by)
  }
}
