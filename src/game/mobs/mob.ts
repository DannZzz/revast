import { uuid } from 'anytool'
import { boxPoint, polygonCircle, polygonPoint } from 'intersects'
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
import { Biome } from 'src/structures/GameMap'
import { StaticItems } from 'src/structures/StaticItems'
import { pointsOfRotatedRectangle } from 'src/utils/points-of-rotated-rectangle'
import { universalWithin } from 'src/utils/universal-within'
import { BasicMath } from 'src/utils/math'

export interface MobProps {
  point: Point
  spawn: { startPoint: Point; size: Size }
  staticItems: StaticItems
  currentBiom: Biome
  theta: number
}

export class Mob extends BasicMob {
  constructor(props: MobProps & BasicMobProps) {
    super(props)
    Object.assign(this, props)
  }
  readonly id = uuid(75)
  died: boolean = false
  spawn: { startPoint: Point; size: Size }
  point?: Point = new Point(0, 0)
  staticItems: StaticItems
  target?: Player
  currentBiom: Biome
  theta: number
  drop: { [k: number]: number }
  attackRadius: number
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

  within(points: Point[]) {
    // const hitboxPoints = pointsOfRotatedRectangle(
    //   this.centerPoint(),
    //   this.hitbox,
    //   this.theta,
    // )

    return polygonCircle(
      Converter.pointArrayToXYArray(points),
      ...Converter.pointToXYArray(this.centerPoint()),
      this.attackRadius,
    )
  }

  readyToDamage(players: Player[]) {
    if (!this.target || this.died) {
      clearInterval(this.damageIntervalObj)
    } else {
      timer(1000).subscribe(() => {
        this.damageIntervalObj = setInterval(() => {
          // hurting player
          let check: any = {
            point: this.centerPoint(),
            // @ts-ignore
            radius: this.hitbox.radius,
          }
          if (this.hitbox.type === 'rect') {
            check = pointsOfRotatedRectangle(
              this.centerPoint(),
              new Size(this.hitbox.width, this.hitbox.height),
              this.theta,
            )
          }
          players.forEach((player) => {
            if (universalWithin(check, player.point())) {
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
      player.gameServer().mobs.all.delete(this.id)
    }
  }

  action(players: Player[], delta: number) {
    if (this.died) {
      this.hurt(0, {} as any)
    }
    const speed = (sp: number) => sp * delta
    const useTactic = (
      tactic: Partial<MoveTactic<MobMoveStatus>>,
      theta: number,
    ) => {
      if (!this.nextStopTime || Date.now() >= this.nextStopTime) {
        if (this.waitUntil >= Date.now()) {
          this.targetPoint = null
          this.readyToDamage([])
        } else {
          this.theta = theta
          const interval =
            typeof tactic.interval === 'number'
              ? tactic.interval
              : tactic.interval()
          const targetPoint = getPointByTheta(
            this.point,
            this.theta,
            tactic.duration * speed(tactic.speed),
          )
          this.targetPoint = targetPoint
          this.nextStopTime = Date.now() + tactic.duration * 1000
          this.waitUntil = Date.now() + interval * 1000
        }
      }
      if (this.targetPoint) {
        const nextPoint = getPointByTheta(
          this.point,
          this.theta,

          speed(
            BasicMath.pythagorean(
              tactic.speed,
              Math.abs(this.targetPoint.y - this.point.y),
            ),
          ),
        )

        if (
          !boxPoint(
            ...Converter.pointToXYArray(this.spawn.startPoint),
            this.spawn.size.width,
            this.spawn.size.height,
            ...Converter.pointToXYArray(this.centerPoint(nextPoint)),
          ) ||
          this.staticItems.someWithin(() => {
            if (this.hitbox.type === 'circle') {
              return [this.centerPoint(), this.hitbox.radius]
            }
            return [
              pointsOfRotatedRectangle(
                nextPoint,
                new Size(this.hitbox.width, this.hitbox.height),
                this.theta,
              ),
            ]
          })
        )
          return

        this.moveTo(nextPoint)
      }
    }
    const attackTactic = this.moveTactic.otherTactics.find(
      (t) => t.type == MobMoveStatus.ATTACK,
    )
    if (this.target && !this.target.died()) {
      const distance = getDistance(this.target.point(), this.centerPoint())
      if (distance < speed(attackTactic.speed)) {
        this.moveTo(this.target.point())
        return
      }
      if (distance > this.reactRadius) {
        this.target = null
      } else {
        useTactic(
          attackTactic,
          getAngle(this.centerPoint(), this.target.point()),
        )
      }
    } else {
      useTactic(this.moveTactic.idleTactic, $.randomNumber(0, Math.PI * 2))

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
