import Konva from "konva"
import { Layer } from "konva/lib/Layer"
import { BG_FOREST_BIOM, SERVER_ASSET } from "../../constants"
import { Game } from "../game"
import { Circle } from "konva/lib/shapes/Circle"
import { Point, Size } from "../../global/init"
import { loadImage } from "./fetchImages"
import { MapDto } from "../../socket/events"
import { Player } from "../player/player"
import { KonvaText } from "./KonvaText"

export class MiniMap {
  private containerSize = new Size(200, 200)
  private gap = 20
  private playerPositionNode: Circle
  private group: Konva.Group
  private killsNode: Konva.Text
  private kills: number = 0
  constructor(
    readonly layer2: Layer,
    readonly map: MapDto,
    readonly player: Player
  ) {
    this.draw()
  }

  private position() {
    const screen = this.layer2.getStage().size()
    return new Point(
      screen.width - this.gap - this.containerSize.width,
      screen.height -
        this.player.items.upIfSelected -
        this.player.items.itemSize.height -
        this.player.items.gap * 2 -
        this.containerSize.height
    )
  }

  resize() {
    this.group.position(this.position())
  }

  private draw() {
    const pos = this.position()
    const group = new Konva.Group({
      ...pos,
    })

    const bg = new Konva.Image({
      ...this.containerSize,
      image: loadImage(this.map.url, (img) => bg.image(img)),
      stroke: "#252525",
      opacity: 0.7,
    })

    const player = new Konva.Circle({
      radius: 3,
      fill: "red",
    })
    const killsContainerSize = new Size(70, 20)
    const killsGroup = new Konva.Group({
      x: this.containerSize.width - killsContainerSize.width,
      y: -(this.gap + killsContainerSize.height),
    })

    const skullImg = new Konva.Image({
      image: loadImage(SERVER_ASSET("skull.png"), (img) => skullImg.image(img)),
      width: 30,
      height: 30,
    })
    this.killsNode = new KonvaText({
      text: "0",
      fill: "#4b2819",
      x: 35,
      fontSize: 15,
      height: 30,
      verticalAlign: "middle",
    })
    killsGroup.add(skullImg, this.killsNode)

    group.add(bg, player, killsGroup)
    player.zIndex(2)
    this.playerPositionNode = player
    Game.createAlwaysTop(this.layer2, group)
    this.group = group
  }

  update(point: Point) {
    const tile = new Size(
      this.containerSize.width / this.map.size.width,
      this.containerSize.height / this.map.size.height
    )
    const nextPoint = new Point(
      (point.x / this.map.tileSize.width) * tile.width,
      (point.y / this.map.tileSize.height) * tile.height
    )
    this.playerPositionNode.position(new Point(nextPoint))
    // console.log(point, new Point(point.x / tile.width, point.y / tile.height))
  }

  updateKills(kills: number) {
    if (kills === this.kills) return
    this.kills = kills
    this.killsNode.text(`${this.kills}`)
  }
}
