import { uuid } from 'anytool'
import { getAngle, getPointByTheta } from '../animations/rotation'
import { PlayerItems } from '../player/player-items'
import { ResourceGetting } from './item.basic'
import { Point, Size, combineClasses } from 'src/global/global'
import { Players } from '../server'
import { circleCircle, circlePolygon, polygonPolygon } from 'intersects'
import { Player } from '../player/player'
import { Converter } from 'src/structures/Converter'
import { GetSet } from 'src/structures/GetSet'
import { rectToPolygon } from 'src/utils/polygons'
import { Items } from 'src/data/items'
import { UniversalHitbox, universalWithin } from 'src/utils/universal-within'

export type ResourceTypes =
  | 'wood'
  | 'stone'
  | 'berry'
  | 'gold'
  | 'diamond'
  | 'amethyst'
  | 'ruby'
  | 'emerald'

class ShapeValidPosition {
  isRectPosition(): this is RectPosition {
    return 'from' in this && 'size' in this
  }

  isPolygonPosition(): this is PolygonPosition {
    return 'points' in this && Array.isArray(this.points)
  }

  isCirclePosition(): this is CirclePosition {
    return this instanceof CirclePosition
  }
}

export class CirclePosition extends ShapeValidPosition {
  constructor(readonly radius: number) {
    super()
  }
}

export class RectPosition extends ShapeValidPosition {
  constructor(readonly from: Point, readonly size: Size) {
    super()
  }
}

export class PolygonPosition extends ShapeValidPosition {
  readonly points: Point[]
  constructor(...points: Point[]) {
    super()
    this.points = points
  }
}

type ValidPosition = RectPosition | PolygonPosition | CirclePosition

export interface BioItemProps {
  mapId: number
  type: ResourceTypes
  resources: number
  validPosition: ValidPosition
  givesXp: number
  size: Size
  getWithEverything?: true
  source: string
  id?: string
  rechargeAmount: number
  onResourcesChangeDrawEvent?: boolean
}

export class BasicBioItem {
  constructor(readonly data: BioItemProps) {}

  generate() {
    return new Bio({
      ...this.data,
    })
  }
}

export class Bio {
  readonly id: string = uuid(50)
  point: Point
  private _interval
  players: Players
  resources: GetSet<number>
  points: Point[] = []
  constructor(readonly data: BioItemProps) {
    this.resources = GetSet(data.resources)
    if (data.onResourcesChangeDrawEvent) {
      this.resources.onChange((res) => {
        const playerSockets = this.players
          .filter(
            (player) =>
              player.online() &&
              player.cache.get('staticBios', true).includes(this.id),
          )
          .map((player) => player.socket())

        playerSockets.forEach((socket) =>
          socket.emit('staticItemMiscellaneous', [this.id, res, this.type]),
        )
      })
    }
  }

  preCreate(point: Point) {
    this.point = point

    if (this.data.validPosition.isRectPosition()) {
      const thisTopLeft = combineClasses(
        this.point,
        this.data.validPosition.from,
      )
      this.points = rectToPolygon(thisTopLeft, this.data.validPosition.size)
    } else if (this.data.validPosition.isPolygonPosition()) {
      this.points = this.data.validPosition.points.map(
        (point) => new Point(point.x + this.point.x, point.y + this.point.y),
      )
    }
  }

  get universalHitbox(): UniversalHitbox {
    const pos = this.data.validPosition
    if (pos.isCirclePosition()) {
      return {
        point: this.centerPoint,
        radius: pos.radius,
      }
    } else {
      return this.points
    }
  }

  get type() {
    return this.data.type
  }

  get source() {
    return this.data.source
  }

  get centerPoint() {
    return new Point(
      this.point.x + this.data.size.width / 2,
      this.point.y + this.data.size.height / 2,
    )
  }

  private checkResources() {
    if (this.resources() !== this.data.resources) {
      clearInterval(this._interval)
      this._interval = setInterval(() => {
        const recharging = this.rechargeResources()
        if (!recharging) {
          clearInterval(this._interval)
          this._interval = null
        }
      }, 4000)
    }
  }

  private rechargeResources() {
    if (this.resources() === this.data.resources) return false
    this.resources(this.resources() + this.data.rechargeAmount)
    if (this.resources() > this.data.resources)
      this.resources(this.data.resources)
    return true
  }

  getResources(player: Player, getting: ResourceGetting): number {
    const getThisRes = Items.find(
      (it) => it.isResource() && it.data.resourceType === this.type,
    )
    const gets = this.data.getWithEverything ? 1 : getting[this.type]
    if (!gets) return
    let validAmount: number
    if (this.resources() < gets) {
      validAmount = this.resources()
      this.resources(0)
    } else {
      this.resources(this.resources() - gets)
      validAmount = gets
    }
    if (validAmount === 0) return -1
    this.checkResources()
    player.lbMember.add(this.data.givesXp * validAmount)
    player.items.addItem(getThisRes.id, validAmount)
    return 1
  }

  within(hitbox: UniversalHitbox) {
    return universalWithin(hitbox, this.universalHitbox)
  }

  getAttacked(from: Point) {}

  validPlayersSockets() {
    return this.players.filter(
      (player) =>
        player.online() &&
        player.cache.get('staticBios', true).includes(this.id),
    )
  }

  static is(val: any): val is Bio {
    return val instanceof Bio
  }
}
