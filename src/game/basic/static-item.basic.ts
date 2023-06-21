import { Item, ItemProps, Settable, SpecialSettable } from './item.basic'
import { uuid } from 'anytool'

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
    if (this.currentMode.damageOnTouch) this.timeouts.touch = {}
    this.tempHp = GetSet(data.hp)
    if (this.data.onDestroy) this.on('destroy', this.data.onDestroy)
    if (this.data.durationSeconds)
      timer(this.data.durationSeconds * 1000).subscribe(() => {
        this.destroy()
      })

    this.currentModeIndex.onChange((val) => {
      this.validPlayersSockets().forEach((player) => {
        player.socket().emit('staticItemMode', [this.id, val])
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

  getAttacked(from: Point, by: Player): void {
    if (this.currentMode.damageOnAttack) {
      if (
        this.currentMode.damageOnAttack.all ||
        !by.clanMember
          .team()
          .map((member) => member.playerId)
          .includes(this.authorId)
      ) {
        by.damage(this.currentMode.damageOnAttack.damage, 'settable')
      }
    }

    const equiped = by.items.equiped
    if (equiped && equiped.item.data.damageBuilding) {
      this.hurt(equiped.item.data.damageBuilding)
    }
    if (this.destroyed) return
    const alivePlayers = this.players
    if (equiped?.item?.data.specialName !== SpecialItemTypes.repair) {
      if (
        this.currentMode.trigger === 'attack' &&
        this.currentMode.verify.call(this, by) &&
        !alivePlayers.some((player) => this.withinStrict(player.collision))
      ) {
        this.currentModeIndex(this.currentMode.switchTo || 0)
      }
    }
  }

  getTouched(player: Player) {
    if (!this.currentMode.damageOnTouch) return
    if (
      !this.currentMode.damageOnAttack.all &&
      player.clanMember
        .team()
        .map((member) => member.playerId)
        .includes(this.authorId)
    )
      return
    const id = (p: Player) => `${p.uniqueId}-${p.id()}`
    if (id(player) in this.timeouts.touch && this.timeouts.touch[id(player)])
      return
    this.timeouts.touch[id(player)] = 1
    timer(this.currentMode.damageOnTouch.interval * 1000).subscribe(() => {
      delete this.timeouts.touch[id(player)]
      if (!this.currentMode.damageOnTouch) return
      if (
        universalWithin(player.collision, {
          radius: this.currentMode.damageOnTouch.radius,
          point: this.point.clone(),
        })
      )
        player.damage(this.currentMode.damageOnTouch.damage, 'settable')
    })
  }

  validPlayersSockets() {
    return this.players.filter(
      (player) =>
        player.online() &&
        player.cache.get('staticSettables', true).includes(this.id),
    )
  }
}
