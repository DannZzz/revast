import Konva from "konva"
import { Player } from "./player"
import { Point, Size } from "../../global/init"
import { loadImage } from "../structures/fetchImages"
import { SERVER_ASSET } from "../../constants"
import { Game } from "../game"
import { percentFrom, percentOf } from "../utils/percentage"
import { DayInfo } from "../../socket/events"
import { KonvaText } from "../structures/KonvaText"

export class PlayerControllers {
  readonly containerSize = new Size(140, 115)
  arrow: Konva.Image
  private controllersGroup: Konva.Group
  private autofood: Konva.Image
  private lastSentCraftOpen = 0
  private lastSentMarketOpen = 0
  private gap = 5

  constructor(readonly player: Player, readonly dayInfo: DayInfo) {
    this.draw()
    this.createInterval()
  }

  private position() {
    return new Point(
      this.player.layer.getStage().width() -
        this.player.leaderboard.size.width -
        this.containerSize.width -
        5,
      15
    )
  }

  draw() {
    this.controllersGroup = new Konva.Group({
      ...this.containerSize,
      ...this.position(),
    })

    const iconSize = new Size(60, 60)

    const timerGroup = new Konva.Group({
      x: iconSize.width + this.gap,
    })
    const timerBg = new Konva.Image({
      image: loadImage("images/clock.png", (img) => timerBg.image(img).cache()),
      width: iconSize.width,
      height: iconSize.height,
    }).cache()
    const timerArrow = new Konva.Image({
      image: loadImage("images/clock-arrow.png", (img) =>
        timerArrow.image(img).cache()
      ),
      width: iconSize.width,
      height: iconSize.height,
      x: iconSize.width / 2,
      y: iconSize.height / 2,
      // offsetX: 25,
      offset: {
        x: iconSize.width / 2,
        y: iconSize.height / 2,
      },
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
      image: loadImage("images/auto-feed.png", (img) =>
        this.autofood.image(img).cache()
      ),
      height: iconSize.height,
      width: iconSize.width,
      listening: false,
    }).cache()

    this.player.bars.autofood.onChange((val) => {
      if (val) {
        this.controllersGroup.add(this.autofood)
      } else {
        this.autofood.destroy()
      }
    })
    const currentBandages = this.player.bars.bandageEffect()
    const bandageEffectGroup = new Konva.Group({
      y: iconSize.height + this.gap,
      listening: false,
      opacity: currentBandages > 0 ? 1 : 0,
    })
    const bandageEffectIcon = new Konva.Image({
      image: loadImage("/images/bandage-activated.png", (img) => {
        bandageEffectIcon.image(img)
        bandageEffectGroup.cache()
      }),
      ...iconSize,
    })
    const bandageEffectCount = new KonvaText({
      text: `${currentBandages}`,
      fill: "#eee",
      fontSize: 20,
      // lineHeight: 35,
      width: iconSize.width,
      y: iconSize.height - 20,
      align: "right",
    })
    bandageEffectGroup.add(bandageEffectIcon, bandageEffectCount)
    bandageEffectGroup.cache()
    this.player.bars.bandageEffect.onChange((value) => {
      if (value === 0) bandageEffectGroup.destroy()
      else {
        bandageEffectCount.text(`${value}`)
        bandageEffectGroup.opacity(1).cache()
        this.controllersGroup.add(bandageEffectGroup)
      }
    })

    const craftBook = new Konva.Image({
      image: loadImage("/images/craft-book.png", (img) => {
        craftBook.image(img).cache()
      }),
      height: iconSize.height,
      width: iconSize.width,
      x: iconSize.width + this.gap,
      y: iconSize.height + this.gap,
    }).cache()
    const craftGroup = new Konva.Group({
      name: "no-click",
    })
    craftGroup.add(craftBook)

    const market = new Konva.Image({
      image: loadImage("/images/market.png", (img) => {
        market.image(img).cache()
      }),
      name: "no-click",
      height: iconSize.height + 10,
      width: iconSize.width,
      x: iconSize.width + this.gap,
      y: (iconSize.height + this.gap) * 2,
    }).cache()

    this.controllersGroup.add(timerGroup, craftGroup, market)
    Game.createAlwaysTop(this.player.layer2, this.controllersGroup)

    market.on("pointerclick", (e) => {
      if (this.lastSentMarketOpen > Date.now()) return
      this.lastSentMarketOpen = Date.now() + 2000
      const t = setTimeout(() => {
        this.player.game().events.emit("market")
        clearTimeout(t)
      }, 150)
    })

    craftGroup.on("pointerclick", (e) => {
      if (this.lastSentCraftOpen > Date.now()) return
      this.lastSentCraftOpen = Date.now() + 2000
      const t = setTimeout(() => {
        this.player.game().events.emit("craft-book")
        clearTimeout(t)
      }, 150)
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
