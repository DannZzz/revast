import { itemById } from './data/items'
import { Point, Size, combineClasses } from './global/global'
import config from 'config'
import { UniversalHitbox } from './utils/universal-within'
import { Tick } from './structures/Tick'

export const PORT = config.get('PORT')

export const isDevelopment = () => process.env.NODE_ENV === 'development'

export const SERVER_API: (combine?: string, ws?: boolean) => string = (
  combine: string = '',
  ws?: boolean,
) => {
  let origin: string = config.get('SERVER')
  if (ws)
    origin = `${origin.includes('https') ? 'wss' : 'ws'}://${
      origin.split('://')[1]
    }`
  return `${origin}${combine}`
}

export const createGameTick = (x: number = 1) => new Tick(5 * x)

export const MAXIMUM_MESSAGE_SIZE_FOR_WS_PER_5S = 600

export const PLAYER_BODY_SIZE = new Size(120, 116)

export const ONE_DAY_MS = 86400 * 1000

export const GAME_FPS = 45

export const PLAYER_BODY_ACUTAL_SIZE = new Size(50, 50)

export const PLAYER_BODY_COLLISION_RADIUS = 21

export const PLAYER_BODY_POINTS = (centerPoint: Point): UniversalHitbox => ({
  point: combineClasses(centerPoint, new Point(-25, -25)),
  size: PLAYER_BODY_ACUTAL_SIZE,
})

export const XP_AFTER_EACH_DAY = 750

export const GOD_MOD_ALL = false

export const ITEM_DIR_NAMES = [
  'farm',
  'any',
  'feed',
  'tools',
  'weapons',
  'resources',
  'settable',
  'helmets',
  'hats',
]

export const BIOS_DIR_NAMES = ['bios', 'bio']

export const HOLD_USER_API_SECONDS = 3600 * 3

export const TIMEOUT_UNPICK_WEAPON = 10
export const TIMEOUT_UNWEAR_HELMET = 5
export const TIMEOUT_BUILDING = 1

export const MAX_SCREEN_SIZE = new Size(2540, 2000)

export const CLAN_MAX_MEMBERS_SIZE = 9
export const CLAN_MAX_NAME_SIZE = 20

export const MOB_GLOBAL_SPEED_EFFECT = 50 + 25
export const MOB_GLOBAL_ATTACK_SPEED_EFFECT = 1.5

export const MOB_DIR_NAMES = ['mobs']

export const POINT_MACHINE_XP_PER_5_SECONDS = 100

export const WALK_EFFECT_SEND_INTERVAL = 1

export const PLAYER_NAME_MAX_SIZE = 18

export const PLAYER_ITEMS_SPACE = 10
export const BAG_SPACE = 10

export const SERVER_MESSAGE_MAX_LENGTH = 160
export const MESSAGE_MAX_LENGTH = 160
export const MESSAGE_DURATION = 8

export const GAME_DAY_SECONDS = 600

export const FARM_ITEM_BUFF = 2

export const BASIC_PLAYER_SPEED = 180 + 25
export const PLAYER_DECREASE_SPEED_WEAPON = 45
export const PLAYER_DECREASE_SPEED_CLICK = 30

export const MAX_ITEM_QUANTITY_IN_CRATE = 500

export const MAP_GRID_RENDER_AREA_SIZE = 2000

export const GRID_SET_RANGE = 125

export const MAX_TREASURES_ISLAND = 5

export const ADMIN_PASSWORDS = ['i want admin']
export const ADMIN_COMMAND_PREFIX = '/'

const itemFor = (i: number, quantity: number = 999) => [
  i,
  { quantity, equiped: false, item: itemById(i) },
]

export const START_ITEMS = () => [
  itemFor(8, 3),
  // itemFor(120),
  // itemFor(121),
  // itemFor(122),
  // itemFor(93),
  // itemFor(118),
  // itemFor(117),
  // itemFor(113),
  // itemFor(3),
]
