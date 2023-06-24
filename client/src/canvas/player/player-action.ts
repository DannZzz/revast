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

  clicking() {
    if (
      !this.click.canClick ||
      this.click.clickStatus === "pending" ||
      !this.click.clickDuration
    )
      return
    const hands = {
      right: this.player.element(`#${this.player.id("body", "hand", "right")}`),
      left: this.player.element(`#${this.player.id("body", "hand", "left")}`),
    }
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
        }
      }
    )
  }
}
