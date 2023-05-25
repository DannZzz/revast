import { skinByName } from 'src/data/skins'
import { MapEntity } from 'src/entities/map.entity'
import { PlayerInformationEntity } from 'src/entities/player-information.entity'
import { PlayerJoinedEntity } from 'src/entities/player-joined.entity'
import { PlayerSkinEntity } from 'src/entities/player-skin.entity'
import { Size, Point, combineClasses } from 'src/global/global'
import { Camera } from 'src/structures/Camera'
import { GetSet } from 'src/structures/GetSet'
import { StaticItems } from 'src/structures/StaticItems'
import { Transformer } from 'src/structures/Transformer'
import { LBMember } from 'src/structures/leaderboard/Leaderboard'
import { Toggle } from 'src/structures/toggle-options'
import { Token } from 'src/structures/tokens/Token'
import { TokenChest } from 'src/structures/tokens/token-chest'
import { perfectSocket } from 'src/utils/perfectSocket'
import { rectToPolygon } from 'src/utils/polygons'
import { MainSocket } from 'src/ws/events/events'
import { BasicElement, ElementProps } from '../basic/element-basic'
import { GameServer } from '../server'
import {
  PlayerEvents,
  PlayerSkin,
  PlayerCache,
  PlayerCacheInit,
  PlayerProps,
} from '../types/player.types'
import { PlayerAction } from './player-action'
import { PlayerBars } from './player-bars'
import { PlayerItems } from './player-items'
import { PlayerLoop } from './player-loop'
import { PlayerSpeed } from './player-speed'
import { Cache } from 'src/structures/cache/cache'
import { polygonCircle, polygonPolygon } from 'intersects'
import { Converter } from 'src/structures/Converter'
import {
  GAME_DAY_SECONDS,
  MAX_ITEM_QUANTITY_IN_CRATE,
  PLAYER_BODY_POINTS,
} from 'src/constant'
import { BasicDrop } from '../basic/drop.basic'
import { Images } from 'src/structures/image-base'
import { percentOf } from 'src/utils/percentage'
import { Message } from 'src/structures/Message'

export class Player extends BasicElement<PlayerEvents> {
  skin: PlayerSkin = skinByName('repeat')
  range = 30
  readonly equipment = {
    size: new Size(120, 120),
    hands: { left: { rotation: 0 }, right: { rotation: 180 } },
  }
  readonly pointOnScreen: GetSet<Point>
  readonly actions: PlayerAction
  readonly admin = GetSet(false)
  readonly godMode = GetSet(false)
  readonly name: string
  readonly toggle = new Toggle()
  readonly speed: PlayerSpeed
  readonly items: PlayerItems
  readonly _staticItems: () => StaticItems
  readonly bars: PlayerBars
  readonly camera: Camera
  cache: Cache<PlayerCache> = new Cache(PlayerCacheInit)
  readonly died = GetSet(false)
  readonly token: Token
  readonly lbMember: LBMember
  readonly uniqueId: number
  readonly createdAt = new Date()
  readonly loop: PlayerLoop
  readonly kills = GetSet(0)

  readonly socket: () => MainSocket = () =>
    perfectSocket(
      this.gameServer().socketServer.sockets.get(
        TokenChest.get(this.token.current)?.currentSocketId,
      ),
    )
  readonly gameServer: () => GameServer

  constructor(props: ElementProps<PlayerProps>) {
    const {
      name,
      cameraOptions,
      gameServer,
      uniqueId,
      lbMember,
      token,
      ...basic
    } = props
    super(basic)
    this.gameServer = gameServer
    this.token = token
    this.uniqueId = uniqueId
    this.name = name
    this.pointOnScreen
    this.lbMember = lbMember
    this._staticItems = () => gameServer().staticItems
    this.actions = new PlayerAction(this)
    this.items = new PlayerItems(this)
    this.bars = new PlayerBars(this)
    this.camera = new Camera(new Point(), cameraOptions)
    this.speed = new PlayerSpeed(this.gameServer(), this)
    this.loop = new PlayerLoop(this)
    this.socketRegistering()
  }

  moveToCenterOfScreen(size: Size) {
    const centerPoint = this.calculatePointForCentering(size)
    this.moveTo(centerPoint)
  }

  get staticItems() {
    return this._staticItems()
  }

  get bodyCenterOnScreen() {
    const point = new Point()
    point.x = this.point().x - this.camera.point().x
    point.y = this.point().y - this.camera.point().y
    console.log(this.point(), this.camera.point())
    console.log(point)
    return point
  }

  bodyPositions(withPoint: Point = new Point(0, 0)) {
    const startPoint = combineClasses(
      new Point(this.point().x - 25, this.point().y - 25),
      withPoint,
    )

    const size = new Size(50, 50)
    return {
      points: rectToPolygon(startPoint, size),
      startPoint,
      corners: [
        startPoint,
        combineClasses(startPoint, new Point(size.width, size.height)),
      ] as [Point, Point],
      size,
    }
  }

  setAngle(angle: number, theta: number) {
    this.theta(theta)
    this.angle(angle)
    // this.body.rotation(angle)
  }

  moveTo(point: Point) {
    this.point(point)
    this.cache.data.biome = this.gameServer().map.biomeOf(point)
  }

  moveFromHere(point: Point) {
    const absolute = combineClasses(point, this.point())
    const { width: mapW, height: mapH } = this.camera.map()

    if (absolute.x < 0) {
      absolute.x = 0
    } else if (absolute.x > mapW) {
      absolute.x = mapW
    }
    if (absolute.y < 0) {
      absolute.y = 0
    } else if (absolute.y > mapH) {
      absolute.y = mapH
    }

    this.camera.calculateCameraPoint(absolute)
    this.moveTo(absolute)
  }

  socketRegistering() {
    const socket = this.socket()
    const gameServer = this.gameServer()
    socket.emit('joinServer', [
      Transformer.toPlain(
        new PlayerJoinedEntity({
          skin: new PlayerSkinEntity(this.skin),
          name: this.name,
          player: {
            point: this.point().round(),
            angle: this.angle(),
            speed: this.speed.current(),
          },
          screen: this.camera.point(),
          map: new MapEntity(gameServer.map),
          token: this.token.current,
          id: this.id(),
          dayInfo: gameServer.day.now(),
        }),
      ),
    ])
    this.bars.socketUpdate()
    this.items.update()
  }

  damage(amount: number, type: 'mob' | 'player' | 'absolute', from?: Player) {
    if (this.godMode()) return
    if (type !== 'absolute') {
      const deffense = {
        mob: 0,
        player: 0,
      }

      if (this.items.weared && this.items.weared.item.data.defense) {
        const _def = this.items.weared.item.data.defense
        deffense.player += _def.player || 0
        deffense.mob += _def.mob || 0
      }

      amount -= deffense[type]
    }
    if (amount > 0) {
      this.bars.hp.value -= amount
      if (this.bars.hp.value <= 0 && from) {
        from.lbMember.add(percentOf(30, this.lbMember.xp))
        from.kills(from.kills() + 1)
      }
      this.bars.socketUpdate()
    }
  }

  serverMessage(content: string) {
    this.socket().emit('serverMessage', [content])
  }

  disconnect() {
    this.cache.clear()
  }

  online() {
    return Boolean(this.socket().id)
  }

  within(points: Point[]): boolean
  within(point: Point, radius: number): boolean
  within(arg1: Point | Point[], radius?: number): boolean {
    if (Array.isArray(arg1)) {
      return polygonPolygon(
        Converter.pointArrayToXYArray(PLAYER_BODY_POINTS(this.point())),
        Converter.pointArrayToXYArray(arg1),
      )
    } else {
      return polygonCircle(
        Converter.pointArrayToXYArray(PLAYER_BODY_POINTS(this.point())),
        ...Converter.pointToXYArray(arg1),
        radius,
      )
    }
  }

  get points() {
    return PLAYER_BODY_POINTS(this.point())
  }

  die() {
    if (this.died()) return
    this.bars.stop()

    const crate = new BasicDrop({
      authorId: this.id(),
      data: this.items.items.shuffle().map((playerItem) => ({
        quantity:
          playerItem.quantity > MAX_ITEM_QUANTITY_IN_CRATE
            ? MAX_ITEM_QUANTITY_IN_CRATE
            : playerItem.quantity,
        id: playerItem.item.id,
      })),
      duration: 120,
      hp: 250,
      hitboxRadius: 30,
      point: this.point().clone(),
      source: Images.CRATE,
      hurtSource: Images.HURT_CRATE,
      size: new Size(75, 125),
      onEnd: (drop) => {
        this.staticItems.removeDrop(drop.id)
      },
      take(player, data) {
        data.forEach((item) => {
          player.items.addable(item.id) &&
            player.items.addItem(item.id, item.quantity)
        })
      },
    })
    this.staticItems.addDrop(crate)

    this.socket()?.emit('playerDied', [
      Transformer.toPlain(
        new PlayerInformationEntity({
          xp: this.lbMember.xp,
          days: Math.floor(
            (Date.now() - (this.createdAt.getTime() || Date.now())) /
              1000 /
              GAME_DAY_SECONDS,
          ),
        }),
      ),
    ])
    this.lbMember.delete()
    this._staticItems().playerDied(this.uniqueId)
    this.died(true)
  }

  makeMessage(content: string) {
    const message = new Message(content, this)
    // sharing
    if (message.public()) {
      message.filter()
      const players = this.gameServer().alivePlayers
      this.socket().emit('playerMessage', [this.id(), message.content])
      players.forEach(
        (player) =>
          player.cache.get('otherPlayers', true).includes(this.id()) &&
          player.socket().emit('playerMessage', [this.id(), message.content]),
      )
    }
  }
}
