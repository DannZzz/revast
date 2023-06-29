import { Chest } from 'anytool'
import { GameServer } from 'src/game/server'
import { Size, Point } from 'src/global/global'
import { Biome, BiomeEffect, BiomeOptions } from 'src/structures/GameMap'

const GameServers = new Chest<string, GameServer>()

export default GameServers

export const generateLake = (n: number, point: Point, size: Size) => {
  return new BiomeOptions({
    type: Biome.water,
    name: `lake${n}`,
    priority: 2,
    size,
    bgColor: '#0b6a84',
    point,
    effect: new BiomeEffect({
      speed: -80,
      temperatureDay: -5,
      temperatureNight: -25,
    }),
    onBridgeEffect: new BiomeEffect({
      temperatureDay: -3,
      temperatureNight: -20,
      speed: 0,
    }),
  })
}
