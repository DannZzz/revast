import { uuid } from 'anytool'
import { Player } from '../player/player'
import { Point, Size } from 'src/global/global'
import { UniversalHitbox, universalWithin } from 'src/utils/universal-within'
import { timer } from 'rxjs'
import { uniqueId } from 'src/utils/uniqueId'

export interface BasicDropProps<T> {
  source: string
  hurtSource: string
  data: T
  hp?: number
  point: Point
  hitboxRadius: number
  take: (player: Player, data: T) => void
  duration?: number
  onEnd: (drop: BasicDrop<T>) => void
  authorId?: string
  size: Size
  type?: string
  oneClick?: boolean
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
  readonly id = uniqueId()
  point: Point
  hitboxRadius: number
  source: string
  data: T
  hp?: number
  oneClick?: boolean
  private _hp: number
  take: (player: Player, data: T) => void
  duration?: number
  onEnd: (drop: BasicDrop<T>) => void
  authorId: string
  private got = false

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
    if (this.got) return
    if (this.oneClick) {
      this.got = true
      this.onEnd(this)
      this.take(player, this.data)
    } else {
      this._hp -= damage
      if (this._hp <= 0) {
        this.got = true
        this.onEnd(this)
        this.take(player, this.data)
      }
    }
  }
}
