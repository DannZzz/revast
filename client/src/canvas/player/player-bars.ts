import { Layer } from "konva/lib/Layer"
import { Player } from "./player"
import Konva from "konva"
import { Point, Size } from "../../global/init"
import { KonvaText } from "../structures/KonvaText"
import { percentFrom, percentOf } from "../utils/percentage"
import { Bar } from "../structures/Bar"
import { Shape } from "konva/lib/Shape"
import { animateTo } from "../animations/to"
import { PlayerBar, PlayerBarsDto } from "../../socket/events"
import { socket } from "../../socket/socket"
import { Game } from "../game"
import { GetSet } from "../structures/GetSet"

interface BarNode {
  bar: Shape
  percent: Shape
  animation: boolean
}

export type PlayerBarNodes = { [k in PlayerBar]: BarNode }

export class PlayerBars {
  hp: Bar
  hungry: Bar
  temperature: Bar
  h2o: Bar
  o2: Bar
  autofood = GetSet(false)
  private barNodes: PlayerBarNodes = {
    hp: {},
    temperature: {},
    hungry: {},
    h2o: {},
    o2: {},
  } as any
  private barCount = 4
  private barHeight = 35
  private barWidth = 200
  private barGap = 10
  private barPercentFontSize = 20
  private group: Konva.Group
  private o2BarHeight: number = 15
  private o2BarGroup: Konva.Group
  private o2BarWidth: number = this.barCount * this.barWidth * 1.2
  readonly bandageEffect = GetSet(0)

  constructor(private player: Player) {
    this.socketRegistering()
  }

  change(bars: PlayerBarsDto[]) {
    let firstTime = false
    bars.forEach((bar) => {
      if (bar.bar === "bandage-effect") {
        this.bandageEffect(bar.current)
      } else if (!this[bar.bar]) {
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
    ;["hp", "hungry", "temperature", "h2o"].forEach((barName) => {
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
    this.o2.events.on("change", (val) => {
      const percent = percentFrom(val, this.o2.max)
      const currentVisibility = this.o2BarGroup.visible()
      const visible = percent !== 100
      if (currentVisibility !== visible) {
        animateTo(this.o2BarGroup, {
          duration: 1,
          to: { points: [{ visible }], absolute: true },
          noBack: true,
        })
      }
      animateTo(this.barNodes.o2.bar, {
        to: {
          points: [
            {
              width: percentOf(percent, this.o2BarWidth),
            },
          ],
          absolute: true,
        },
        duration: 1,
        noBack: true,
      })
      if (percent > 25) this.barNodes.o2.animation = false
      if (!this.barNodes.o2.animation && percent <= 25) {
        this.barNodes.o2.animation = true
        animateTo(this.barNodes.o2.bar, {
          to: { points: [{ fill: "white" }] },
          duration: 0.5,
          onFinish: (animate) => {
            if (this.barNodes.o2.animation) animate()
          },
        })
      }
    })
  }

  position() {
    const screenSize = this.player.layer2.getStage().size()
    const containerY =
      screenSize.height -
      this.player.items.upIfSelected -
      this.player.items.itemSize.height -
      this.player.items.gap * 2 -
      this.barHeight -
      this.player.actionable.addButtonSize.height

    const containerX =
      screenSize.width / 2 -
      (this.barWidth * this.barCount + this.barGap * 3) / 2
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
        cornerRadius: 5,
        fill: barColor,
      })

      this.barNodes[id].bar = mainBar

      const mainBarStroke = new Konva.Rect({
        height: this.barHeight,
        width: this.barWidth,
        stroke: barColor,
        strokeWidth: 5,
        cornerRadius: 5,
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
    const currentH2oInPercentage = percentFrom(this.h2o.value, this.h2o.max)
    const currentO2InPercentage = percentFrom(this.o2.value, this.o2.max)

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
    const h2oBars = makeBar({
      i: 3,
      id: "h2o",
      barColor: "#0371bc",
      barWidthInPercentage: currentH2oInPercentage,
    })

    const o2Bar = new Konva.Group({
      offset: {
        x:
          (this.o2BarWidth -
            (this.barWidth * this.barCount + this.barGap * 3)) /
          2,
        y: this.barGap + this.barHeight,
      },
      visible: currentO2InPercentage !== 100,
    })

    const o2Rect = new Konva.Rect({
      fill: "#bbe8ef",
      height: this.o2BarHeight,
      width: this.o2BarWidth,
      cornerRadius: 5,
    })

    const o2Stroke = new Konva.Rect({
      stroke: "#bbe8ef",
      strokeWidth: 5,
      height: this.o2BarHeight,
      width: percentOf(currentO2InPercentage, this.o2BarWidth),
      cornerRadius: 5,
    })

    this.barNodes.o2.bar = o2Rect
    this.o2BarGroup = o2Bar
    o2Bar.add(o2Rect, o2Stroke)
    group.add(hpBars, hungryBars, temperatureBars, h2oBars, o2Bar)
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
