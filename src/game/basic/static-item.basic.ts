import { Item, ItemProps, Settable, SpecialSettable } from './item.basic'
import { uuid } from 'anytool'
import {
  circleCircle,
  circlePolygon,
  polygonCircle,
  polygonPolygon,
} from 'intersects'
import { Point, Size, combineClasses } from 'src/global/global'
import { GameServer, Players } from '../server'
import { getPointByTheta, getAngle } from '../animations/rotation'
import { timer } from 'rxjs'
import { Converter } from 'src/structures/Converter'
import { pointsOfRotatedRectangle } from 'src/utils/points-of-rotated-rectangle'
import { GetSet } from 'src/structures/GetSet'
import { Player } from '../player/player'
import { percentFrom, percentOf } from 'src/utils/percentage'
import { StaticItems } from 'src/structures/StaticItems'
import { UniversalHitbox, universalWithin } from 'src/utils/universal-within'
import { StaticItemsHandler } from 'src/structures/StaticItemsHandler'
import { SpecialItemTypes } from 'src/data/config-type'
import { EventEmitter } from 'src/utils/EventEmitter'

export class BasicStaticItem extends Item<Settable> {
  constructor(props: ItemProps<Settable>) {
    const { ...otherProps } = props
    super(otherProps)
  }
  toSettable(
    authorId: number,
    players: Players,
    staticItems: StaticItemsHandler,
  ) {
    return new StaticSettableItem(authorId, this.data, players, staticItems)
  }
}

type SettableEvents = {
  destroy: [item: StaticSettableItem]
}

export class StaticSettableItem extends EventEmitter<SettableEvents> {
  point: Point = new Point(0, 0)
  rotation: number = 0
  tempHp: GetSet<number>
  theta: number = Math.PI
  readonly id: string = uuid(50)
  points: Point[] = []
  timeouts: Record<any, any> = {}

  readonly currentModeIndex = GetSet(0)
  destroyed = false

  constructor(
    readonly authorId: number,
    readonly data: ItemProps<Settable>,
    readonly players: Players,
    readonly staticItems: StaticItemsHandler,
  ) {
    super()
    this.tempHp = GetSet(data.hp)
    if (this.data.onDestroy) this.on('destroy', this.data.onDestroy)
    if (this.data.durationSeconds)
      timer(this.data.durationSeconds * 1000).subscribe(() => {
        this.destroy()
      })

    this.currentModeIndex.onChange((val) => {
      this.validPlayersSockets().forEach((socket) => {
        socket.emit('staticItemMode', [this.id, val])
      })
    })
  }

  get currentMode() {
    return this.data.modes[this.currentModeIndex()]
  }

  preDraw(point: Point, theta: number, rotation: number) {
    this.point = point
    this.theta = theta
    this.rotation = rotation
    const size = this.data.setMode.itemSize
    if (size.type === 'rect') {
      const points = pointsOfRotatedRectangle(
        new Point(this.data.size.width / 2, this.data.size.height / 2),
        new Size(size.width, size.height),
        this.theta - Math.PI / 2,
      )
      this.points = points.map((point) =>
        combineClasses(
          point,
          new Point(
            this.point.x - this.data.size.width / 2,
            this.point.y - this.data.size.height / 2,
          ),
        ),
      )
    }
  }

  get centerPoint() {
    return new Point(this.point.x, this.point.y)
  }

  get universalHitbox(): UniversalHitbox {
    if (this.data.setMode.itemSize.type == 'circle') {
      return {
        point: this.centerPoint,
        radius: this.data.setMode.itemSize.radius,
      }
    } else {
      return this.points
    }
  }

  isSpecial(key: keyof SpecialSettable) {
    return key in (this.data.special || {})
  }

  withinStrict(hitbox: UniversalHitbox) {
    return universalWithin(hitbox, this.universalHitbox)
  }

  within(hitbox: UniversalHitbox) {
    if (this.currentMode.cover > 0) return this.withinStrict(hitbox)
    return false
  }

  hurt(damage: number) {
    if (!this.data.showHpRadius && damage < 0) return
    this.tempHp(this.tempHp() - damage)
    if (this.tempHp() > this.data.hp) this.tempHp(this.data.hp)
    if (this.tempHp() <= 0) {
      this.destroy()
    }
  }

  destroy() {
    if (this.destroyed) {
      return
    }
    this.emit('destroy', this)
    this.destroyed = true
    this.staticItems.for(this.universalHitbox).removeSettable(this.id)
  }

  getAttacked(from: Point, by: Player) {
    const equiped = by.items.equiped
    if (equiped && equiped.item.data.damageBuilding) {
      this.hurt(equiped.item.data.damageBuilding)
    } else {
    }
    if (this.destroyed) return
    const alivePlayers = this.players
    if (equiped?.item?.data.specialName !== SpecialItemTypes.repair) {
      if (
        this.currentMode.trigger === 'attack' &&
        this.currentMode.verify.call(this, by) &&
        !alivePlayers.some((player) => this.withinStrict(player.points))
      ) {
        this.currentModeIndex(this.currentMode.switchTo || 0)
      }
    }

    const playerSockets = this.validPlayersSockets()

    playerSockets.forEach((socket) =>
      socket.emit('staticItemAttacked', [
        this.id,
        getAngle(this.point, from) + Math.PI,
        this.data.showHpRadius &&
          percentOf(percentFrom(this.tempHp(), this.data.hp), 360),
      ]),
    )
  }

  validPlayersSockets() {
    return this.players
      .filter(
        (player) =>
          player.online() &&
          player.cache.get('staticSettables', true).includes(this.id),
      )
      .map((player) => player.socket())
  }
}
