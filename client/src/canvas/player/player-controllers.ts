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
      image: loadImage("images/day-night.png", (img) => timerBg.image(img)),
      width: 100,
      height: 100,
    })
    const timerArrow = new Konva.Image({
      image: loadImage("images/day-night-arrow.png", (img) =>
        timerArrow.image(img)
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
    })
    this.arrow = timerArrow

    timerGroup.add(timerBg, timerArrow)
    timerGroup.listening(false)

    this.autofood = new Konva.Image({
      image: loadImage("images/auto-food.png", (img) =>
        this.autofood.image(img)
      ),
      height: 100,
      width: 100,
      x: 100,
      y: 100,
      visible: false,
    })
    this.autofood.listening(false)
    this.player.bars.autofood.onChange((val) => {
      this.autofood.visible(val)
    })
    this.controllersGroup.add(timerGroup, this.autofood)
    Game.createAlwaysTop(this.player.layer2, this.controllersGroup)
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
