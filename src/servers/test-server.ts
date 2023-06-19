import { Mobs, MobNames } from 'src/data/mobs'
import { GameServer } from 'src/game/server'
import { Size, Point, combineClasses } from 'src/global/global'
import {
  GameMap,
  BiomeOptions,
  Biome,
  BiomeEffect,
} from 'src/structures/GameMap'
import { Wss } from 'src/ws/WS/WSS'

export const TEST_GAME_SERVER = (server: Wss) =>
  new GameServer({
    information: { name: 'Europe', path: server.server.path },
    socketServer: server,
    map: new GameMap({
      size: new Size(300, 300),
      tileSize: new Size(100, 100),
      mapSource: 'map1-mini.webp',
      biomes: [
        new BiomeOptions({
          type: Biome.winter,
          digItemId: 82,
          name: 'winter',
          size: new Size(150, 100),
          bgColor: '#f8f6f1',
          point: new Point(0, 0),
          effect: new BiomeEffect({
            temperatureDay: -20,
            temperatureNight: -40,
            speed: -30,
          }),
        }),

        new BiomeOptions({
          type: Biome.forest,
          digItemId: 81,
          name: 'forest',
          size: new Size(150, 100),
          bgColor: '#133a2b',
          point: new Point(0, 100),
          effect: new BiomeEffect({
            temperatureDay: -3,
            temperatureNight: -20,
          }),
        }),
        new BiomeOptions({
          type: Biome.beach,
          priority: 2,
          digItemId: 83,
          name: 'beach',
          size: new Size(10, 100),
          bgColor: '#fbefbc',
          point: new Point(140, 100),
          effect: new BiomeEffect({
            temperatureDay: -3,
            temperatureNight: -20,
          }),
        }),
        new BiomeOptions({
          type: Biome.desert,
          digItemId: 83,
          name: 'desert',
          size: new Size(150, 100),
          bgColor: '#d1c69b',
          point: new Point(0, 200),
          effect: new BiomeEffect({
            speed: -20,
            temperatureDay: 0,
            temperatureNight: -20,
            vast: -7,
          }),
        }),
        new BiomeOptions({
          type: Biome.water,
          name: 'ocean',
          size: new Size(150, 300),
          bgColor: '#0b6a84',
          point: new Point(150, 0),
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
        }),
        new BiomeOptions({
          type: Biome.cave,
          digItemId: 81,
          name: 'desert-cave',
          priority: 2,
          bgColor: '#545055',
          size: new Size(67, 31),
          point: new Point(3, 266),
          effect: new BiomeEffect({
            speed: -20,
            temperatureDay: 0,
            temperatureNight: -20,
            vast: -7,
          }),
        }),
        new BiomeOptions({
          type: Biome.cave,
          digItemId: 81,
          priority: 2,
          name: 'winter-cave',
          bgColor: '#545055',
          size: new Size(37, 21),
          point: new Point(61, 1),
          effect: new BiomeEffect({
            temperatureDay: -20,
            temperatureNight: -40,
            speed: -30,
          }),
        }),
        new BiomeOptions({
          type: Biome.water,
          name: 'lake1',
          priority: 2,
          size: new Size(30, 32),
          bgColor: '#0b6a84',
          point: new Point(60, 134),
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
        }),
      ],
    }),
    initMobs: (game) => {
      const forest = game.map.absoluteBiome('forest')
      const desert = game.map.absoluteBiome('desert')
      const winter = game.map.absoluteBiome('winter')
      const ocean = game.map.absoluteBiome('ocean')
      const winterCave = game.map.absoluteBiome('winter-cave')
      const desertCave = game.map.absoluteBiome('desert-cave')
      return Mobs.generateForServer(
        {
          [MobNames.wolf]: {
            area: 'forest',
            biome: Biome.forest,
            canOut: false,
            maxCount: 50,
            reAddEachSeconds: 10,
            spawn: { startPoint: forest.point, size: forest.size },
          },
          [MobNames.spider]: {
            area: 'forest',
            biome: Biome.forest,
            canOut: false,
            maxCount: 50,
            reAddEachSeconds: 10,
            spawn: { startPoint: forest.point, size: forest.size },
          },
          [MobNames.bear]: {
            area: 'forest',
            biome: Biome.forest,
            canOut: false,
            maxCount: 20,
            reAddEachSeconds: 20,
            spawn: { startPoint: forest.point, size: forest.size },
          },
          [MobNames.arctic_fox]: {
            area: 'winter',
            biome: Biome.winter,
            canOut: false,
            maxCount: 40,
            reAddEachSeconds: 10,
            spawn: { startPoint: winter.point, size: winter.size },
          },
          [MobNames.polar_bear]: {
            area: 'winter',
            biome: Biome.winter,
            canOut: false,
            maxCount: 30,
            reAddEachSeconds: 10,
            spawn: { startPoint: winter.point, size: winter.size },
          },
          [MobNames.dragon]: {
            area: 'winter-cave',
            biome: Biome.winter,
            canOut: false,
            maxCount: 10,
            reAddEachSeconds: 10,
            spawn: { startPoint: winterCave.point, size: winterCave.size },
          },
          [MobNames.piranha]: {
            area: 'ocean',
            biome: Biome.water,
            canOut: false,
            maxCount: 100,
            reAddEachSeconds: 5,
            spawn: { startPoint: ocean.point, size: ocean.size },
          },
          [MobNames.megalodon]: {
            area: 'ocean',
            biome: Biome.water,
            canOut: false,
            maxCount: 30,
            reAddEachSeconds: 30,
            spawn: {
              startPoint: combineClasses(
                ocean.point,
                new Point(7 * game.map.tileSize.width, 0),
              ),
              size: ocean.size,
            },
          },
          [MobNames.scorpion]: {
            area: 'desert',
            biome: Biome.desert,
            canOut: false,
            maxCount: 30,
            reAddEachSeconds: 10,
            spawn: { startPoint: desertCave.point, size: desertCave.size },
          },
        },
        game,
      )
    },
  })
