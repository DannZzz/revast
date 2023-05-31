import { uuid } from 'anytool'
import { boxPoint, circlePoint, polygonCircle, polygonPoint } from 'intersects'
import { Point, Size } from 'src/global/global'
import { getPointByTheta, getDistance, getAngle } from '../animations/rotation'
import {
  BasicMob,
  BasicMobProps,
  MobMoveStatus,
  MoveTactic,
} from '../basic/mob.basic'
import { Player } from '../player/player'
import { timer } from 'rxjs'
import { Converter } from 'src/structures/Converter'
import { Biome, GameMap, MapAreaName } from 'src/structures/GameMap'
import { UniversalHitbox, universalWithin } from 'src/utils/universal-within'
import { BasicMath } from 'src/utils/math'
import { Cache } from 'src/structures/cache/cache'
import { StaticSettableItem } from '../basic/static-item.basic'
import { Bio } from '../basic/bio-item.basic'
import { StaticItemsHandler } from 'src/structures/StaticItemsHandler'

export interface MobProps {
  point: Point
  spawn: { startPoint: Point; size: Size }
  staticItems: StaticItemsHandler
  currentArea: MapAreaName
  biome: Biome
  theta: number
}

interface MobCache {
  staticItems: Array<StaticSettableItem | Bio>
}

export class Mob extends BasicMob {
  constructor(props: MobProps & BasicMobProps) {
    super(props)
    Object.assign(this, props)
  }
  readonly id = uuid(75)
  died: boolean = false
  biome: Biome
  spawn: { startPoint: Point; size: Size }
  point?: Point = new Point(0, 0)
  staticItems: StaticItemsHandler
  readonly cache = new Cache<MobCache>(() => ({ staticItems: [] }))
  target?: Player
  currentArea: MapAreaName
  theta: number
  drop: { [k: number]: number }
  attackRadius: number
  damageInterval: number
  private targetPoint: Point
  private nextStopTime: number
  private waitUntil: number
  private damageIntervalObj: any
  private viewRadius = 1000

  centerPoint(point: Point = this.point) {
    return point.clone()
  }

  moveTo(point: Point) {
    this.point = point
  }

  get universalHitbox() {
    return {
      radius: this.attackRadius,
      point: this.centerPoint(),
    }
  }

  within(hitbox: UniversalHitbox) {
    // const hitboxPoints = pointsOfRotatedRectangle(
    //   this.centerPoint(),
    //   this.hitbox,
    //   this.theta,
    // )

    return universalWithin(hitbox, this.universalHitbox)
  }

  readyToDamage(players: Player[]) {
    if (!this.target || this.died) {
      clearInterval(this.damageIntervalObj)
    } else {
      timer(1000).subscribe(() => {
        this.damageIntervalObj = setInterval(() => {
          // hurting player
          players.forEach((player) => {
            if (
              circlePoint(
                ...Converter.pointToXYArray(this.centerPoint()),
                this.hitbox,
                ...Converter.pointToXYArray(player.point()),
              )
            ) {
              player.damage(this.damage, 'mob')
            }
          })
        }, this.damageInterval * 1000)
      })
    }
  }

  hurt(damage: number, player: Player) {
    this.hp -= damage
    if (this.hp <= 0) {
      this.died = true
      this.readyToDamage([])
      if (this.drop) {
        $(this.drop).$forEach((quantity, id) => {
          player.items.addItem(+id, quantity)
        })
      }
      player.lbMember.add(this.givesXP)
      player.gameServer.mobs.all.delete(this.id)
    }
  }

  action(players: Player[], map: GameMap, delta: number) {
    if (this.died) {
      this.hurt(0, {} as any)
    }

    const attackTactic = this.moveTactic.otherTactics.find(
      (t) => t.type == MobMoveStatus.ATTACK,
    )

    const speed = (sp: number) => sp * delta
    const useTactic = (options: {
      tactic: Partial<MoveTactic<MobMoveStatus>>
      theta: number
      _interval?: number | (() => number)
      _speed?: number
      noCheck?: boolean
    }) => {
      const {
        tactic,
        theta,
        _interval = tactic.interval,
        _speed = tactic.speed,
        noCheck = false,
      } = options
      if (!this.nextStopTime || Date.now() >= this.nextStopTime) {
        if (this.waitUntil >= Date.now()) {
          this.targetPoint = null
          this.readyToDamage([])
        } else {
          this.theta = theta
          const interval =
            typeof _interval === 'number' ? _interval : _interval()
          const targetPoint = getPointByTheta(
            this.point,
            this.theta,
            tactic.duration * speed(_speed),
          )
          this.targetPoint = targetPoint
          this.nextStopTime = Date.now() + tactic.duration * 1000
          this.waitUntil = Date.now() + interval * 1000
        }
      }
      if (this.targetPoint) {
        const calcSpeed = speed(
          BasicMath.pythagorean(
            _speed,
            Math.abs(this.targetPoint.y - this.point.y),
          ) +
            (map.biomeOf(this.point)[0] === Biome.water &&
            this.biome !== Biome.water
              ? map.find(map.areaOf(this.point))?.effect.speed || 0
              : 0),
        )
        const nextPoint = getPointByTheta(
          this.point,
          this.theta,

          calcSpeed,
        )
        const itemWithin = this.staticItems
          .for(nextPoint)
          .itemWithin(this.universalHitbox)
        if (
          !boxPoint(
            ...Converter.pointToXYArray(this.spawn.startPoint),
            this.spawn.size.width,
            this.spawn.size.height,
            ...Converter.pointToXYArray(this.centerPoint(nextPoint)),
          )
        ) {
          this.targetPoint = null
          this.readyToDamage([])

          // this.target = null

          useTactic({
            tactic: this.moveTactic.idleTactic,
            theta: $.randomNumber(0, Math.PI * 2),
            _interval: attackTactic.interval,
          })
          return
        } else if (itemWithin && !noCheck) {
          this.targetPoint = null
          this.readyToDamage([])
          useTactic({
            tactic: this.moveTactic.idleTactic,
            theta:
              getAngle(
                this.centerPoint(nextPoint),
                itemWithin.centerPoint || itemWithin.point,
              ) + Math.PI,
            _interval: attackTactic.interval,
            _speed: attackTactic.speed * 2,
            noCheck: true,
          })
          return
        }

        this.moveTo(nextPoint)
      }
    }

    if (this.target && !this.target.died()) {
      if (this.target.settings.invisibility()) {
        this.target = null
      } else {
        const distance = getDistance(this.target.point(), this.centerPoint())
        if (distance < speed(attackTactic.speed)) {
          this.moveTo(this.target.point())
          return
        }
        if (distance > this.reactRadius) {
          this.target = null
        } else {
          useTactic({
            tactic: attackTactic,
            theta: getAngle(this.centerPoint(), this.target.point()),
          })
        }
      }
    } else {
      useTactic({
        tactic: this.moveTactic.idleTactic,
        theta: $.randomNumber(0, Math.PI * 2),
      })

      for (let player of players) {
        if (!player) continue
        if (
          getDistance(player.point(), this.centerPoint()) <= this.reactRadius
        ) {
          this.target = player
          this.waitUntil = null
          this.readyToDamage(players)
          break
        }
      }
    }
  }
}
