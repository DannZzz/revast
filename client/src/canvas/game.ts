import { Layer } from "konva/lib/Layer"
import { Player } from "./player/player"
import Konva from "konva"
import { Point, Size } from "../global/init"
import { EventEmitter } from "./utils/EventEmitter"
import { GameEvents, GameProps, JoinPlayer } from "./types/game.types"
import { getAngle, getPointByTheta } from "./animations/rotation"
import { NodeConfig, Node } from "konva/lib/Node"
import { Camera } from "./structures/Camera"
import { socket } from "../socket/socket"
import { Bio } from "./basic/bio-item.basic"
import { Group } from "konva/lib/Group"
import { animateTo } from "./animations/to"
import { StaticItemsAddons } from "./data/staticItemAddons"
import { DropDto, MapDto, MobDto, VisualPlayerData } from "../socket/events"
import { BasicPlayer } from "./basic/player.basic"
import { StaticSettableItem } from "./basic/static-item.basic"
import { StaticItems } from "./structures/StaticItems"
import { NB } from "./utils/NumberBoolean"
import { BG_FOREST_BIOM, zIndexOf } from "../constants"
import { loadImage } from "./structures/fetchImages"
import { GameMap } from "./structures/GameMap"
import { BasicMob } from "./basic/mob.basic"
import { BasicDrop } from "./basic/drop.basic"
import { KonvaText } from "./structures/KonvaText"
import { GameAttr } from "./game-attr"
import { BasicMisc } from "./basic/misc.basic"
import { Global } from "aeolz/lib/lib/Global"
import {
  BioTemplate,
  DropTemplate,
  MiscTemplate,
  MobTemplate,
  StaticSettableTemplate,
  VisualPlayerTemplate,
} from "../data-templates/teamplates"
import { PlayerGraphics } from "./types/player.types"
import { CompactItem } from "../api/type"

export class Game {
  layer: Layer
  settings: { graphics: PlayerGraphics }
  player: Player
  readonly events = new EventEmitter<GameEvents>()
  staticItems: StaticItems = new StaticItems()
  mobs: BasicMob[] = []
  items: CompactItem[] = []
  camera: Camera
  map: MapDto
  ended = false
  layer2: Layer
  otherPlayers: BasicPlayer[] = []
  private playerQueue: JoinPlayer[] = []
  private serverMessageNode: Konva.Text
  private serverMessageTimeout: any
  private resizeCd: any
  private nightNode: Konva.Rect

  init(props: GameProps) {
    this.layer = props.layer
    this.layer2 = props.layer2
    this.registerEvents()
    this.playerQueue.forEach((jp) => this.joinPlayer(jp))
    this.playerQueue = []
  }

  resize(size: Size) {
    clearTimeout(this.resizeCd)
    this.resizeCd = setTimeout(() => {
      this.layer.getStage()?.size(size)
      this.layer2?.findOne("#game-night")?.size(size).cache()
      socket?.emit("screenSize", [size])
      if (this.player) this.player.events.emit("screen.resize", size)
    }, 1000)
  }

  setSettings(settings: Game["settings"]) {
    if (settings.graphics !== this.settings.graphics) {
      this.settings.graphics = settings.graphics
      this.player?.actions?.running()
      this.mobs.forEach((mob) => mob.animation())
    }
  }

  joinPlayer(playerData: JoinPlayer) {
    if (!this.layer && !this.layer2) {
      this.playerQueue.push(playerData)
    } else {
      this.ended = false
      this.settings = { graphics: PlayerGraphics.high }
      let graphics = +localStorage.getItem("graphics")
      if (
        typeof graphics !== "number" ||
        PlayerGraphics.low > Math.floor(graphics) ||
        PlayerGraphics.high < Math.floor(graphics)
      ) {
        graphics = PlayerGraphics.high
      } else {
        graphics = Math.floor(graphics)
      }
      localStorage.setItem("graphics", "" + graphics)
      this.settings.graphics = graphics
      this.registerSockets()
      this.updateLoop()
      socket.emit("joinServer", [
        {
          skin: playerData.skin,
          recaptcha_token: playerData.recaptcha_token,
          name: playerData.name,
          screen: this.size,
          token: playerData.token,
          settings: {
            graphics,
          },
        },
      ])
    }
  }

  get size() {
    const layer = this.layer.getStage().size()
    return new Size(layer.width, layer.height)
  }

  draw() {
    const mainGroup = new Konva.Group({ id: "game-group", listening: false })
    const gameBg = GameMap.draw(this.map, {
      id: "game-bg",
      perfectDrawEnabled: false,
      listening: false,
    })

    const gameAttr = new Konva.Group({ id: "game-attr" })
    const miscsGroup1 = new Konva.Group({ id: "game-misc-1" })
    const itemsGroup = new Konva.Group({ id: "game-settable" })
    const itemsGroup1 = new Konva.Group({ id: "game-settable+1" })
    const itemsGroup_1 = new Konva.Group({ id: "game-settable-1" })
    const itemsGroup_2 = new Konva.Group({ id: "game-settable-2" })
    const itemsGroup_3 = new Konva.Group({ id: "game-settable-3" })
    const itemsGroup_4 = new Konva.Group({ id: "game-settable-4" })
    const itemsGroup_5 = new Konva.Group({ id: "game-settable-5" })
    const itemsGroup_6 = new Konva.Group({ id: "game-settable-6" })
    const mobGroup = new Konva.Group({ id: "game-mobs" })
    const bioGroup = new Konva.Group({ id: "game-bios" })
    const playersGroup = new Konva.Group({ id: "game-players" })
    const highlights = new Konva.Group({ id: "highlights", listening: false })
    const messages = new Konva.Group({ id: "messages" })
    const alwaysTop = new Konva.Group({ id: "always-top" })
    mainGroup.add(
      gameBg,
      miscsGroup1,
      gameAttr,
      itemsGroup_6,
      itemsGroup_5,
      itemsGroup_4,
      itemsGroup_3,
      itemsGroup_2,
      itemsGroup_1,
      playersGroup,
      mobGroup,
      itemsGroup,
      itemsGroup1,
      bioGroup,
      messages
    )

    this.layer.add(mainGroup)
    this.layer2.add(highlights, alwaysTop)
    alwaysTop.zIndex(2)
  }

  dayNight(day: boolean) {
    const node = new Konva.Rect({
      id: "game-night",
      ...this.size,
      opacity: 0,
      fill: BG_FOREST_BIOM.night,
      listening: false,
    })

    if (day) {
      if (this.nightNode) {
        this.nightNode.to({
          opacity: 0,
          duration: 3,
          onFinish: () => {
            this.nightNode.destroy()
            this.nightNode = null
          },
        })
      } else {
        this.nightNode = null
      }
    } else {
      if (this.nightNode) this.nightNode?.destroy()
      this.nightNode = node
      Game.createAlwaysTop(this.layer2, this.nightNode)
      this.nightNode.moveToBottom()
      this.nightNode.to({
        duration: 3,
        opacity: 1,
        onFinish: () => this.nightNode.cache(),
      })
    }
  }

  get highGraphics() {
    return this.settings.graphics === PlayerGraphics.high
  }

  showServerMessage(txt: string) {
    const animationAllowed = this.highGraphics
    clearTimeout(this.serverMessageTimeout)
    this.serverMessageNode?.destroy?.()
    this.serverMessageNode = new KonvaText({
      text: txt,
      opacity: animationAllowed ? 0 : 1,
      width: this.size.width,
      align: "center",
      y: 101,
      stroke: "black",
      strokeWidth: 0.5,
      listening: false,
      fill: "white",
      fontSize: 30,
    })

    Game.createAlwaysTop(this.layer2, this.serverMessageNode)
    animationAllowed && this.serverMessageNode.to({ opacity: 1, duration: 1 })
    this.serverMessageTimeout = setTimeout(() => {
      if (animationAllowed) {
        this.serverMessageNode.to({
          opacity: 0,
          duration: 1,
          onFinish: () => {
            this.serverMessageNode.destroy()
            this.serverMessageNode = null
          },
        })
      } else {
        this.serverMessageNode.destroy()
        this.serverMessageNode = null
      }
      clearTimeout(this.serverMessageTimeout)
    }, 5000)
  }

  drawStaticBios(bios: Bio[], toRemoveIds: string[]) {
    const group = this.layer.findOne("#game-bios") as Group
    bios.forEach((bio) => bio.take(this.layer).draw(group))
    this.staticItems.bio = this.staticItems.bio.filter((bio) => {
      const res = !toRemoveIds.includes(bio.id)
      if (res) return true
      bio.destroy()
      return false
    })
    this.staticItems.addBios(...bios)
  }

  drawStaticSettables(settables: StaticSettableItem[], toRemoveIds: string[]) {
    settables.forEach((settable) =>
      settable.take(this.layer, this.layer2).draw()
    )
    this.staticItems.settable = this.staticItems.settable.filter((settable) => {
      const res = !toRemoveIds.includes(settable.id)
      if (res) return true
      settable.destroy()
      return false
    })
    this.staticItems.addSettables(...settables)
  }

  drawDrops(drops: BasicDrop[], toRemoveIds: string[]) {
    drops.forEach((drop) => drop.take(this.layer, this.layer2).draw())
    this.staticItems.drops = this.staticItems.drops.filter((drop) => {
      const res = !toRemoveIds.includes(drop.id)
      if (res) return true
      drop.destroy()
      return false
    })
    this.staticItems.addDrop(...drops)
  }

  drawMiscs(miscs: BasicMisc[], toRemoveIds: string[]) {
    miscs.forEach((misc) => misc.take(this.layer, this.layer2).draw())
    this.staticItems.miscs = this.staticItems.miscs.filter((misc) => {
      const res = !toRemoveIds.includes(misc.id)
      if (res) return true
      misc.destroy()
      return false
    })
    this.staticItems.addMisc(...miscs)
  }

  drawOtherPlayers(players: VisualPlayerData[], toRemoveIds: string[]) {
    this.otherPlayers = this.otherPlayers.filter((op) => {
      if (toRemoveIds.includes(op.id())) {
        op.destroy()
        return false
      }
      return true
    })
    players.forEach((playerData) => {
      const existIndex = this.otherPlayers.findIndex(
        (pl) => pl.id() === playerData.id
      )
      if (existIndex !== -1) {
        this.otherPlayers[existIndex].point = playerData.point
        this.otherPlayers[existIndex].angle = playerData.rotation
        this.otherPlayers[existIndex].actions.click.canClick =
          playerData.clicking.status
        this.otherPlayers[existIndex].actions.click.clickDuration =
          playerData.clicking.duration
        this.otherPlayers[existIndex].items.equiped = playerData.equipment
        this.otherPlayers[existIndex].items.weared = playerData.wearing
        this.otherPlayers[existIndex].items.bagUrl = playerData.bagUrl
        this.otherPlayers[existIndex].takeIcons(playerData.icons)
      } else {
        const {
          rotation,
          clicking,
          equipment,
          wearing,
          bagUrl,
          ...otherProps
        } = playerData
        const player = new BasicPlayer({
          ...otherProps,
          layer2: this.layer2,
          layer: this.layer,
          angle: rotation,
          game: () => this,
        })
        player.draw()
        player.items.equiped = equipment
        player.items.weared = wearing
        player.items.bagUrl = bagUrl
        player.actions.click.canClick = clicking.status
        player.actions.click.clickDuration = clicking.duration
        this.otherPlayers.push(player)
      }
    })
  }

  drawMobs(mobs: MobDto[], toRemoveIds: string[]) {
    this.mobs = this.mobs.filter((op) => {
      if (toRemoveIds.includes(op.id)) {
        op.destroy()
        return false
      }
      return true
    })
    mobs.forEach((mob) => {
      const mobExistsIndex = this.mobs.findIndex((tMob) => tMob.id === mob.id)
      if (mobExistsIndex !== -1) {
        this.mobs[mobExistsIndex].point = mob.point
        this.mobs[mobExistsIndex].angle = mob.angle
      } else {
        const createdMob = new BasicMob(mob)
        createdMob.game = this
        createdMob.draw(this.layer.findOne(`#game-mobs`) as any)
        this.mobs.push(createdMob)
      }
    })
  }

  private registerEvents() {
    this.events.on("player.mouse-move", (point) => {
      if (!this.player) return
      const angle = getAngle(this.player.bodyCenterOnScreen, point)
      this.player.theta = angle
      this.player.cursor = point
      this.player.events.emit("set.angle", (angle / Math.PI) * 180 - 90)
    })

    this.events.on("keyboard.up", (evt) => {
      if (!this.player) return
      this.player.events.emit("keyboard.up", evt)
    })

    this.events.on("keyboard.down", (evt) => {
      if (!this.player) return
      this.player.events.emit("keyboard.down", evt)
    })

    this.events.on("mouse.down", (eventObject) => {
      if (noClick(eventObject.target)) return
      if (!this.player) return
      this.player.events.emit("request.click", true)
    })

    this.events.on("mouse.up", (eventObject) => {
      if (!this.player) return
      this.player.events.emit("request.click", false)
    })
    this.events.on("screen.resize", (size) => {
      this.resize(size)
    })
    this.events.on("dropItem.response", (itemId, all) => {
      this.player?.items.dropItem(itemId, all)
    })
  }

  registerSockets() {
    socket.on("joinServer", ([data]) => {
      this.map = data.map
      this.draw()
      this.camera = new Camera(new Point(0, 0), [
        this.layer.findOne("#game-group"),
        this.layer2.findOne("#highlights"),
      ])

      this.camera.point.value = data.screen
      const player = new Player({
        layer: this.layer,
        layer2: this.layer2,
        skin: data.skin,
        name: data.name,
        camera: this.camera,
        point: new Point(0, 0),
        id: data.id,
        dayInfo: data.dayInfo,
        game: () => this,
        timeout: data.timeout,
        icons: data.icons,
      })
      // player.moveToCenterOfScreen(this.size)
      this.player = player
      this.player.point = new Point(data.player.point.x, data.player.point.y)
      this.dayNight(NB.from(data.dayInfo.isDay))
      localStorage.setItem("_", data.token)

      this.events.emit("loaded")
    })

    socket.on("staticBios", ([bios, toRemoveIds]) => {
      this.drawStaticBios(
        bios.map((bio) => new Bio(BioTemplate.toObject(bio))),
        toRemoveIds
      )
    })

    socket.on("miscs", ([miscs, toRemoveIds]) => {
      this.drawMiscs(
        miscs.map((misc) => new BasicMisc(MiscTemplate.toObject(misc))),
        toRemoveIds
      )
    })

    socket.on("staticSettables", ([settables, toRemodIds]) => {
      this.drawStaticSettables(
        settables.map(
          (dto) => new StaticSettableItem(StaticSettableTemplate.toObject(dto))
        ),
        toRemodIds
      )
    })

    socket.on("mobAttacked", ([mobId]) => {
      const mob = this.mobs.find((mob) => mob.id === mobId)
      if (!mob) return
      mob.hurt()
    })

    socket.on("dropAttacked", ([dropId]) => {
      const drop = this.staticItems.drops.find((drop) => drop.id === dropId)
      if (!drop) return
      drop.hurt()
    })

    socket.on("staticItemAttacked", (items) => {
      this.staticItems.all.forEach((staticItem) => {
        const item = items.find((it) => it[0] == staticItem.id)
        if (!item) return
        staticItem.getAttacked(item[1], item[2])
      })
      // const all = this.staticItems.all
      // const _ = items.map((it) => ({
      //   data: it,
      //   node: all.find((si) => si.id === it[0]),
      // }))
      // const gr = new Group().add(..._.map((d) => d.node.node))
      // animateTo(gr, { duration: 0.2, to: { points: [new Point(10, 0)] } })
    })

    socket.on("staticItemMode", ([itemId, mode]) => {
      const item = this.staticItems.settable.find((item) => item.id === itemId)
      if (typeof mode === "number" && "tryMode" in item) item.tryMode(mode)
    })

    socket.on("staticItemMiscellaneous", ([bioId, currentResources, type]) => {
      const bio = this.staticItems.all.find((item) => item.id === bioId)
      if (!bio) return
      StaticItemsAddons[type].drawByResourceChange(bio, currentResources)
    })

    socket.on("dynamicItems", ([otherPlayers, mobs]) => {
      // console.log(typeof otherPlayers, otherPlayers?.players?.length, "plg")
      if (otherPlayers) {
        this.drawOtherPlayers(
          otherPlayers.players.map((template) =>
            VisualPlayerTemplate.toObject(template as any)
          ),
          otherPlayers.toRemoveIds
        )
      }
      if (mobs) {
        this.drawMobs(
          mobs.mobs.map((template) => MobTemplate.toObject(template)),
          mobs.toRemoveIds
        )
      }
    })

    socket.on("drops", ([drops, toRemoveIds]) => {
      this.drawDrops(
        drops.map((drop) => new BasicDrop(DropTemplate.toObject(drop))),
        toRemoveIds
      )
    })

    socket.on("playerBodyEffect", ([playerId, effectType]) => {
      let node: Node
      if (playerId === this.player.id()) {
        this.player.bodyEffect(effectType)
      } else {
        const player = this.otherPlayers.find(
          (player) => player.id() === playerId
        )
        player?.bodyEffect(effectType)
      }
    })

    socket.on("day", ([nb]) => {
      this.dayNight(NB.from(nb))
      this.player?.controllers.arrow.rotation(NB.from(nb) ? -90 : 90)
    })

    socket.on("serverMessage", ([content]) => {
      this.showServerMessage(content)
    })

    socket.on("walkEffect", ([effect, x, y, angle, playerId]) => {
      const player: BasicPlayer =
        playerId === this.player.id()
          ? this.player
          : this.otherPlayers.find((p) => p.id() == playerId)
      if (!player) return
      GameAttr.walkEffect(
        this.layer,
        effect,
        new Point(x, y),
        angle,
        (player.footPrint = !player.footPrint)
      )
    })
  }

  end() {
    this.ended = true
    this.player.destroy()
    this.player = null
    this.staticItems.bio = []
    this.staticItems.settable.forEach((settable) => settable.destroy())
    this.staticItems.settable = []
    this.otherPlayers.forEach((pl) => pl.destroy())
    this.otherPlayers = []
    this.mobs.forEach((mob) => mob.destroy())
    this.mobs = []
    this.camera = null
    this.map = null
    this.layer.destroyChildren()
    this.layer2.destroyChildren()
    // this.events.clearListeners()
  }

  private updateLoop() {
    if (this.ended) return
    this.player?.update()
    this.otherPlayers.forEach((player) => player.update(true, true, true))
    this.mobs.forEach((mob) => mob.update())
    requestAnimationFrame(this.updateLoop.bind(this))
  }

  static settableHoistId(cover: number) {
    switch (cover) {
      case 1:
        return "#game-settable"

      case 0:
        return "#game-settable-2"

      case -1:
        return "#game-settable-3"

      case -2:
        return "#game-settable-4"

      case -3:
        return "#game-settable-5"

      case -4:
        return "#game-settable-6"

      default:
        return "#game-settable"
    }
  }

  static groupAdd(layer: Konva.Layer, id: string, ...shapes: any[]) {
    ;(layer.findOne(id) as Group).add(...shapes)
  }

  static createHighlight(layer2: Layer, ...shapes: any[]) {
    shapes.forEach((shape) => shape?.listening(false).cache())
    // ;(layer2.findOne("#highlights") as Group).add(...shapes)
  }
  static createAbsoluteHighlight(layer2: Layer, ...shapes: any[]) {
    shapes.forEach((shape) => shape?.listening(false))
    // layer2.add(...shapes)
  }
  static createAlwaysTop(layer2: Layer, ...shapes: any[]) {
    ;(layer2.findOne("#always-top") as Group).add(...shapes)
  }
  static createMessageGroup(layer: Layer, ...shapes: any[]) {
    ;(layer.findOne("#messages") as Group).add(...shapes)
  }
}

function noClick(node: Node<NodeConfig>): boolean {
  return node.name() == "no-click" || node.getParent()?.name() === "no-click"
}
