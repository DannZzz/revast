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

export class StaticSettableItem {
  point: Point = new Point(0, 0)
  rotation: number = 0
  tempHp: GetSet<number>
  theta: number = Math.PI
  readonly id: string = uuid(50)
  points: Point[] = []

  mode: {
    enabled: GetSet<boolean>
    cover: boolean
  } = {
    enabled: GetSet(false),
    cover: true,
  }
  destroyed = false

  constructor(
    readonly authorId: number,
    readonly data: ItemProps<Settable>,
    private players: Players,
    private staticItems: StaticItemsHandler,
  ) {
    this.tempHp = GetSet(data.hp)

    if (this.data.durationSeconds)
      timer(this.data.durationSeconds * 1000).subscribe(() => {
        if (!this.destroyed)
          this.staticItems.for(this.universalHitbox).removeSettable(this.id)
      })

    this.mode.enabled.onChange((val) => {
      this.mode.cover = Boolean(val ? this.data.mode?.cover : this.data.cover)
    })
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
    if (this.mode.enabled() ? this.data.mode?.cover : this.data.cover)
      return this.withinStrict(hitbox)
    return false
  }

  hurt(damage: number) {
    if (!this.data.showHpRadius && damage < 0) return
    this.tempHp(this.tempHp() - damage)
    if (this.tempHp() > this.data.hp) this.tempHp(this.data.hp)
    if (this.tempHp() <= 0) {
      this.destroyed = true
      this.staticItems.for(this.universalHitbox).removeSettable(this.id)
    }
  }

  getAttacked(from: Point, by: Player) {
    const equiped = by.items.equiped
    if (equiped && equiped.item.data.damageBuilding) {
      this.hurt(equiped.item.data.damageBuilding)
    } else {
    }
    if (this.destroyed) return
    const alivePlayers = this.players
    if (this.data.mode && equiped?.item?.data.specialName !== 'repair') {
      if (
        this.data.mode.verify.call(this, by) &&
        (this.mode.enabled()
          ? !alivePlayers.some((player) => this.withinStrict(player.points))
          : true)
      )
        this.mode.enabled(!this.mode.enabled())
    }

    const playerSockets = alivePlayers
      .filter(
        (player) =>
          player.online() &&
          player.cache.get('staticSettables', true).includes(this.id),
      )
      .map((player) => player.socket())

    playerSockets.forEach((socket) =>
      socket.emit('staticItemAttacked', [
        this.id,
        getAngle(this.point, from) + Math.PI,
        {
          enabled: this.mode.enabled(),
          cover: this.mode.cover,
        },
        this.data.showHpRadius &&
          percentOf(percentFrom(this.tempHp(), this.data.hp), 360),
      ]),
    )
  }
}
