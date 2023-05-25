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

export class Player extends BasicPlayer<PlayerEvents> {
  range: number
  game: () => Game
  declare readonly actions: PlayerAction
  readonly toggle = new Toggle()
  private _speed: number
  declare readonly items: PlayerItems
  readonly bars: PlayerBars
  readonly camera: Camera
  readonly leaderboard: PlayerLeaderboard
  readonly controllers: PlayerControllers
  readonly miniMap: MiniMap

  constructor(props: ElementProps<PlayerProps>) {
    const { camera, dayInfo, game, ...basic } = props
    super({ ...basic })
    this.game = game
    this.items = new PlayerItems(this)
    this.actions = new PlayerAction(this)
    this.bars = new PlayerBars(this)
    this.miniMap = new MiniMap(this.layer2, this.game().map, this)
    this.leaderboard = new PlayerLeaderboard(this.layer2, this.miniMap)
    this.controllers = new PlayerControllers(this, dayInfo)
    this.camera = camera
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
    socket.emit("mouseAngle", [angle, this.theta])
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
      this.element().position(
        combineClasses(
          this.point,
          new Point(-(this.size.width / 2), -(this.size.height / 2))
        )
      )
      this.miniMap.update(this.point)
      this.highlight.position(this.point)
      this.messagesNode.position(this.point)
      this.body.position(new Point(this.size.width / 2, this.size.height / 2))
      this.cache.data.point = new Point(this.point)
      this.camera.update()
    }
    this.actions.clicking()
  }

  moveTo(point: Point) {
    point = new Point(point)
    this.point = point
  }

  registerEvents(): void {
    this.events.on("set.angle", (angle) => {
      this.setAngle(angle)
      this.layer
        .findOne("#item-range")
        .setAttr(
          "points",
          Converter.pointArrayToXYArray([
            this.point,
            getPointByTheta(
              this.point,
              this.theta,
              this.items.equiped ? this.items.equiped.range : 30
            ),
          ])
        )
    })
    this.events.on("keyboard.up", (evt) => {
      this.toggle.set(evt.code, false)
    })
    this.events.on("keyboard.down", (evt) => {
      if (evt.code === "KeyR") {
        this.bars.autofood(!this.bars.autofood())
        socket.emit("autofood", [NB.to(this.bars.autofood())])
        return
      }
      this.toggle.set(evt.code, true)
      const key = +evt.key
      if (!isNaN(key) && Math.round(key) > 0 && Math.round(key) < 10)
        this.items.click(Math.round(key) - 1)
    })
    this.events.on("request.click", (click) => {
      if (click) {
        if (this.items.settingModeItemId) {
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
    })
    socket.on("playerPosition", ([point, screen]) => {
      this.moveTo(point)
      this.camera.point.value = screen
    })
    socket.on("clicking", ([clicking, clickDuration]) => {
      this.actions.click.canClick = clicking
      this.actions.click.clickDuration = clickDuration
    })
    socket.on("setItemResponse", ([itemId]) => {
      if (itemId !== -1) this.items.setItemResponse()
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
  }
}
