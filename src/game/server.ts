import BasicMap from '../maps/maps-json/main.json'
import { Chest } from 'anytool/dist/Chest'
import { Player } from './player/player'
import { interval } from 'rxjs'
import {
  PLAYER_NAME_MAX_SIZE,
  PLAYER_BODY_SIZE,
  PLAYER_BODY_POINTS,
  GAME_DAY_SECONDS,
} from 'src/constant'
import { Mobs } from 'src/data/mobs'
import { JoinPlayerDto } from 'src/dto/join-player.dto'
import { LeaderboardMemberEntity } from 'src/entities/leaderboard-member.entity'
import { Point, Size } from 'src/global/global'
import { GameDay } from 'src/structures/GameDay'
import { GameMap, Biome } from 'src/structures/GameMap'
import { StaticItems } from 'src/structures/StaticItems'
import { Uptime } from 'src/structures/Uptime'
import { Leaderboard } from 'src/structures/leaderboard/Leaderboard'
import { Token } from 'src/structures/tokens/Token'
import {
  TokenChest,
  newPlayerLogin,
  tokenDataBySocketId,
} from 'src/structures/tokens/token-chest'
import { NB } from 'src/utils/NumberBoolean'
import { MainServer } from 'src/ws/events/events'
import { bioItemByMapId } from 'src/data/bio'
import { BasicMath } from 'src/utils/math'
import { StaticItemsHandler } from 'src/structures/StaticItemsHandler'

export type TMap = typeof BasicMap

export interface GameProps {
  readonly information: { name: string }
  readonly socketServer: MainServer
  madeAt?: Date
  mapItems?: () => TMap
  map: GameMap
  initMobs: (game: GameServer) => Mobs
}

export type Players = Chest<number, Player>

export class GameServer implements GameProps {
  initMobs: (game: GameServer) => Mobs
  mapItems: () => TMap = () => BasicMap
  madeAt: Date = new Date()
  map: GameMap
  readonly socketServer: MainServer
  readonly information: any = {}
  readonly mapSource: string
  readonly players = new Chest<number, Player>()
  readonly alivePlayers = new Chest<number, Player>()
  readonly staticItems: StaticItemsHandler = new StaticItemsHandler()
  private _gameLoopInterval: any
  private _gameFPS = 60
  _lastFrame: number = Date.now()
  private _FPSInterval = 30
  readonly leaderboard = new Leaderboard()
  lastFrameDelta: number = 0
  readonly day: GameDay
  mobs: Mobs

  constructor(options: GameProps) {
    Object.assign(this, options)
    //
    this.staticItems.init(this.map)
    this.mapItems().layers[0].data.forEach((mapId, i) => {
      if (mapId) {
        // console.log(mapId)
        const bio = bioItemByMapId(
          mapId,
          BasicMath.xy(i, this.map.size, this.map.tileSize),
        )
        if (!bio) return
        bio.players = this.alivePlayers
        this.staticItems.for(this.map.areaOf(bio.universalHitbox)).addBios(bio)
      }
    })
    this.day = new GameDay(this.madeAt)
    this.updateLeaderboard()
    this.updateDayAndNight()
    this.mobs = this.initMobs(this)
  }

  get uptime(): Uptime {
    return new Uptime(this.madeAt)
  }

  joinPlayer(details: JoinPlayerDto & { socketId: string }) {
    const { socketId, name, screen, token } = details
    if (token && TokenChest.has(token)) {
      const tokenData = TokenChest.get(token)
      if (this.alivePlayers.has(tokenData.playerId)) {
        tokenData.currentSocketId = socketId
        const player = this.players.get(tokenData.playerId)
        // console.log(player.cache.data)
        player.socketRegistering()
        this.checkLoop()
        return
      }
    }

    const newToken = Token()
    const login = newPlayerLogin(newToken.current, {
      playerId: this.notBusyPlayerId(),
      serverInfo: this.information,
      currentSocketId: socketId,
    })

    const player = new Player({
      name: name.slice(0, PLAYER_NAME_MAX_SIZE),
      token: newToken,
      uniqueId: login.playerId,
      point: new Point(),
      size: PLAYER_BODY_SIZE,
      gameServer: this,
      lbMember: this.leaderboard.addMember(login.playerId),
      cameraOptions: {
        size: screen,
        map: this.map.absoluteSize,
      },
    })
    this.players.set(login.playerId, player)
    this.alivePlayers.set(login.playerId, player)

    this.checkLoop()
    player.moveTo(this.randomEmptyPoint(35))
  }

  to(socketId: string): Player {
    return this.alivePlayers.get(tokenDataBySocketId(socketId)?.playerId)
  }

  disconnectPlayer(socketId: string) {
    const playerId = tokenDataBySocketId(socketId)?.playerId
    if (!playerId || !this.players.has(playerId)) return
    // console.log('disconnecting', playerId)
    this.players.get(playerId).disconnect()
    // this.players.delete(playerId)
    this.checkLoop()
  }

  randomEmptyPoint(forObjectRadius: number): Point
  randomEmptyPoint(forObjectRadius: number, point: Point, size: Size): Point
  randomEmptyPoint(
    forObjectRadius: number,
    startPoint?: Point,
    size?: Size,
  ): Point {
    const forest =
      startPoint && size
        ? { size, point: startPoint }
        : this.map.absoluteBiome('forest')
    let randomPoint = () =>
      new Point(
        +$.randomNumber(forest.point.x, forest.point.x + forest.size.width),
        +$.randomNumber(forest.point.y, forest.point.y + forest.size.height),
      )
    let point = randomPoint()
    const items = this.staticItems.for({ radius: forObjectRadius, point })
    while (items.someWithin({ radius: forObjectRadius, point })) {
      point = randomPoint()
    }
    return point
  }

  notBusyPlayerId() {
    let i = this.players.size + 1
    while (this.players.has(i)) i++
    return i
  }

  checkLoop() {
    const players = this.alivePlayers.filter((player) => player.online())
    const size = players.size
    if (size === 0) {
      clearInterval(this._gameLoopInterval)
      this._gameLoopInterval = null
    } else {
      this._gameLoopInterval = 1
      const loop = () => {
        if (!this._gameLoopInterval) return
        var now = Date.now()
        if (this._lastFrame + this._FPSInterval <= now) {
          var delta = (now - this._lastFrame) / 1000
          this._lastFrame = now

          this.gameLoop(delta)
        }

        if (Date.now() - this._lastFrame < this._FPSInterval - 16) {
          setTimeout(loop)
        } else {
          setImmediate(loop)
        }
      }

      loop()
    }
  }

  private gameLoop(delta: number) {
    this.lastFrameDelta = delta
    const alivePlayersAsArray = [...this.alivePlayers.values()]
    alivePlayersAsArray.forEach(
      (player) => player.online() && player.loop.action(),
    )
    this.mobs.all.forEach(
      (mob) => !mob.died && mob?.action(alivePlayersAsArray, this.map, delta),
    )
  }

  updateLeaderboard() {
    const updateFunction = () => {
      if (this.alivePlayers.size === 0) return
      const members = this.leaderboard.generate()
      const membersFiltered = members.map(
        (lb) =>
          new LeaderboardMemberEntity({
            name: this.alivePlayers.get(lb.key as number).name,
            xp: lb.xp,
          }),
      )
      this.alivePlayers.forEach((player) => {
        if (player.online())
          player
            .socket()
            .emit('leaderboard', [
              membersFiltered,
              player.lbMember.xp,
              !!members.find((lb) => lb.key === player.uniqueId),
              player.kills(),
            ])
      })
    }

    interval(1000).subscribe(updateFunction)
  }

  updateDayAndNight() {
    interval((GAME_DAY_SECONDS / 2) * 1000).subscribe(() => {
      this.alivePlayers.forEach(
        (player) =>
          player.online() &&
          player.socket().emit('day', [NB.to(this.day.isDay())]),
      )
    })

    interval(500).subscribe(() => {
      this.alivePlayers.forEach((player) => {
        if (player.online()) {
          const days = Math.floor(
            (Date.now() - (player.createdAt.getTime() || Date.now())) /
              1000 /
              GAME_DAY_SECONDS,
          )
          if (player.cache.get('lastSentDay') !== days) {
            player
              .socket()
              .emit('serverMessage', [
                `You have survived ${days} day${days !== 1 ? 's' : ''}!`,
              ])
            player.cache.data.lastSentDay = days
          }
        }
      })
    })
  }

  get dynamicItems() {
    const players = this.alivePlayers
    return players
  }
}
