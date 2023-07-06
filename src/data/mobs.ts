import { Chest } from 'anytool'
import { Biome, GameMap, MapAreaName } from '../structures/GameMap'
import { interval } from 'rxjs'
import { Point, Size } from 'src/global/global'
import { BasicMob } from 'src/game/basic/mob.basic'
import { Mob } from 'src/game/mobs/mob'
import { GameServer } from 'src/game/server'

export enum MobNames {
  wolf = 'WOLF',
  spider = 'SPIDER',
  bear = 'BEAR',
  arctic_fox = 'ARCTIC_FOX',
  polar_bear = 'POLAR_BEAR',
  dragon = 'DRAGON',
  piranha = 'PIRANHA',
  megalodon = 'MEGALODON',
  scorpion = 'SCORPION',
}

export interface ServerMobOptions {
  maxCount: number
  reAddEachSeconds: number
  biome: Biome
  area: MapAreaName
  canOut: boolean
  spawn: { startPoint: Point; size: Size }
}

export const DefaultMobAttackTacticSpeed = { duration: 0.6, interval: 0.9 }

export type ServerMobConfig = { [k in MobNames]?: ServerMobOptions }

export class Mobs {
  static data = new Chest<MobNames, BasicMob>()

  static get(name: MobNames) {
    return this.data.get(name)
  }

  static generateForServer(config: ServerMobConfig, game: GameServer) {
    let mobName: MobNames
    const mobs = new Mobs(config, game)
    for (mobName in config) {
      const mobBasic = this.get(mobName)
      if (!mobBasic) continue
      const conf = config[mobName]
      for (let i = 0; i < conf.maxCount; i++) {
        const mob = new Mob({
          ...mobBasic,
          biome: conf.biome,
          currentArea: conf.area,
          spawn: conf.spawn,
          point: game.randomEmptyPoint(
            mobBasic.radius.collision,
            conf.spawn.startPoint,
            conf.spawn.size,
            (point) =>
              conf.biome !== Biome.water ||
              game.map.biomeOf(point)[0] === Biome.water,
          ),
          staticItems: game.staticItems,
          theta: 0,
        })
        mobs.all.set(mob.id, mob)
      }
    }
    mobs.interval()
    return mobs
  }

  private addTimes: { [k in MobNames]?: number } = {}
  readonly all = new Chest<string, Mob>()
  constructor(readonly config: ServerMobConfig, readonly game: GameServer) {}

  interval() {
    interval(1000).subscribe(() => {
      let mobName: MobNames
      for (mobName in this.config) {
        const conf = this.config[mobName]
        if (this.addTimes[mobName] && this.addTimes[mobName] > Date.now())
          continue
        if (
          this.all.filter((mob) => mob.name == mobName).size >=
          this.config[mobName].maxCount
        )
          continue
        const mobBasic = Mobs.get(mobName)

        const mob = new Mob({
          ...mobBasic,
          biome: conf.biome,
          currentArea: conf.area,
          spawn: conf.spawn,
          point: this.game.randomEmptyPoint(
            mobBasic.radius.collision,
            conf.spawn.startPoint,
            conf.spawn.size,
            (point) =>
              conf.biome !== Biome.water ||
              this.game.map.biomeOf(point)[0] === Biome.water,
          ),
          staticItems: this.game.staticItems,
          theta: 0,
        })
        this.all.set(mob.id, mob)
        this.addTimes[mobName] = Date.now() + conf.reAddEachSeconds * 1000
      }
    })
  }
}
