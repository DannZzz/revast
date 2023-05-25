import { Item, ItemProps, Settable, SpecialSettable } from './item.basic'
import { uuid } from 'anytool'
import {
  circleCircle,
  circlePolygon,
  polygonCircle,
  polygonPolygon,
} from 'intersects'
import { Point, Size, combineClasses } from 'src/global/global'
import { GameServer } from '../server'
import { getPointByTheta, getAngle } from '../animations/rotation'
import { timer } from 'rxjs'
import { Converter } from 'src/structures/Converter'
import { pointsOfRotatedRectangle } from 'src/utils/points-of-rotated-rectangle'
import { GetSet } from 'src/structures/GetSet'
import { Player } from '../player/player'
import { percentFrom, percentOf } from 'src/utils/percentage'

export class BasicStaticItem extends Item<Settable> {
  constructor(props: ItemProps<Settable>) {
    const { ...otherProps } = props
    super(otherProps)
  }
  toSettable(authorId: number, gameServer: () => GameServer) {
    return new StaticSettableItem(authorId, this.data, gameServer)
  }
}

export class StaticSettableItem {
  point: Point = new Point(0, 0)
  rotation: number = 0
  tempHp: GetSet<number>
  theta: number = Math.PI
  readonly id: string = uuid(50)
  points: Point[] = []
  readonly authorId: number
  readonly data: ItemProps<Settable>
  private gameServer: () => GameServer
  modeEnabled = GetSet(false)
  destroyed = false

  constructor(
    authorId: number,
    data: ItemProps<Settable>,
    gameServer: () => GameServer,
  ) {
    this.authorId = authorId
    this.data = data
    this.gameServer = gameServer
    this.tempHp = GetSet(data.hp)

    if (this.data.durationSeconds)
      timer(this.data.durationSeconds * 1000).subscribe(() => {
        if (!this.destroyed)
          this.gameServer().staticItems.removeSettable(this.id)
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

  isSpecial(key: keyof SpecialSettable) {
    return key in (this.data.special || {})
  }

  withinStrict(points: Point[]): boolean
  withinStrict(point: Point, radius: number): boolean
  withinStrict(arg1: Point | Point[], radius?: number) {
    if (this.data.setMode.itemSize.type === 'circle') {
      if (Array.isArray(arg1)) {
        return polygonCircle(
          Converter.pointArrayToXYArray(arg1),
          ...Converter.pointToXYArray(this.centerPoint),
          this.data.setMode.itemSize.radius,
        )
      } else {
        return circleCircle(
          ...Converter.pointToXYArray(arg1),
          radius,
          ...Converter.pointToXYArray(this.centerPoint),
          this.data.setMode.itemSize.radius,
        )
      }
    } else {
      if (Array.isArray(arg1)) {
        return polygonPolygon(
          Converter.pointArrayToXYArray(arg1),
          Converter.pointArrayToXYArray(this.points),
        )
      } else {
        return circlePolygon(
          ...Converter.pointToXYArray(arg1),
          radius,
          Converter.pointArrayToXYArray(this.points),
        )
      }
    }
  }

  within(points: Point[]): boolean
  within(point: Point, radius: number): boolean
  within(arg1: Point | Point[], radius?: number) {
    if (this.modeEnabled() ? this.data.mode?.cover : this.data.cover)
      return this.withinStrict(arg1 as any, radius)
    return false
  }

  hurt(damage: number) {
    if (!this.data.showHpRadius && damage < 0) return
    this.tempHp(this.tempHp() - damage)
    if (this.tempHp() > this.data.hp) this.tempHp(this.data.hp)
    if (this.tempHp() <= 0) {
      this.destroyed = true
      this.gameServer().staticItems.removeSettable(this.id)
    }
  }

  getAttacked(from: Point, by: Player) {
    const equiped = by.items.equiped
    if (equiped && equiped.item.data.damageBuilding) {
      this.hurt(equiped.item.data.damageBuilding)
    } else {
    }
    if (this.destroyed) return
    const alivePlayers = this.gameServer().alivePlayers
    if (this.data.mode && equiped?.item?.data.specialName !== 'repair') {
      if (
        this.data.mode.verify.call(this, by) &&
        (this.modeEnabled()
          ? !alivePlayers.some((player) => this.withinStrict(player.points))
          : true)
      )
        this.modeEnabled(!this.modeEnabled())
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
          enabled: this.modeEnabled(),
          cover: this.modeEnabled() ? this.data.mode?.cover : this.data.cover,
        },
        this.data.showHpRadius &&
          percentOf(percentFrom(this.tempHp(), this.data.hp), 360),
      ]),
    )
  }
}
