import { BasicMob, MobMoveStatus, MoveTactic } from 'src/game/basic/mob.basic'
import { Images } from '../image-base'
import { Size } from 'src/global/global'
import { MobNames } from 'src/data/mobs'
import { MOB_GLOBAL_SPEED_EFFECT } from 'src/constant'

class MobCreator {
  extend: Partial<BasicMob> = { moveTactic: { otherTactics: [] } as any }
  private _data: Partial<BasicMob> = {}
  private _speed: number = 0

  sources(source: keyof Images, hurtSource: keyof Images) {
    this.extend.source = Images[source]
    this.extend.hurtSource = Images[hurtSource]
    return this
  }

  drop(items: { [k: number]: number }) {
    this.extend.drop = items
    return this
  }

  size(w: number, h: number) {
    this.extend.size = new Size(w, h)
    return this
  }

  radius(react: number, attack: number) {
    this.extend.reactRadius = react
    this.extend.attackRadius = attack
    return this
  }

  hp(amount: number) {
    this.extend.hp = amount
    return this
  }

  givesXP(xp: number) {
    this.extend.givesXP = xp
    return this
  }

  speed(amount: number) {
    this._speed = amount + MOB_GLOBAL_SPEED_EFFECT
    return this
  }

  hitbox(radius: number) {
    this.extend.hitbox = radius
    return this
  }

  damage(amount: number, interval: number) {
    this.extend.damage = amount
    this.extend.damageInterval = interval
    return this
  }

  idleTactic(idle: Omit<BasicMob['moveTactic']['idleTactic'], 'speed'>) {
    this.extend.moveTactic.idleTactic = { speed: this._speed, ...idle }
    return this
  }

  tactic(...tactic: Omit<MoveTactic<MobMoveStatus>, 'speed'>[]) {
    this.extend.moveTactic.otherTactics.push(
      ...tactic.map((t) => ({ ...t, speed: this._speed })),
    )
    return this
  }

  data(data: Partial<BasicMob>) {
    this._data = data
    return this
  }

  build() {
    return new BasicMob({ ...this.extend, ...this._data } as any)
  }
}

export const createMob = (name: MobNames) => {
  const creator = new MobCreator()
  creator.extend.name = name
  return creator
}
