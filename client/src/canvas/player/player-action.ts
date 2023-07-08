import Konva from "konva"
import { Point, combineClasses } from "../../global/init"
import { socket } from "../../socket/socket"
import { animate2to, animateTo } from "../animations/to"
import { BasicPlayer } from "../basic/player.basic"
import animationAsTween from "../utils/animationAsTween"
import type { Player } from "./player"
import { PlayerClick } from "./player-click"

export class PlayerAction {
  readonly click: PlayerClick
  constructor(private player: BasicPlayer) {
    this.click = new PlayerClick(player)
  }

  get hands() {
    return {
      right: this.player.element(`#${this.player.id("body", "hand", "right")}`),
      left: this.player.element(`#${this.player.id("body", "hand", "left")}`),
    }
  }

  running() {
    const hands = this.hands
    new Konva.Animation((frame) => {
      if (this.click.clickStatus === "pending") {
        this.player.handsGroup.y(0)
        hands.right.position(this.player.handsPosition.right)
        hands.left.position(this.player.handsPosition.left)
        return false
      }

      if (this.player.running) {
        var amplitude = 1
        var period = 800

        hands.right.x(this.player.handsPosition.right.x)
        hands.left.x(this.player.handsPosition.left.x)
        this.player.handsGroup.y(
          amplitude * Math.sin((frame.time * 2 * Math.PI) / period)
        )
      } else {
        var amplitude = 1
        var period = 1000
        this.player.handsGroup.y(0)
        hands.right.x(
          amplitude * Math.sin((frame.time * 2 * Math.PI) / period) +
            this.player.handsPosition.right.x
        )
        hands.left.x(
          -amplitude * Math.sin((frame.time * 2 * Math.PI) / period) +
            this.player.handsPosition.left.x
        )
      }
    }).start()
  }

  clicking() {
    if (
      !this.click.canClick ||
      this.click.clickStatus === "pending" ||
      !this.click.clickDuration
    )
      return
    const hands = this.hands
    const handsItems = $({
      right: this.player.element(`#${this.player.id("equiped", "right")}`),
      left: this.player.element(`#${this.player.id("equiped", "left")}`),
    })
    // check is empty hand
    this.click.clickStatus = "pending"

    // ...

    // animationAsTween(
    //   [
    //     {
    //       node: hands["right"],
    //       properties: {
    //         ...combineClasses(
    //           new Point(25, 40),
    //           this.player.handsPosition["right"]
    //         ),
    //         rotation: -65,
    //       },
    //     },
    //     {
    //       node: hands.left,
    //       properties: {
    //         y: this.player.handsPosition["left"].y - 20,
    //       },
    //     },
    //   ],
    //   this.click.clickDuration
    // ).then(() => {
    //   animationAsTween(
    //     [
    //       {
    //         node: hands["right"],
    //         properties: {
    //           ...this.player.handsPosition["right"],
    //           rotation: 0,
    //         },
    //       },
    //       {
    //         node: hands.left,
    //         properties: {
    //           y: this.player.handsPosition["left"].y,
    //         },
    //       },
    //     ],
    //     this.click.clickDuration
    //   ).then(() => {
    //     this.click.clickStatus = "pending"
    //     console.log(hands.right.getAttr("x"), hands.right.x())
    //   })
    // })

    animate2to(
      [
        hands["right"],
        {
          to: {
            points: [
              {
                ...combineClasses(
                  new Point(25, 40),
                  this.player.handsPosition["right"]
                ),
                rotation: { amount: -65 },
              },
            ],
            absolute: true,
          },
          duration: this.click.clickDuration,
        },
      ],
      [
        hands["left"],
        {
          to: {
            points: [
              {
                ...combineClasses(
                  new Point(-25, 40),
                  this.player.handsPosition["left"]
                ),
                rotation: { amount: 65 },
              },
            ],
            absolute: true,
          },
          duration: this.click.clickDuration,
        },
      ],
      (animate) => {
        const equiped = this.player.items.equiped
        this.click.clickCount++
        if (this.click.clickCount >= this.click.toggleClicksEach) {
          this.click.clickCount = 0
          this.click.handClick =
            this.click.handClick === "right" ? "left" : "right"
        }

        if (this.click.canClick) {
          if (equiped) {
            if (!equiped.twoHandMode) {
              return animate("first")
            }
            handsItems.$forEach((value, key) => {
              if (equiped.twoHandMode) {
                const { active, noActive } = equiped.twoHandMode
                const activeHand =
                  key === this.click.handClick ? active : noActive
                if (activeHand) {
                  if (activeHand.handNode) {
                    const {
                      rotation = null,
                      size = {},
                      point = {},
                    } = activeHand.handNode
                    animateTo(hands[key], {
                      to: {
                        points: [
                          { ...point, ...size, rotation: { amount: rotation } },
                        ],
                      },
                      duration: this.click.clickDuration,
                    })
                  } else if (activeHand.itemNode) {
                    const {
                      rotation = null,
                      size = {},
                      point = {},
                    } = activeHand.itemNode
                    animateTo(value, {
                      to: {
                        points: [
                          { ...point, ...size, rotation: { amount: rotation } },
                        ],
                      },
                      duration: this.click.clickDuration,
                    })
                  }
                }
              }
            })
          }
          animate(this.click.handClick === "right" ? "first" : "second")
        } else {
          this.click.clickStatus = "idle"
          ;["right", "left"].forEach((hand) => {
            hands[hand].position(this.player.handsPosition[hand])
          })
        }
      }
    )
  }
}
