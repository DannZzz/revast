import { Point, Size } from 'src/global/global'
import { getPointByTheta } from '../animations/rotation'
import { ResourceGetting } from '../basic/item.basic'
import { Player } from './player'
import { PlayerItems } from './player-items'
import { PLAYER_BODY_POINTS } from 'src/constant'
import { circlePolygon, pointPolygon, polygonPolygon } from 'intersects'
import { Bio } from '../basic/bio-item.basic'
import { Converter } from 'src/structures/Converter'
import { GetSet } from 'src/structures/GetSet'
import { pointsOfRotatedRectangle } from 'src/utils/points-of-rotated-rectangle'
import { universalWithin } from 'src/utils/universal-within'
import { optimizeHandleAttackedItems } from 'src/utils/optimize-handle-attacked-items'
import { isNumber } from 'src/utils/is-number-in-range'

export class PlayerClick {
  hand: 'right' | 'left' = 'right'
  status: 'idle' | 'pending' = 'idle'
  count = 0
  requestedToClick = GetSet(false)
  private readonly _toggleOnClicks = 3
  readonly handClickDuration = 0.25

  constructor(private player: Player) {}

  get can() {
    if (this.player.died()) return false
    return !this.player.items.isCrafting
  }

  get toggleClicksEach() {
    const equiped = this.player.items.equiped
    if (equiped && equiped.item.data.toggleClicks)
      return equiped.item.data.toggleClicks
    return this._toggleOnClicks
  }

  socketUpdate() {
    let status: boolean = this.clickStatus
    if (status !== this.player.cache.get('lastSentClickin')) {
      this.player.socket().emit('clicking', [status, this.duration])
      this.player.cache.data.lastSentClickin = status
    }
  }

  get clickStatus(): boolean {
    return this.can && this.requestedToClick()
  }

  get duration() {
    const clickDuration = this.handClickDuration
    return clickDuration
  }

  didClick() {
    const theta = this.player.theta()
    const equiped = this.player.items.equiped
    const { x, y } = this.player.point()
    const attackedPoint = (range: number) =>
      pointsOfRotatedRectangle(
        getPointByTheta(new Point(x, y), theta, range / 2),
        new Size(range, 70),
        this.player.angle(),
      )

    // static items
    const doAction = (
      x: number,
      y: number,
      range: number,
      resGetting: ResourceGetting,
    ) => {
      const point = getPointByTheta(new Point(x, y), theta, range / 2)

      const points = pointsOfRotatedRectangle(
        point,
        new Size(range, 50),
        this.player.angle(),
      )

      const touchedObjects = [
        ...this.player.cache.get('staticBios'),
        ...this.player.cache.get('staticSettables'),
      ].filter((item) =>
        'withinStrict' in item
          ? item.withinStrict(points)
          : item.within(points),
      )
      let resget = 0
      touchedObjects.forEach((item) => {
        item.getAttacked(new Point(x, y), this.player)
        if (Bio.is(item)) {
          let res = item.getResources(this.player, resGetting)
          if (isNumber(res)) {
            resget = res
          }
        }
      })
      if (resget === -1) this.player.serverMessage('The resource is empty!')

      optimizeHandleAttackedItems(touchedObjects, new Point(x, y))
    }

    if (equiped) {
      doAction(
        x,
        y,
        equiped.item.data.range,
        equiped.item.data.resourceGettingPower,
      )

      if (!isNaN(equiped.item.data.digPower)) {
        const point = getPointByTheta(
          new Point(x, y),
          theta,
          equiped.item.data.range / 2,
        )
        const digItemId = this.player.gameServer.map.find(
          this.player.gameServer.map.areaOf(point),
        ).digItemId
        if (!isNaN(digItemId)) {
          this.player.items.addItem(digItemId, equiped.item.data.digPower)
        }
      }
    } else {
      doAction(x, y, this.player.range, { wood: 1 })
    }

    const range = equiped ? equiped.item.data.range : this.player.range
    const damage = equiped ? equiped.item.data.damage : 5
    const attackedArea = attackedPoint(range)
    const alivePlayers = this.player.gameServer.alivePlayers

    // players
    const players = this.player.cache.get('otherPlayers')
    const attackedPlayers = players.filter((player) =>
      universalWithin(attackedArea, PLAYER_BODY_POINTS(player.point)),
    )
    if (attackedPlayers.length > 0) {
      attackedPlayers.forEach((player) => {
        const fullPlayer = alivePlayers.find((p) => p.id() === player.id)
        if (!fullPlayer || fullPlayer.died()) return
        fullPlayer.damage(damage, 'player', this.player)
      })
    }

    // mobs
    const mobs = this.player.cache.get('mobs')
    const attackedMobs = mobs.filter(
      (mob) => !mob.died && mob.within(attackedArea),
    )
    if (attackedMobs.length > 0) {
      attackedMobs.forEach((mob) => {
        mob.hurt(damage, this.player)
        if (mob.died) return
        const aroundPlayers = alivePlayers.filter(
          (player) =>
            player.online() && player.cache.get('mobs', true).includes(mob.id),
        )
        aroundPlayers.forEach((player) =>
          player.socket().emit('mobAttacked', [mob.id]),
        )
      })
    }

    // drops
    const cachedDrops = this.player.cache.get('drops')
    const attackedDrops = cachedDrops.filter((drop) =>
      drop.within(attackedArea),
    )
    if (attackedDrops.length > 0) {
      attackedDrops.forEach((drop) => {
        drop.hurt(damage, this.player)
        const aroundPlayers = alivePlayers.filter(
          (player) =>
            player.online() &&
            player.cache.get('drops', true).includes(drop.id),
        )
        aroundPlayers.forEach((player) =>
          player.socket().emit('dropAttacked', [drop.id]),
        )
      })
    }
  }
}
