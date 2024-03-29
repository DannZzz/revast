import { uuid } from 'anytool'
import { boxPoint, circlePoint, polygonCircle, polygonPoint } from 'intersects'
import { Gettable, Point, Size } from 'src/global/global'
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
import { isSameVector } from 'src/utils/same-vector'
import { isNumber } from 'src/utils/is-number-in-range'
import { timingSafeEqual } from 'crypto'
import { uniqueId } from 'src/utils/uniqueId'
import { optimizeHandleAttackedItems } from 'src/utils/optimize-handle-attacked-items'
import { Tick } from 'src/structures/Tick'
import { GameServer } from '../server'

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
  constructor(
    props: MobProps & BasicMobProps,
    readonly gameServer: GameServer,
  ) {
    super(props)
    Object.assign(this, props)
    if (isNumber(this.damageBuilding))
      this.damageBuildingTick = new Tick(this.damageBuildingInterval)

    this.onInit?.(this.gameServer)
  }
  readonly id = uniqueId()
  died: boolean = false
  biome: Biome
  spawn: { startPoint: Point; size: Size }
  point?: Point = new Point(0, 0)
  staticItems: StaticItemsHandler
  readonly cache = new Cache<MobCache>(() => ({ staticItems: [] }))
  target?: Player
  currentArea: MapAreaName
  theta: number
  drop: Gettable<{ [k: number]: number }>
  damage: number
  private targetPoint: Point
  private nextStopTime: number
  private waitUntil: number
  private damageIntervalObj: any
  private damageBuildingTick: Tick

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

  doDamage(players: Player[]) {
    if (this.died) return

    if (this.damageIntervalObj > Date.now()) return
    // hurting player
    players.forEach((player) => {
      if (
        circlePoint(
          ...Converter.pointToXYArray(this.centerPoint()),
          this.radius.attack,
          ...Converter.pointToXYArray(player.point()),
        )
      ) {
        player.damage(this.damage, 'mob')
      }
    })
    this.damageIntervalObj = Date.now() + this.damageInterval * 1000
  }

  doDamageBuild() {
    if (!isNumber(this.damageBuilding) || this.damageBuildingTick.limited())
      return
    const attackedSettables = this.staticItems
      .for(this.universalHitbox)
      .settable.filter((settable) =>
        settable.withinStrict(this.universalHitbox),
      )

    if (attackedSettables.length > 0) this.damageBuildingTick.take()
    attackedSettables.forEach((settable) => {
      settable.hurt(this.damageBuilding)
    })

    optimizeHandleAttackedItems(attackedSettables, this.centerPoint())
  }

  hurt(damage: number, player: Player) {
    if (!isNumber(damage) || damage === 0) return
    if (damage < 0) damage = -damage
    this.hp -= damage
    if (!isNumber(this.hp)) this.hp = 0
    if (this.hp <= 0) {
      if (!this.died) {
        this.onRemove?.(this.gameServer, player)

        if (this.drop) {
          $(Gettable(this.drop)).$forEach((quantity, id) => {
            player.items?.addItem(+id, quantity)
          })
        }
        player.lbMember?.add(this.givesXP)
      }
      player.gameServer?.mobs.all.delete(this.id)
      this.died = true
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
        } else {
          this.theta = theta
          const interval =
            typeof _interval === 'number' ? _interval : _interval()
          const targetPoint =
            this.target?.point() === this.point
              ? this.point
              : getPointByTheta(
                  this.point,
                  this.theta,
                  tactic.duration * speed(_speed),
                )
          this.targetPoint = targetPoint
          this.nextStopTime = Date.now() + tactic.duration * 1000
          this.waitUntil = Date.now() + interval * 1000
        }
        this.doDamage(players)
        if (isNumber(this.damageBuilding)) this.doDamageBuild()
      }
      if (this.targetPoint) {
        if (isSameVector(this.point, this.targetPoint)) return
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
        let nextPoint = getPointByTheta(this.point, this.theta, calcSpeed)
        if (
          this.target &&
          getDistance(nextPoint, this.target.point()) <
            speed(attackTactic.speed)
        ) {
          nextPoint = this.target.point()
          this.targetPoint = nextPoint
          this.moveTo(nextPoint)
          return
        }

        const itemWithin = this.staticItems
          .for({
            radius: this.radius.collision,
            point: nextPoint,
          })
          .itemWithin({
            radius: this.radius.collision,
            point: nextPoint,
          })
        if (!this.canIGo(nextPoint, map)) {
          this.targetPoint = null

          useTactic({
            tactic: this.moveTactic.idleTactic,
            theta: $.randomNumber(0, Math.PI * 2),
            _interval: attackTactic.interval,
          })
          return
        } else if (itemWithin && !noCheck) {
          this.targetPoint = null
          this.target = null
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

    const inRadius = players
      .filter((player) => {
        const angle = getAngle(this.centerPoint(), player.point())
        const pointToGo = getPointByTheta(
          this.centerPoint(),
          angle,
          speed(attackTactic.speed),
        )
        return (
          getDistance(player.point(), this.centerPoint()) <=
            this.radius.react &&
          this.canIGo(player.point(), map) &&
          !this.staticItems
            .for({ point: pointToGo, radius: this.radius.collision })
            .someWithin(
              { point: pointToGo, radius: this.radius.collision },
              true,
            )
        )
      })
      .sort(
        (a, b) =>
          getDistance(a.point(), this.centerPoint()) -
          getDistance(b.point(), this.centerPoint()),
      )[0]

    if (inRadius !== this.target && this.target?.id() !== inRadius?.id()) {
      this.waitUntil = null
    }
    this.target = inRadius

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
            theta:
              distance < speed(attackTactic.speed)
                ? this.theta
                : getAngle(this.centerPoint(), this.target.point()),
          })
        }
      }
    } else if (!this.target) {
      useTactic({
        tactic: this.moveTactic.idleTactic,
        theta: $.randomNumber(0, Math.PI * 2),
      })

      // for (let player of players) {
      //   if (!player) continue
      //   if (
      //     getDistance(player.point(), this.centerPoint()) <=
      //       this.radius.react &&
      //     this.canIGo(player.point(), map)
      //   ) {
      //     this.target = player
      //     this.waitUntil = null
      //     this.readyToDamage(players)
      //     break
      //   }
      // }
    }
  }
}
