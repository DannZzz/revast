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
import { PlayerSpeed } from './player-speed'
import { Cache } from 'src/structures/cache/cache'
import {
  GAME_DAY_SECONDS,
  MAX_ITEM_QUANTITY_IN_CRATE,
  PLAYER_BODY_COLLISION_RADIUS,
  PLAYER_BODY_POINTS,
  TIMEOUT_BUILDING,
  TIMEOUT_UNPICK_WEAPON,
  TIMEOUT_UNWEAR_HELMET,
} from 'src/constant'
import { BasicDrop } from '../basic/drop.basic'
import { Images } from 'src/structures/image-base'
import { percentOf } from 'src/utils/percentage'
import { Message } from 'src/structures/Message'
import { StaticItemsHandler } from 'src/structures/StaticItemsHandler'
import { PlayerLoop } from './player-loop'
import { UniversalHitbox, universalWithin } from 'src/utils/universal-within'
import { DatabaseHandler } from 'src/db/handler'
import { Emitable } from 'src/ws/WS/type'
import { ClanMember } from 'src/structures/clans/ClanMember'
import { PLayerClanActions } from './player-clan-actions'
import CollectedIps from 'src/utils/collected-ips'

export class Player extends BasicElement<PlayerEvents> {
  readonly skin: PlayerSkin
  range = 40
  readonly equipment = {
    size: new Size(120, 120),
    hands: { left: { rotation: 0 }, right: { rotation: 180 } },
  }
  readonly pointOnScreen: GetSet<Point>
  readonly actions: PlayerAction
  readonly settings = {
    admin: GetSet(false),
    godMode: GetSet(false),
    chat: GetSet(true),
    instaCraft: GetSet(false),
    autofood: GetSet(false),
    invisibility: GetSet(false),
    beta: GetSet(false),
  }
  readonly name: string
  readonly toggle = new Toggle()
  readonly speed: PlayerSpeed
  readonly items: PlayerItems
  readonly staticItems: StaticItemsHandler
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
  readonly clanMember: ClanMember
  readonly clanActions: PLayerClanActions

  readonly socket: () => Emitable = () =>
    this.gameServer.socketServer.emitable(
      TokenChest.get(this.token.current)?.currentSocketId,
    )
  readonly gameServer: GameServer

  constructor(props: ElementProps<PlayerProps>) {
    const {
      name,
      cameraOptions,
      gameServer,
      uniqueId,
      lbMember,
      token,
      clanMember,
      skin,
      ...basic
    } = props
    super(basic)
    this.gameServer = gameServer
    this.skin = skinByName(skin)
    this.token = token
    this.uniqueId = uniqueId
    this.name = name
    this.pointOnScreen
    this.lbMember = lbMember
    this.clanMember = clanMember
    this.staticItems = gameServer.staticItems
    this.clanActions = new PLayerClanActions(this)
    this.actions = new PlayerAction(this)
    this.items = new PlayerItems(this)
    this.bars = new PlayerBars(this)
    this.camera = new Camera(new Point(), cameraOptions)
    this.speed = new PlayerSpeed(this.gameServer, this)
    this.loop = new PlayerLoop(this)
  }

  moveToCenterOfScreen(size: Size) {
    const centerPoint = this.calculatePointForCentering(size)
    this.moveTo(centerPoint)
  }

  get bodyCenterOnScreen() {
    const point = new Point()
    point.x = this.point().x - this.camera.point().x
    point.y = this.point().y - this.camera.point().y
    return point
  }

  bodyPositions(withPoint: Point = new Point(0, 0)) {
    const startPoint = combineClasses(
      new Point(this.point().x - 25, this.point().y - 25),
      withPoint,
    )

    const size = new Size(50, 50)
    return {
      collision: <UniversalHitbox>{
        radius: PLAYER_BODY_COLLISION_RADIUS,
        point: combineClasses(this.point(), withPoint),
      },
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

  moveFromHere(point: Point) {
    this.moveTo(combineClasses(point, this.point()))
  }

  moveTo(absolute: Point) {
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
    this.point(absolute)
    this.cache.data.biome = this.gameServer.map.areaOf(this.camera.viewRect())
  }

  socketRegistering() {
    const socket = this.socket()
    const gameServer = this.gameServer
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
          timeout: {
            weapon: TIMEOUT_UNPICK_WEAPON,
            helmet: TIMEOUT_UNWEAR_HELMET,
            building: TIMEOUT_BUILDING,
          },
        }),
      ),
    ])
    this.bars.socketUpdate()
    this.items.update()
    this.actions.actionablesUpdate()
  }

  damage(
    amount: number,
    type: 'mob' | 'player' | 'absolute' | 'settable',
    from?: Player,
  ) {
    if (this.settings.godMode()) return

    if (['mob', 'player'].includes(type)) {
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
      if (
        !from ||
        !from.clanMember.clanId ||
        !this.clanMember.clanId ||
        from.clanMember.clanId !== this.clanMember.clanId
      ) {
        this.bars.hp.value -= amount
        this.bars.healingChecking = 0
      }

      if (type !== 'absolute')
        this.gameServer.alivePlayers.forEach((otherPlayer) => {
          if (
            otherPlayer.online() &&
            universalWithin(this.point(), otherPlayer.camera.viewRect())
          ) {
            otherPlayer
              .socket()
              .emit('playerBodyEffect', [this.id(), 'attacked'])
          }
        })

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

  within(hitbox: UniversalHitbox): boolean {
    return universalWithin(hitbox, this.points)
  }

  get points() {
    return PLAYER_BODY_POINTS(this.point().clone())
  }

  get collision() {
    return { radius: PLAYER_BODY_COLLISION_RADIUS, point: this.point().clone() }
  }

  die() {
    if (this.died()) return
    this.bars.stop()
    // survived days
    const days = Math.floor(
      (Date.now() - (this.createdAt.getTime() || Date.now())) /
        1000 /
        GAME_DAY_SECONDS,
    )
    // registering in db
    DatabaseHandler.registerHighscore({
      beta: this.settings.beta(),
      name: this.name,
      sub: null,
      xp: this.lbMember.xp,
      days,
    })
    // ending in db
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
        this.staticItems.for(this.point()).removeDrop(drop.id)
      },
      take(player, data) {
        data.forEach((item) => {
          player.items.addable(item.id) &&
            player.items.addItem(item.id, item.quantity)
        })
      },
    })

    this.clanActions.leave()

    this.staticItems.for(this.point()).addDrop(crate)

    this.socket()?.emit('playerDied', [
      Transformer.toPlain(
        new PlayerInformationEntity({
          xp: this.lbMember.xp,
          days,
        }),
      ),
    ])
    this.lbMember.delete()
    this.staticItems.for('all').playerDied(this.uniqueId)
    this.died(true)
    this.gameServer.players.delete(this.uniqueId)
    this.gameServer.alivePlayers.delete(this.uniqueId)
    TokenChest.delete(this.token.current)
    this.socket().close()
    this.gameServer.checkLoop()
    CollectedIps.set(this.socket().ip, { createdAt: Date.now() })
  }

  makeMessage(content: string) {
    const message = new Message(content, this)
    if (!this.settings.chat()) return
    // sharing
    if (message.public()) {
      if (this.settings.invisibility())
        return this.serverMessage("You're not visible!")

      message.filter()
      const players = this.gameServer.alivePlayers
      this.socket().emit('playerMessage', [this.id(), message.content])
      players.forEach(
        (player) =>
          player.settings.chat() &&
          player.cache.get('otherPlayers', true).includes(this.id()) &&
          player.socket().emit('playerMessage', [this.id(), message.content]),
      )
    }
  }

  chatStatus(status: boolean) {
    this.settings.chat(status)
    this.serverMessage(`Chat is ${status ? 'enabled' : 'disabled'}`)
  }
}
