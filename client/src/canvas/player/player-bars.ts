import { Layer } from "konva/lib/Layer"
import { Player } from "./player"
import Konva from "konva"
import { Point, Size } from "../../global/init"
import { KonvaText } from "../structures/KonvaText"
import { percentFrom, percentOf } from "../utils/percentage"
import { Bar } from "../structures/Bar"
import { Shape } from "konva/lib/Shape"
import { animateTo } from "../animations/to"
import { PlayerBarsDto } from "../../socket/events"
import { socket } from "../../socket/socket"
import { Group } from "konva/lib/Group"
import { Game } from "../game"
import { GetSet } from "../structures/GetSet"

interface BarNode {
  bar: Shape
  percent: Shape
  animation: boolean
}

export class PlayerBars {
  hp: Bar
  hungry: Bar
  temperature: Bar
  autofood = GetSet(false)
  private barNodes: { hp: BarNode; hungry: BarNode; temperature: BarNode } = {
    hp: {},
    temperature: {},
    hungry: {},
  } as any
  private barHeight = 35
  private barWidth = 200
  private barGap = 10
  private barPercentFontSize = 20
  private group: Konva.Group

  constructor(private player: Player) {
    this.socketRegistering()
  }

  change(bars: PlayerBarsDto[]) {
    let firstTime = false
    bars.forEach((bar) => {
      if (!this[bar.bar]) {
        this[bar.bar] = new Bar(bar.max, bar.current)
        firstTime = true
      } else {
        this[bar.bar].value = bar.current
      }
    })
    if (firstTime) {
      this.draw()
      this.registerEvents()
    }
  }

  registerEvents() {
    ;["hp", "hungry", "temperature"].forEach((barName) => {
      this[barName].events.on("change", (val: number) => {
        const percent = percentFrom(val, this[barName].max)
        animateTo(this.barNodes[barName].bar, {
          to: {
            points: [{ width: percentOf(percent, this.barWidth) }],
            absolute: true,
          },
          duration: 1,
          noBack: true,
        })
        if (percent > 25) this.barNodes[barName].animation = false
        if (!this.barNodes[barName].animation && percent <= 25) {
          this.barNodes[barName].animation = true
          animateTo(this.barNodes[barName].bar, {
            to: { points: [{ fill: "white" }] },
            duration: 0.5,
            onFinish: (animate) => {
              if (this.barNodes[barName].animation) animate()
            },
          })
        }
        this.barNodes[barName].percent.setAttr("text", percent.toFixed(0) + "%")
      })
    })
  }

  position() {
    const screenSize = this.player.layer2.getStage().size()
    const containerY =
      screenSize.height -
      this.player.items.upIfSelected -
      this.player.items.itemSize.height -
      this.player.items.gap * 2 -
      this.barHeight

    const containerX =
      screenSize.width / 2 - (this.barWidth * 3 + this.barGap * 2) / 2
    return new Point(containerX, containerY)
  }

  resize() {
    this.group.position(this.position())
  }

  draw() {
    const group = new Konva.Group({ ...this.position() })

    const makeBar = (options: {
      i: number
      id: string
      barColor: string
      barWidthInPercentage: number
    }) => {
      const { i, barColor, barWidthInPercentage, id } = options
      const barWidthFromPercentage = percentOf(
        barWidthInPercentage,
        this.barWidth
      )

      const barGroup = new Konva.Group({
        x: (this.barWidth + this.barGap) * i,
      })

      const mainBar = new Konva.Rect({
        height: this.barHeight,
        width: barWidthFromPercentage,
        fill: barColor,
        cornerRadius: 15,
      })

      this.barNodes[id].bar = mainBar

      const mainBarStroke = new Konva.Rect({
        height: this.barHeight,
        width: this.barWidth,
        stroke: barColor,
        strokeWidth: 5,
        cornerRadius: 15,
      })

      const mainBarPercentageText = new KonvaText({
        text: `${barWidthInPercentage.toFixed(0)}%`,
        fill: "white",
        width: this.barWidth,
        height: this.barHeight,
        verticalAlign: "middle",
        align: "center",
        fontSize: this.barPercentFontSize,
      })

      this.barNodes[id].percent = mainBarPercentageText

      barGroup.add(mainBar, mainBarStroke, mainBarPercentageText)
      mainBarPercentageText.zIndex(2)
      return barGroup
    }
    // console.log(this.hp, this.hungry)
    const currentHpInPercentage = percentFrom(this.hp.value, this.hp.max)
    const currentHungryInPercentage = percentFrom(
      this.hungry.value,
      this.hungry.max
    )
    const currentTemperatureInPercentage = percentFrom(
      this.temperature.value,
      this.temperature.max
    )

    const hpBars = makeBar({
      i: 0,
      id: "hp",
      barColor: "green",
      barWidthInPercentage: currentHpInPercentage,
    })
    const hungryBars = makeBar({
      i: 1,
      id: "hungry",
      barColor: "#AA0000",
      barWidthInPercentage: currentHungryInPercentage,
    })
    const temperatureBars = makeBar({
      i: 2,
      id: "temperature",
      barColor: "#53bcd1",
      barWidthInPercentage: currentTemperatureInPercentage,
    })

    group.add(hpBars, hungryBars, temperatureBars)
    group.listening(false)
    Game.createAlwaysTop(this.player.layer2, group)
    this.group = group
  }

  socketRegistering() {
    socket.on("playerBars", (bars) => {
      // console.log("bars", bars)
      this.change(bars)
    })
  }
}
