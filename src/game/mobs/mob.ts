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
import { MOB_GLOBAL_ATTACK_SPEED_EFFECT } from 'src/constant'

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
  damageInterval: number
  private targetPoint: Point
  private nextStopTime: number
  private waitUntil: number
  private damageIntervalObj: any

  centerPoint(point: Point = this.point) {
    return point.clone()
  }

  moveTo(point: Point) {
    this.point = point
  }

  get universalHitbox() {
    return {
      radius: this.radius.attack,
      point: this.centerPoint(),
    }
  }

  get universalCollisionHitbox() {
    return {
      radius: this.radius.collision,
      point: this.centerPoint(),
    }
  }

  within(hitbox: UniversalHitbox, collision: boolean = false) {
    // const hitboxPoints = pointsOfRotatedRectangle(
    //   this.centerPoint(),
    //   this.hitbox,
    //   this.theta,
    // )

    return universalWithin(
      hitbox,
      collision ? this.universalCollisionHitbox : this.universalHitbox,
    )
  }

  readyToDamage(players: Player[]) {
    if (!this.target || this.died) {
      clearInterval(this.damageIntervalObj)
    } else {
      let max = 0
      timer(1700).subscribe(() => {
        clearInterval(this.damageIntervalObj)
        this.damageIntervalObj = setInterval(() => {
          // hurting player
          let attacked = false
          players.forEach((player) => {
            if (
              circlePoint(
                ...Converter.pointToXYArray(this.centerPoint()),
                this.radius.attack,
                ...Converter.pointToXYArray(player.point()),
              )
            ) {
              attacked = true
              player.damage(this.damage, 'mob')
            }
          })
          if (!attacked) {
            max++
          } else {
            max = 0
          }
          if (max === 3) {
            clearTimeout(this.damageIntervalObj)
            this.readyToDamage(players)
          }
        }, this.damageInterval * 1000 * MOB_GLOBAL_ATTACK_SPEED_EFFECT)
      })
    }
  }

  hurt(damage: number, player: Player) {
    this.hp -= damage
    if (this.hp <= 0 && !this.died) {
      this.died = true
      this.readyToDamage([])
      if (this.drop) {
        $(this.drop).$forEach((quantity, id) => {
          player.items?.addItem(+id, quantity)
        })
      }
      player.lbMember?.add(this.givesXP)
      player.gameServer?.mobs.all.delete(this.id)
    }
  }

  canIGo(point: Point, map: GameMap) {
    return (
      boxPoint(
        ...Converter.pointToXYArray(this.spawn.startPoint),
        this.spawn.size.width,
        this.spawn.size.height,
        ...Converter.pointToXYArray(this.centerPoint(point)),
      ) &&
      (this.biome !== Biome.water ||
        map.biomeOf(this.centerPoint(point))[0] === Biome.water)
    )
  }

  action(players: Player[], map: GameMap, delta: number) {
    if (this.died) {
      this.hurt(0, {} as any)
      return
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
      if (this.died) {
        this.hurt(0, {} as any)
        return
      }
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

        let nextPoint = getPointByTheta(
          this.point,
          this.theta,

          calcSpeed,
        )
        if (
          getDistance(nextPoint, this.target.point()) <
          speed(attackTactic.speed)
        ) {
          this.moveTo(this.target.point())
          // this.theta = getAngle(this.centerPoint(), this.target.point())
          return
        }

        const itemWithin = this.staticItems
          .for(nextPoint)
          .itemWithin(this.universalCollisionHitbox)
        if (!this.canIGo(nextPoint, map)) {
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
          this.target = null
          this.readyToDamage([])
          useTactic({
            tactic: this.moveTactic.idleTactic,
            theta:
              getAngle(
                this.centerPoint(nextPoint),
                itemWithin.centerPoint || itemWithin.point,
              ) + Math.PI,
            _interval: attackTactic.interval,
            _speed: attackTactic.speed,
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

        if (distance > this.radius.react) {
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
          getDistance(player.point(), this.centerPoint()) <=
            this.radius.react &&
          this.canIGo(player.point(), map)
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
