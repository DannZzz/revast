import Konva from "konva"
import { BasicElement, ElementProps } from "../basic/element.basic"
import { Point, Size, combineClasses, isValidClass } from "../../global/init"
import { Toggle } from "../structures/toggle-options"
import { PlayerEvents, PlayerSkin, PlayerProps } from "../types/player.types"
import { PlayerAction } from "./player-action"
import { PlayerItems } from "./player-items"
import { PlayerBars } from "./player-bars"
import { Camera } from "../structures/Camera"
import { socket } from "../../socket/socket"
import { BasicPlayer } from "../basic/player.basic"
import { uuid } from "anytool"
import { PlayerLeaderboard } from "./player-leaderboard"
import { PlayerControllers } from "./player-controllers"
import { Game } from "../game"
import { MiniMap } from "../structures/MiniMap"
import { Converter } from "../structures/Converter"
import { getPointByTheta } from "../animations/rotation"
import { NB } from "../utils/NumberBoolean"
import { PlayerTimeout } from "./player-timeout"
import { PlayerJoinedDto } from "../../socket/events"
import { PlayerActionable } from "./player-actionable"
import { PlayerClans } from "./player-clans"

export class Player extends BasicPlayer<PlayerEvents> {
  range: number
  declare readonly actions: PlayerAction
  readonly toggle = new Toggle()
  private _speed: number
  declare readonly items: PlayerItems
  readonly bars: PlayerBars
  readonly camera: Camera
  readonly leaderboard: PlayerLeaderboard
  readonly controllers: PlayerControllers
  readonly miniMap: MiniMap
  readonly actionable: PlayerActionable
  timeout: PlayerTimeout
  chatStatus = true
  mouseSentTime: number = 0
  readonly clans: PlayerClans

  constructor(props: ElementProps<PlayerProps>) {
    const { camera, dayInfo, timeout, ...basic } = props
    super({ ...basic })
    this.clans = new PlayerClans(this)
    this.items = new PlayerItems(this)
    this.actions = new PlayerAction(this)
    this.actionable = new PlayerActionable(this.layer2, this.items)
    this.bars = new PlayerBars(this)
    this.miniMap = new MiniMap(this.layer2, this.game().map, this)
    this.leaderboard = new PlayerLeaderboard(this.layer2, this.miniMap)
    this.controllers = new PlayerControllers(this, dayInfo)
    this.camera = camera
    this.timeout = new PlayerTimeout(this.layer, this.layer2, timeout)
    this.draw()
  }

  moveToCenterOfScreen(size: Size) {
    const centerPoint = this.calculatePointForCentering(size)
    this.moveTo(centerPoint)
  }

  get speed() {
    return this._speed
  }

  get bodyCenterOnScreen() {
    return new Point(
      this.point.x - this.camera.point.value.x,
      this.point.y - this.camera.point.value.y
    )
  }

  bodyPositions(withPoint: Point = new Point(0, 0)) {
    const startPoint = combineClasses(
      new Point(this.point.x - 25, this.point.y - 25),
      withPoint
    )

    const size = new Size(50, 50)
    return {
      startPoint,
      corners: [
        startPoint,
        combineClasses(startPoint, new Point(size.width, size.height)),
      ] as [Point, Point],
      size,
    }
  }

  setAngle(angle: number) {
    this.angle = angle
    this.body.rotation(angle)
    if (this.mouseSentTime < Date.now()) {
      this.mouseSentTime = Date.now() + 100
      socket.emit("mouseAngle", [angle, this.theta])
    }
  }

  update() {
    const cachePoint = this.cache.get("point")
    const cacheCamerPoint = this.cache.get("screen")
    if (
      cachePoint?.x !== this.point.x ||
      cachePoint?.y !== this.point.y ||
      cacheCamerPoint?.x !== this.camera.point.value.x ||
      cacheCamerPoint?.y !== this.camera.point.value.y
    ) {
      this.running = true
      this.camera.update() //
      this.element().position(
        combineClasses(
          this.point,
          new Point(-(this.size.width / 2), -(this.size.height / 2))
        )
      )
      this.miniMap.update(this.point)
      this.messagesNode.position(this.point)
      this.cache.data.point = new Point(this.point)
      this.cache.data.screen = this.camera.point.value
    } else {
      this.running = false
    }
    this.actions.clicking()
  }

  moveTo(point: Point) {
    point = new Point(point)
    this.point = point
    this.items.updateGridSettingMode()
  }

  registerEvents(): void {
    this.events.on("set.angle", (angle) => {
      this.setAngle(angle)

      this.items.updateGridSettingMode()

      //   this.layer
      //     .findOne("#item-range")
      //     .setAttr(
      //       "points",
      //       Converter.pointArrayToXYArray([
      //         this.point,
      //         getPointByTheta(
      //           this.point,
      //           this.theta,
      //           this.items.equiped ? this.items.equiped.range : 30
      //         ),
      //       ])
      //     )
    })
    this.events.on("keyboard.up", (evt) => {
      this.toggle.set(evt.code, false)
    })
    this.events.on("keyboard.down", (evt) => {
      if (evt.code === "KeyR") {
        this.bars.autofood(!this.bars.autofood())
        socket.emit("autofood", [NB.to(this.bars.autofood())])
        return
      } else if (evt.code === "KeyO") {
        this.chatStatus = !this.chatStatus
        socket.emit("requestChatStatus", [NB.to(this.chatStatus)])
        return
      }
      this.toggle.set(evt.code, true)
      const key = +evt.key
      if (!isNaN(key) && Math.round(key) > 0 && Math.round(key) < 10)
        this.items.click(Math.round(key) - 1)
    })
    this.events.on("request.click", (click) => {
      if (click) {
        if (this.items.settingMode.id) {
          this.items.setItemRequest()
          this.toggle.set("clicking", false)
          return
        }
      }
      this.toggle.set("clicking", click)
    })
    this.events.on("screen.resize", (size) => {
      this.items.resize()
      this.controllers.resize()
      this.leaderboard.resize()
      this.bars.resize()
      this.miniMap.resize()
      this.actionable.resize()
      this.clans.resize()
    })
    socket.on("playerPosition", ([point, screen]) => {
      this.camera.point.value = screen
      this.moveTo(point)
    })
    socket.on("clicking", ([clicking, clickDuration]) => {
      this.actions.click.canClick = clicking
      this.actions.click.clickDuration = clickDuration
    })
    socket.on("setItemResponse", ([itemId, timeout]) => {
      if (itemId !== -1) {
        this.items.setItemResponse()
        if (NB.from(timeout)) {
          this.timeout.try("building")
        }
      }
    })
    socket.on("playerMessage", ([playerId, content]) => {
      if (playerId === this.id()) {
        this.messages.addMessage(content)
      } else {
        this.game()
          .otherPlayers.find((p) => p.id() === playerId)
          ?.messages.addMessage(content)
      }
    })
    socket.on("icons", (icons) => {
      this.takeIcons(icons)
    })
  }
}
