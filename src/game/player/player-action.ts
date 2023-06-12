import { Point, combineClasses } from 'src/global/global'
import type { Player } from './player'
import { PlayerClick } from './player-click'
import { PlayerStates } from './player-state'
import { getPointByTheta } from '../animations/rotation'
import { ActionableSettableItem } from '../extended/settable/actionable.settable'
import { EventData } from 'src/ws/events/events'
import { GetSet } from 'src/structures/GetSet'
import { WalkEffect } from '../types/player.types'
import { Converter } from 'src/structures/Converter'
import { WALK_EFFECT_SEND_INTERVAL } from 'src/constant'

export class PlayerAction {
  clicks = 0
  readonly click: PlayerClick
  readonly state: PlayerStates
  readonly walking = GetSet(false)
  walkEffectCd = 0
  constructor(private player: Player) {
    this.click = new PlayerClick(player)
    this.state = new PlayerStates(player)
  }

  clicking() {
    this.click.requestedToClick(this.player.toggle.is('clicking'))
    // ...
    if (
      this.click.requestedToClick() &&
      this.click.can &&
      this.click.status === 'idle'
    ) {
      this.click.status = 'pending'
      let give = false
      const timeout = setTimeout(() => {
        clearTimeout(timeout)
        let give = false
        this.click.didClick()
      }, this.click.duration * 1000)

      const int = setInterval(() => {
        if (!give) {
          give = true
        } else {
          this.click.didClick()
        }
        if (!this.click.can || !this.click.requestedToClick()) {
          clearInterval(int)
          const timeout = setTimeout(() => {
            this.click.status = 'idle'
            clearTimeout(timeout)
          }, this.click.duration * 1000)
          return
        }
      }, this.click.duration * 2000)
    }

    this.click.socketUpdate()
  }

  doPositionChanges() {
    let angle: number
    if (this.player.toggle.is('right')) angle = 0
    else if (this.player.toggle.is('left')) angle = 180

    if (this.player.toggle.is('down'))
      angle = !isNaN(angle) ? (angle === 0 ? 45 : 135) : 90
    else if (this.player.toggle.is('up'))
      angle = !isNaN(angle) ? (angle === 0 ? -45 : -135) : -90

    if (angle === undefined) {
      this.walking(false)
      return
    }
    this.walking(true)

    const point = getPointByTheta(
      new Point(),
      (angle / 180) * Math.PI,
      this.player.speed.current(),
    )
    // math err
    if (angle === 90 || angle === -90) {
      point.x = 0
    }

    const tryTo = (mainPoint: Point, combine: Point) => {
      const pos = this.player.bodyPositions(combine)
      const itemWithin = this.player.staticItems
        .for(pos.points)
        .itemWithin(pos.points)
      if (itemWithin) {
        if (combine.x) {
          const absX = Math.abs(combine.x) / 4

          if (itemWithin.centerPoint.y > this.player.point().y) {
            const posAfterPhysics = this.player.bodyPositions(
              new Point(0, -absX),
            )
            if (
              !this.player.staticItems
                .for(posAfterPhysics.points)
                .someWithin(posAfterPhysics.points)
            ) {
              mainPoint.y -= absX
            }
          } else if (itemWithin.centerPoint.y < this.player.point().y) {
            const posAfterPhysics = this.player.bodyPositions(
              new Point(0, absX),
            )
            if (
              !this.player.staticItems
                .for(posAfterPhysics.points)
                .someWithin(posAfterPhysics.points)
            ) {
              mainPoint.y += absX
            }
          }
        } else if (combine.y) {
          const absY = Math.abs(combine.y) / 4
          Math.abs(combine.y)
          if (itemWithin.centerPoint.x > this.player.point().x) {
            const posAfterPhysics = this.player.bodyPositions(
              new Point(-absY, 0),
            )
            if (
              !this.player.staticItems
                .for(posAfterPhysics.points)
                .someWithin(posAfterPhysics.points)
            ) {
              mainPoint.x -= absY
            }
          } else if (itemWithin.centerPoint.x < this.player.point().x) {
            const posAfterPhysics = this.player.bodyPositions(
              new Point(absY, 0),
            )
            if (
              !this.player.staticItems
                .for(posAfterPhysics.points)
                .someWithin(posAfterPhysics.points)
            ) {
              mainPoint.x += absY
            }
          }
        }
      } else {
        mainPoint.x += combine.x
        mainPoint.y += combine.y
      }
    }

    const l = new Point()
    tryTo(l, point)

    this.player.moveFromHere(l)
  }

  actionablesUpdate() {
    this.player.cache.get('staticSettables').forEach((settable) => {
      if (settable instanceof ActionableSettableItem) settable.update()
    })
  }

  actionableTake(data: EventData<'requestActionableHolderTake'>) {
    const [settableId, i] = data
    const settable = this.player.cache
      .get('staticSettables')
      .find((settable) => settable.id === settableId)
    if (settable instanceof ActionableSettableItem) {
      settable.take(i, this.player)
    }
  }
  actionableHold(data: EventData<'requestActionableHolder'>) {
    const [settableId, itemId, x10] = data
    const settable = this.player.cache
      .get('staticSettables')
      .find((settable) => settable.id === settableId)
    if (settable instanceof ActionableSettableItem) {
      settable.hold(itemId, x10 ? 10 : 1, this.player)
    }
  }

  walkEffect() {
    if (this.walkEffectCd > Date.now()) return
    const states = this.state.actualStates
    const players = this.player.gameServer.alivePlayers.filter(
      (player) =>
        player.online() &&
        (player.id() === this.player.id() ||
          player.cache.get('otherPlayers', true).includes(this.player.id())),
    )
    // water effect
    if (!states.onBridge() && states.water()) {
      this.walkEffectCd =
        Date.now() + 1000 * WALK_EFFECT_SEND_INTERVAL * (this.walking() ? 1 : 2)

      players.forEach((player) =>
        player
          .socket()
          .emit('walkEffect', [
            WalkEffect.water,
            ...Converter.pointToXYArray(this.player.point()),
            this.player.angle(),
          ]),
      )

      return
    }
  }
}
