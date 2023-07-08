import Konva from "konva"
import { socket } from "../../socket/socket"
import { BasicPlayer } from "../basic/player.basic"
import { KonvaText } from "../structures/KonvaText"
import { animateTo } from "../animations/to"

export class PlayerMessages {
  private maxShowMessages = 2
  private messagesGap = 5
  private maxWidth = 300
  private messages: string[] = []
  private currently: Konva.Group[] = []

  constructor(private player: BasicPlayer) {}

  addMessage(content: string) {
    this.messages.push(content)
    this.showMessage()
  }

  showMessage() {
    if (this.currently.length >= this.maxShowMessages) return
    const text = this.messages.shift()
    if (!text) return
    const group = new Konva.Group()

    const textNode = new KonvaText({
      text,
      padding: 10,
      fontSize: 20,
      fill: "#ccc",
    })

    if (textNode.width() > this.maxWidth) {
      textNode.width(this.maxWidth)
    }

    const rect = new Konva.Rect({
      width: textNode.width(),
      fill: "#252525cc",
      height: textNode.height(),
      cornerRadius: 5,
    })
    group.offsetY(textNode.height())
    group.add(rect, textNode)
    group.offsetX(-((this.maxWidth - textNode.width()) / 2))

    const add = () => {
      this.player.messagesNode.add(group)
      const t = setTimeout(() => {
        group.destroy()
        this.currently.shift()
        this.showMessage()
        clearTimeout(t)
      }, 5000)
    }

    if (this.currently.length !== 0) {
      this.currently.forEach((grp) => {
        animateTo(grp, {
          duration: 0.5,
          noBack: true,
          onFinish: () => {
            add()
          },
          to: { points: [{ y: -textNode.height() - this.messagesGap }] },
        })
      })
    } else {
      add()
    }

    this.currently.push(group)
  }
}
