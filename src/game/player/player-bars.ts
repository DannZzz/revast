import { PlayerBarsEntity } from 'src/dto/player-bars.dto'
import { Bar } from 'src/structures/Bar'
import { percentOf } from 'src/utils/percentage'
import { Player } from './player'
import { GOD_MOD_ALL } from 'src/constant'
import { Eatable, Item, WearableEffect } from '../basic/item.basic'
import { Biome } from 'src/structures/GameMap'

export type PlayerBar =
  | 'hp'
  | 'hungry'
  | 'temperature'
  | 'h2o'
  | 'o2'
  | 'bandage-effect'

export class PlayerBars {
  readonly hp: Bar = new Bar(200, 200)
  readonly hungry: Bar = new Bar(100, 100)
  readonly temperature: Bar = new Bar(100, 100)
  readonly h2o: Bar = new Bar(100, 100)
  readonly o2: Bar = new Bar(100, 100)
  readonly bandageEffect = new Bar(25, 0)
  readonly bandageEffectPower = 25

  private healingAfterCheck = 2
  healingChecking = 0
  private healingPercent: number = 30
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

      // checking vasting and o2
      this.vastingAndO2()

      // try to heal
      if (this.healingChecking >= this.healingAfterCheck) {
        let percent = this.healingPercent
        if (this.bandageEffect.value > 0) {
          percent += this.bandageEffectPower
          this.bandageEffect.value--
        }
        this.hp.value += percentOf(percent, this.hungry.max)
        this.healingChecking = 0.5
      }

      this.hungry.value -= percentOf(3, this.hungry.max)

      if (this.hp.value < this.hp.max) {
        if (this.healingChecking === 0) this.healingChecking += 0.5
        else this.healingChecking++
      }
      this.socketUpdate()
    }, 8000)
  }

  private vastingAndO2() {
    const inWater = this.player.actions.state.actualStates.water()
    const onBridge = this.player.actions.state.actualStates.onBridge()
    const o2Effect =
      this.player.items.weared?.item.data?.effect?.oxygenLoss || 0
    const effect =
      this.player.gameServer.map.find(
        this.player.gameServer.map.biomeOf(this.player.point()),
      )?.[
        this.player.actions.state.actualStates.onBridge()
          ? 'onBridgeEffect'
          : 'effect'
      ].vast || 0

    if (inWater) {
      this.h2o.value += 20
    } else {
      if (this.h2o.value === 0) {
        this.player.damage(30, 'absolute')
      } else {
        this.h2o.value += -2 + effect
      }
    }

    if (inWater && !onBridge) {
      if (this.o2.value === 0) {
        this.player.damage(30, 'absolute')
      } else {
        this.o2.value -= 30 + o2Effect
      }
    } else {
      this.o2.value += 35
    }
  }

  private actualTemperatureChanges() {
    const currentAreas = this.player.cache.get('biome')
    const biome = this.player.gameServer.map.find(
      this.player.gameServer.map.biomeOf(this.player.point()),
    )

    const effect =
      biome?.[
        this.player.actions.state.actualStates.onBridge()
          ? 'onBridgeEffect'
          : 'effect'
      ]

    const wearingEffect = this.player.items.weared?.item.data?.effect
    let inWater = new WearableEffect({}).inWaterTempLoss
    if (
      !this.player.actions.state.actualStates.onBridge() &&
      biome.type === Biome.water
    )
      inWater = wearingEffect?.inWaterTempLoss

    const dayEffect =
      (wearingEffect?.tempLossPerc.day || 0) + (inWater?.day || 0)
    const nightEffect =
      (wearingEffect?.tempLossPerc.night || 0) + (inWater?.night || 0)

    let tempChange =
      effect.temperatureDay + percentOf(dayEffect, effect.temperatureDay)
    if (!this.player.gameServer.day.isDay())
      tempChange =
        effect.temperatureNight +
        percentOf(nightEffect, effect.temperatureNight)

    // fires within
    const firesAround = this.player.staticItems
      .for(this.player.camera.viewRect())
      .settable.filter(
        (settable) =>
          settable.isSpecial('firePlace') &&
          settable.data.special.firePlace.within.call(
            settable,
            this.player.point(),
          ),
      )
    if (!!firesAround.length) {
      tempChange = Math.max(
        ...firesAround.map(
          (settable) => settable.data.special.firePlace.addsTemperature,
        ),
      )

      tempChange += percentOf(
        this.player.gameServer.day.isDay()
          ? wearingEffect?.heatPerc.day
          : wearingEffect?.heatPerc.night,
        tempChange,
      )
    } else if (this.temperature.value === 0) {
      this.player.damage(20, 'absolute')
    }

    this.temperature.value += tempChange
  }

  stop() {
    clearInterval(this._interval)
  }

  onAction() {
    if (!this.player.settings.autofood()) return
    let changed = false

    const eatFor = (key: 'toFood' | 'toWater') => {
      const feed = this.player.items.items
        .filter(
          (item) =>
            item.item.isEatable() &&
            item.item.data.toHealth >= 0 &&
            item.item.data[key] > 0,
        )
        .sort(
          (a, b) =>
            (a.item as Item<Eatable>).data[key] -
            (b.item as Item<Eatable>).data[key],
        )[0]
      if (feed) {
        this.player.items.eat(feed.item as any)
        changed = true
      }
    }

    if (25 >= percentOf(this.hungry.value, this.hungry.max)) {
      eatFor('toFood')
    }

    if (25 >= percentOf(this.h2o.value, this.h2o.max)) {
      eatFor('toWater')
    }
    if (changed) this.socketUpdate()
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
      new PlayerBarsEntity({
        bar: 'h2o',
        max: this.h2o.max,
        current: this.h2o.value,
      }),
      new PlayerBarsEntity({
        bar: 'o2',
        max: this.o2.max,
        current: this.o2.value,
      }),
      new PlayerBarsEntity({
        bar: 'bandage-effect',
        max: this.bandageEffect.max,
        current: this.bandageEffect.value,
      }),
    ])
  }
}
