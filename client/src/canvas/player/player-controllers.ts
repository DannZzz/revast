import Konva from "konva"
import { Player } from "./player"
import { Point, Size } from "../../global/init"
import { loadImage } from "../structures/fetchImages"
import { SERVER_ASSET } from "../../constants"
import { Game } from "../game"
import { percentFrom, percentOf } from "../utils/percentage"
import { DayInfo } from "../../socket/events"

export class PlayerControllers {
  readonly containerSize = new Size(200, 150)
  private arrow: Konva.Image
  private controllersGroup: Konva.Group
  private autofood: Konva.Image
  private lastSentCraftOpen = 0

  constructor(readonly player: Player, readonly dayInfo: DayInfo) {
    this.draw()
    this.createInterval()
  }

  private position() {
    return new Point(
      this.player.layer.getStage().width() -
        this.player.leaderboard.size.width -
        this.containerSize.width -
        20,
      15
    )
  }

  draw() {
    this.controllersGroup = new Konva.Group({
      ...this.containerSize,
      ...this.position(),
    })

    const timerGroup = new Konva.Group({ x: this.containerSize.width - 100 })
    const timerBg = new Konva.Image({
      image: loadImage("images/day-night.png", (img) =>
        timerBg.image(img).cache()
      ),
      width: 100,
      height: 100,
    }).cache()
    const timerArrow = new Konva.Image({
      image: loadImage("images/day-night-arrow.png", (img) =>
        timerArrow.image(img).cache()
      ),
      width: 50,
      height: 16,
      x: 50,
      y: 50,
      // offsetX: 25,
      offsetY: 8,
      rotation:
        percentOf(
          percentFrom(this.dayInfo.thisDay, this.dayInfo.oneDayDuration),
          360
        ) - 90,
    }).cache()
    this.arrow = timerArrow

    timerGroup.add(timerBg, timerArrow)
    timerGroup.listening(false)

    this.autofood = new Konva.Image({
      image: loadImage("images/auto-food.png", (img) =>
        this.autofood.image(img).cache()
      ),
      height: 100,
      width: 100,
      x: 100,
      y: 100,
      visible: false,
    }).cache()
    this.autofood.listening(false)
    this.player.bars.autofood.onChange((val) => {
      this.autofood.visible(val)
    })

    const craftBook = new Konva.Image({
      image: loadImage("/images/craft-book.png", (img) => {
        craftBook.image(img).cache()
      }),
      height: 100,
      width: 100,
    }).cache()
    const craftGroup = new Konva.Group({
      name: "no-click",
    })
    craftGroup.add(craftBook)

    this.controllersGroup.add(timerGroup, this.autofood, craftGroup)
    Game.createAlwaysTop(this.player.layer2, this.controllersGroup)
    craftGroup.on("pointerclick", () => {
      if (this.lastSentCraftOpen > Date.now()) return
      this.lastSentCraftOpen = Date.now() + 1500
      this.player.game().events.emit("craft-book")
    })
  }

  resize() {
    this.controllersGroup.position(this.position())
  }

  createInterval() {
    const period = 0.5
    const oneDay = this.dayInfo.oneDayDuration
    setInterval(() => {
      this.arrow.rotate((360 / oneDay) * period)
    }, period * 1000)
  }
}
