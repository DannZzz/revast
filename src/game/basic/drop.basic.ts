import { uuid } from 'anytool'
import { Player } from '../player/player'
import { Point, Size } from 'src/global/global'
import { UniversalHitbox, universalWithin } from 'src/utils/universal-within'
import { timer } from 'rxjs'

export interface BasicDropProps<T> {
  source: string
  hurtSource: string
  data: T
  hp: number
  point: Point
  hitboxRadius: number
  take: (player: Player, data: T) => void
  duration?: number
  onEnd: (drop: BasicDrop<T>) => void
  authorId?: string
  size: Size
  type?: string
}

export class BasicDrop<T = any> implements BasicDropProps<T> {
  constructor(props: BasicDropProps<T>) {
    Object.assign(this, props)
    this._hp = props.hp
    if (props.duration)
      timer(props.duration * 1000).subscribe(() => {
        this._hp = 0
        this.onEnd(this)
      })
  }
  size: Size
  type?: string
  hurtSource: string
  readonly id = `drop-${uuid(40)}`
  point: Point
  hitboxRadius: number
  source: string
  data: T
  hp: number
  private _hp: number
  take: (player: Player, data: T) => void
  duration?: number
  onEnd: (drop: BasicDrop<T>) => void
  authorId: string

  get universalHitbox() {
    return {
      radius: this.hitboxRadius,
      point: this.point,
    }
  }

  within(hitbox: UniversalHitbox) {
    return universalWithin(hitbox, this.universalHitbox)
  }

  hurt(damage: number, player: Player) {
    if (this._hp <= 0) return
    this._hp -= damage
    if (this._hp <= 0) {
      this.onEnd(this)
      this.take(player, this.data)
    }
  }
}
