import { itemById } from './data/items'
import { Mobs, MobNames } from './data/mobs'
import { GameServer } from './game/server'
import { Point, Size, combineClasses } from './global/global'
import { GameMap, Biome, BiomeOptions, BiomeEffect } from './structures/GameMap'
import { rectToPolygon } from './utils/polygons'
import config from 'config'

import { MainServer } from './ws/events/events'

export const PORT = config.get('PORT')

export const SERVER_API: (combine?: string) => string = (
  combine: string = '',
) => `${config.get('SERVER')}${combine}`

export const PLAYER_BODY_SIZE = new Size(120, 116)

export const PLAYER_BODY_ACUTAL_SIZE = new Size(70, 50)

export const PLAYER_BODY_POINTS = (centerPoint: Point): Point[] =>
  rectToPolygon(
    combineClasses(centerPoint, new Point(-35, -25)),
    PLAYER_BODY_ACUTAL_SIZE,
  )

export const GOD_MOD_ALL = false

export const ITEM_DIR_NAMES = [
  'any',
  'feed',
  'tools',
  'weapons',
  'resources',
  'settable',
  'helmets',
]

export const MOB_GLOBAL_SPEED_EFFECT = 0

export const MOB_DIR_NAMES = ['mobs']

export const PLAYER_NAME_MAX_SIZE = 18

export const PLAYER_ITEMS_SPACE = 10
export const BAG_SPACE = 10

export const MESSAGE_MAX_LENGTH = 160
export const MESSAGE_DURATION = 8

export const GAME_DAY_SECONDS = 600

export const BASIC_PLAYER_SPEED = 180
export const PLAYER_DECREASE_SPEED_WEAPON = 45
export const PLAYER_DECREASE_SPEED_CLICK = 30

export const MAX_ITEM_QUANTITY_IN_CRATE = 500

export const ADMIN_PASSWORDS = ['i want admin']
export const ADMIN_COMMAND_PREFIX = '/'

export const START_ITEMS = () => [
  [29, { quantity: 999, equiped: false, item: itemById(29) }],
  [59, { quantity: 999, equiped: false, item: itemById(59) }],
  [6, { quantity: 999, equiped: false, item: itemById(6) }],
  [8, { quantity: 999, equiped: false, item: itemById(8) }],
  [70, { quantity: 1, equiped: false, item: itemById(70) }],
  [71, { quantity: 1, equiped: false, item: itemById(71) }],
  [72, { quantity: 1, equiped: false, item: itemById(72) }],
  [73, { quantity: 1, equiped: false, item: itemById(73) }],
  [74, { quantity: 1, equiped: false, item: itemById(74) }],
  [75, { quantity: 1, equiped: false, item: itemById(75) }],
]

export const TEST_GAME_SERVER = (server: MainServer) =>
  new GameServer({
    information: { name: 'Main' },
    socketServer: server,
    map: new GameMap({
      size: new Size(300, 300),
      tileSize: new Size(70, 70),
      mapSource: 'map1-mini.png',
      biomes: {
        [Biome.winter]: new BiomeOptions({
          size: new Size(150, 100),
          bgColor: '#f8f6f1',
          point: new Point(0, 0),
          effect: new BiomeEffect({
            temperatureDay: -20,
            temperatureNight: -40,
            speed: -30,
          }),
        }),
        [Biome.forest]: new BiomeOptions({
          size: new Size(140, 100),
          bgColor: '#133a2b',
          point: new Point(0, 100),
          effect: new BiomeEffect({
            temperatureDay: -3,
            temperatureNight: -20,
          }),
        }),
        [Biome.beach]: new BiomeOptions({
          size: new Size(10, 100),
          bgColor: '#fbefbc',
          point: new Point(140, 100),
          effect: new BiomeEffect({
            temperatureDay: -3,
            temperatureNight: -20,
          }),
        }),
        [Biome.desert]: new BiomeOptions({
          size: new Size(150, 100),
          bgColor: '#d1c69b',
          point: new Point(0, 200),
          effect: new BiomeEffect({
            speed: -20,
            temperatureDay: 0,
            temperatureNight: -20,
          }),
        }),
        [Biome.ocean]: new BiomeOptions({
          size: new Size(150, 300),
          bgColor: '#0b6a84',
          point: new Point(150, 0),
          effect: new BiomeEffect({
            speed: -80,
            temperatureDay: -10,
            temperatureNight: -30,
          }),
        }),
      },
    }),
    initMobs: (game) => {
      const forest = game.map.absoluteBiome(Biome.forest)
      const desert = game.map.absoluteBiome(Biome.desert)
      const winter = game.map.absoluteBiome(Biome.winter)
      const ocean = game.map.absoluteBiome(Biome.ocean)
      return Mobs.generateForServer(
        {
          [MobNames.wolf]: {
            biome: Biome.forest,
            canOut: false,
            maxCount: 50,
            reAddEachSeconds: 10,
            spawn: { startPoint: forest.point, size: forest.size },
          },
          [MobNames.spider]: {
            biome: Biome.forest,
            canOut: false,
            maxCount: 50,
            reAddEachSeconds: 10,
            spawn: { startPoint: forest.point, size: forest.size },
          },
          [MobNames.bear]: {
            biome: Biome.forest,
            canOut: false,
            maxCount: 20,
            reAddEachSeconds: 20,
            spawn: { startPoint: forest.point, size: forest.size },
          },
          [MobNames.arctic_fox]: {
            biome: Biome.winter,
            canOut: false,
            maxCount: 40,
            reAddEachSeconds: 10,
            spawn: { startPoint: winter.point, size: winter.size },
          },
          [MobNames.polar_bear]: {
            biome: Biome.winter,
            canOut: false,
            maxCount: 30,
            reAddEachSeconds: 10,
            spawn: { startPoint: winter.point, size: winter.size },
          },
          [MobNames.dragon]: {
            biome: Biome.winter,
            canOut: false,
            maxCount: 30,
            reAddEachSeconds: 10,
            spawn: { startPoint: winter.point, size: winter.size },
          },
          [MobNames.piranha]: {
            biome: Biome.ocean,
            canOut: false,
            maxCount: 30,
            reAddEachSeconds: 10,
            spawn: { startPoint: ocean.point, size: ocean.size },
          },
          [MobNames.megalodon]: {
            biome: Biome.ocean,
            canOut: false,
            maxCount: 30,
            reAddEachSeconds: 10,
            spawn: { startPoint: ocean.point, size: ocean.size },
          },
          [MobNames.scorpion]: {
            biome: Biome.desert,
            canOut: false,
            maxCount: 30,
            reAddEachSeconds: 10,
            spawn: { startPoint: desert.point, size: desert.size },
          },
        },
        game,
      )
    },
  })
