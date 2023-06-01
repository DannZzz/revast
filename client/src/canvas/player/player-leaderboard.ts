import { Layer } from "konva/lib/Layer"
import { socket } from "../../socket/socket"
import { LeaderboardMemberDto } from "../../socket/events"
import Konva from "konva"
import { Point, Size } from "../../global/init"
import { Group } from "konva/lib/Group"
import { KonvaText } from "../structures/KonvaText"
import { percentOf } from "../utils/percentage"
import { Game } from "../game"
import { MiniMap } from "../structures/MiniMap"

export class PlayerLeaderboard {
  constructor(private layer: Layer, private minimap: MiniMap) {
    this.draw()
    this.socketRegister()
  }

  members: LeaderboardMemberDto[]
  readonly size: Size = new Size(280, 300)
  private screenGap = 10
  private textVerticalGap = 5
  private fontSize = 15
  private topGroup: Group
  private myPointsNode: KonvaText
  private myPointsNodeGroup: Group
  private mainGroup: Group

  private position() {
    return new Point(
      this.layer.getStage().width() - this.screenGap - this.size.width,
      this.screenGap
    )
  }

  private draw() {
    const mainGroup = new Konva.Group({
      ...this.size,
      ...this.position(),
    })
    const bg = new Konva.Rect({
      ...this.size,
      fill: "#3a7075",
      opacity: 0.7,
      cornerRadius: 10,
    })

    const title = new KonvaText({
      fill: "white",
      width: this.size.width,
      height: 50,
      fontSize: 25,
      text: "LeaderBoard",
      align: "center",
      verticalAlign: "middle",
    })

    this.topGroup = new Konva.Group({ id: "leaderboard-top", y: 50 })
    this.myPointsNodeGroup = new Konva.Group({
      id: "leaderboard-me",
      y: this.size.height,
    })

    const myText1 = new KonvaText({
      fontSize: this.fontSize,
      fill: "white",
      text: "Your Score:",
      x: this.screenGap,
    })

    this.myPointsNode = new KonvaText({
      fontSize: this.fontSize,
      fill: "white",
      text: "0",
      width: this.size.width - this.screenGap * 2,
      align: "right",
      x: this.screenGap,
    })
    this.myPointsNodeGroup.add(myText1, this.myPointsNode)
    mainGroup.add(bg, title, this.topGroup, this.myPointsNodeGroup)
    mainGroup.listening(false)
    Game.createAlwaysTop(this.layer, mainGroup)
    this.mainGroup = mainGroup
  }

  resize() {
    this.mainGroup.position(this.position())
  }

  socketRegister() {
    socket.on("leaderboard", ([members, me, amIAmongMembers, kills]) => {
      this.myPointsNode.text(me + "")
      this.myPointsNodeGroup.visible(!amIAmongMembers)
      this.topGroup.destroyChildren()
      // this.members = $.$ArrayLength(10, () => members[0])
      this.members = members
      this.members.forEach((data, i) => {
        const width = this.size.width - this.screenGap * 2
        const itemGroup = new Group({
          x: this.screenGap,
          width,
          y: i * (20 + this.textVerticalGap),
        })
        const indexText = new KonvaText({
          text: `${i + 1}.`,
          fontSize: this.fontSize,
          fill: "white",
          width: percentOf(10, width),
        })

        const nameText = new KonvaText({
          text: data.name,
          fontSize: this.fontSize,
          fill: "white",
          width: percentOf(65, width),
          x: percentOf(10, width),
          wrap: "none",
        })

        const xpText = new KonvaText({
          text: `${data.xp < 10000 ? data.xp : currencyFormat(data.xp)}`,
          fontSize: this.fontSize,
          fill: "white",
          align: "right",
          width: percentOf(25, width),
          x: percentOf(75, width),
        })

        itemGroup.add(indexText, nameText, xpText)

        this.topGroup.add(itemGroup)
      })
      this.minimap.updateKills(kills)
    })
  }
}

function currencyFormat(number: number) {
  const MONEY = ["", "k", "m", "G", "T", "P", "E"]
  const ranking = (Math.log10(number) / 3) | 0
  if (!ranking) return number.toString()
  const last = MONEY[ranking]
  const scale = Math.pow(10, ranking * 3)
  const scaled = number / scale
  return `${scaled.toFixed(1)}${last}`
}
