import { PlayerBarsEntity } from 'src/dto/player-bars.dto'
import { Bar } from 'src/structures/Bar'
import { percentOf } from 'src/utils/percentage'
import { Player } from './player'
import { GOD_MOD_ALL } from 'src/constant'
import { Eatable, Item } from '../basic/item.basic'

export type PlayerBar = 'hp' | 'hungry' | 'temperature'

export class PlayerBars {
  readonly hp: Bar = new Bar(200, 200)
  readonly hungry: Bar = new Bar(100, 100)
  readonly temperature: Bar = new Bar(100, 100)

  private healingAfterCheck = 3
  private healingChecking = 0
  private healingPercent: number = 10
  private _interval: any

  constructor(private player: Player) {
    this.hp.onChange((value) => {
      if (value === 0 && !GOD_MOD_ALL) this.player.die() //
    })
    this.createInterval()
  }

  createInterval() {
    this._interval = setInterval(() => {
      // decrease hp cuz of hungry
      if (this.hungry.value === 0) {
        this.player.damage(20, 'absolute')
        this.healingChecking = 0
      }

      // decrease hp cuz of temperature
      this.actualTemperatureChanges()

      if (this.healingChecking >= this.healingAfterCheck) {
        this.hp.value += percentOf(this.healingPercent, this.hungry.max)
        this.healingChecking = 0.5
      }

      this.hungry.value -= percentOf(4, this.hungry.max)

      if (this.hp.value < this.hp.max) {
        if (this.healingChecking === 0) this.healingChecking += 0.5
        else this.healingChecking++
      }
      this.socketUpdate()
    }, 5000)
  }

  private actualTemperatureChanges() {
    const effect = this.player
      .gameServer()
      .map.biomes.find((b) => b.name === this.player.cache.get('biome')).effect
    let percentOfDecreasing = effect.temperatureDay
    if (!this.player.gameServer().day.isDay())
      percentOfDecreasing = effect.temperatureNight

    // fires within
    const firesAround = this.player
      .gameServer()
      .staticItems.settable.filter(
        (settable) =>
          settable.isSpecial('firePlace') &&
          settable.data.special.firePlace.within.call(
            settable,
            this.player.point(),
          ),
      )
    if (!!firesAround.length) {
      percentOfDecreasing = Math.max(
        ...firesAround.map(
          (settable) => settable.data.special.firePlace.addsTemperature,
        ),
      )
    } else if (this.temperature.value === 0) {
      this.player.damage(20, 'absolute')
      this.healingChecking = 0
    }

    this.temperature.value += percentOf(
      percentOfDecreasing,
      this.temperature.max,
    )
  }

  stop() {
    clearInterval(this._interval)
  }

  onAction() {
    if (!this.player.cache.get('autofood')) return
    if (this.hungry.value <= 25) {
      const feed = this.player.items.items
        .filter((item) => item.item.isEatable() && item.item.data.toHealth >= 0)
        .sort(
          (a, b) =>
            (a.item as Item<Eatable>).data.toFood -
            (b.item as Item<Eatable>).data.toFood,
        )[0]
      if (feed) {
        this.player.items.eat(feed.item as any)
      }
    }
  }

  socketUpdate() {
    this.player.socket().emit('playerBars', [
      new PlayerBarsEntity({
        bar: 'hp',
        max: this.hp.max,
        current: this.hp.value,
      }),
      new PlayerBarsEntity({
        bar: 'hungry',
        max: this.hungry.max,
        current: this.hungry.value,
      }),
      new PlayerBarsEntity({
        bar: 'temperature',
        max: this.temperature.max,
        current: this.temperature.value,
      }),
    ])
  }
}
