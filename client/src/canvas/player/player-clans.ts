import Konva from "konva"
import { Player } from "./player"
import { loadImage } from "../structures/fetchImages"
import { _window } from "../utils/window"
import { Game } from "../game"
import { socket } from "../../socket/socket"
import { uuid } from "anytool"
import { KonvaText } from "../structures/KonvaText"
import { Size } from "../../global/init"

export class PlayerClans {
  waitingServer = false
  applications = new Map<string, any>()
  node: Konva.Image
  applicationsNode: Konva.Group
  constructor(readonly player: Player) {
    this.draw()
    this.registerEvents()
  }

  draw() {
    const size = _window.size()
    this.node = new Konva.Image({
      name: "no-click",
      image: loadImage("/images/clan-icon.png", (img) => this.node.image(img)),
      width: 70,
      offsetX: 35,
      offsetY: 35,
      height: 70,
      y: 30,
      x: size.width / 2,
    })

    this.applicationsNode = new Konva.Group({
      x: 10,
      y: size.height / 2,
    })

    Game.createAlwaysTop(this.player.layer2, this.node, this.applicationsNode)
  }

  registerListening() {
    this.node.on("click", () => {
      console.log("c ,")
      this.openClans()
    })
  }

  resize() {
    const size = _window.size()
    this.node.x(size.width / 2)
    this.applicationsNode.y(size.height / 2)
  }

  openClans() {
    this.waitingServer = true
    socket.emit("requestClansInformation", [])
  }

  registerEvents() {
    socket.on("clanJoinApplication", ([memberName, memberId]) => {
      const id = `app-${uuid(20)}`
      const app = new Konva.Group({
        id,
        visible: false,
      })
      const maxWidth = 250
      const text = new KonvaText({
        y: 10,
        text: `${memberName} wants to join your clan.`,
        width: 200,
        fill: "#ccc",
        wrap: "none",
      })
      text.x((maxWidth - text.width()) / 2)

      const bs = new Size(40, 40)

      const destroy = () => {
        clearTimeout(this.applications.get(id))
        this.applications.delete(id)
        app.destroy()
      }

      const button1: Konva.Image = new Konva.Image({
        image: loadImage("/images/accept.png", (img) =>
          button1.image(img).cache()
        ),
        width: bs.width,
        height: bs.height,
        offsetX: bs.width / 2,
        y: 10 + text.height() + 10,
        x: maxWidth / 2 - 10 - bs.width / 2,
      }).cache()

      const button2 = button1
        .clone({
          image: loadImage("/images/reject.png", (img) =>
            button2.image(img).cache()
          ),
          x: maxWidth / 2 + 10 + bs.width / 2,
        })
        .cache()

      button1.on("click", () => {
        destroy()
        socket.emit("requestClanAcceptMember", [memberId])
      })

      button2.on("click", () => destroy())

      const bg = new Konva.Rect({
        width: maxWidth,
        height: text.height() + 30 + bs.height,
        fill: "#252525",
        opacity: 0.7,
        cornerRadius: 5,
      })
      app.add(bg, text, button1, button2)
      this.applicationsNode.add(app)

      app.to({ visible: true, duration: 0.5 })
      this.applications.set(
        id,
        setTimeout(() => destroy(), 20000)
      )
    })
  }
}
