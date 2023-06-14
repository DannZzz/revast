import Konva from "konva"
import { PlayerSkin } from "../types/player.types"
import { BasicElement, ElementProps } from "./element.basic"
import { KonvaText } from "../structures/KonvaText"
import { loadImage } from "../structures/fetchImages"
import { Point, Size, combineClasses } from "../../global/init"
import { PlayerAction } from "../player/player-action"
import { PlayerItems } from "../player/player-items"
import { EventObject } from "../utils/EventEmitter"
import { BasicPlayerItems } from "./player-items.basic"
import { Cache } from "../structures/cache"
import { Game } from "../game"
import { Converter } from "../structures/Converter"
import { getPointByTheta } from "../animations/rotation"
import { PlayerMessages } from "../player/player-messages"
import { playerHighlight } from "../data/cached-nodes"

export interface BasicPlayerProps {
  name: string
  skin: PlayerSkin
  id: string
}

export interface BasicPlayerCache {
  point?: Point
  angle?: number
  equipmentId?: string
  screen?: Point
  bagUrl?: string
  wearingId?: string
}

export class BasicPlayer<
  T extends EventObject = EventObject
> extends BasicElement<T> {
  name: string
  skin: PlayerSkin
  readonly equipment = {
    size: new Size(120, 120),
    hands: { left: { rotation: 0 }, right: { rotation: 180 } },
  }
  actions: PlayerAction
  items: BasicPlayerItems
  highlight: Konva.Circle
  readonly cache = new Cache<BasicPlayerCache>(() => ({}))
  handsPosition: {
    left: Point
    right: Point
  }
  bagNode: Konva.Image
  wearingNode: Konva.Image
  messagesNode: Konva.Group
  messages: PlayerMessages

  constructor(props: ElementProps<BasicPlayerProps>) {
    const { name, skin, id, ...otherProps } = props
    super(otherProps)
    this.skin = skin
    this.name = name
    this._id = id
    this.actions = new PlayerAction(this)
    this.items = new BasicPlayerItems(this)
    this.messages = new PlayerMessages(this)
  }

  get body() {
    return this.element(`#${this.id("body")}`)
  }

  draw(): void {
    const id = this.id()
    const group = new Konva.Group({ id })
    group.position(this.point)
    const name = new KonvaText({
      text: this.name,
      align: "center",
      width: 300,
      wrap: "none",
      offsetX: 150 - this.size.width / 2,
      fill: "#cccccc",
      y: -25,
      fontSize: 20,
    })

    const absolutePoint = combineClasses(
      this.point,
      new Point(this.size.width / 2, this.size.height / 2)
    )

    this.messagesNode = new Konva.Group({
      offsetX: 150,
      offsetY: 100,
      // ...absolutePoint,
    })
    Game.createMessageGroup(this.layer, this.messagesNode)
    this.highlight = playerHighlight.clone({
      ...absolutePoint,
      id: `${id}-highlight`,
    })
    Game.createHighlight(this.layer2, this.highlight)

    const bodyGroup = new Konva.Group({
      id: `${id}-body`,
      offsetX: this.size.width / 2,
      offsetY: this.size.height / 2,
      x: this.size.width / 2,
      y: this.size.height / 2,
    })

    this.bagNode = new Konva.Image({
      id: `${id}-bag`,
      image: this.items.bagUrl
        ? loadImage(this.items.bagUrl, (img) => this.bagNode.image(img))
        : null,
      // x: -60,
      y: -40,
      width: 120,
      height: 120,
    })

    this.wearingNode = new Konva.Image({
      image: null,
      ...this.size,
    })

    const body = new Konva.Image({
      image: loadImage(this.skin.url, (image) => {
        body.image(image)
      }),
      id: `${id}-body-image`,
      // filters: [],
      // red: 250,
      ...this.size,
    })

    const rightHand = new Konva.Group({
      id: `${id}-body-hand-right`,
      x: 5,
      y: 70,
    })

    const handBase = new Konva.Image({
      image: loadImage(this.skin.handUrl, (img) => handBase.image(img)),
      width: 35,
      height: 35,
      offsetX: 17.5,
      offsetY: 17.5,
    })
    handBase.cache() //

    const rightHandItem = new Konva.Image({
      id: `${id}-equiped-right`,
      image: null,
      ...this.equipment.hands.right,
      ...this.equipment.size,
      visible: false,
    })

    const leftHand = new Konva.Group({
      id: `${id}-body-hand-left`,
      x: this.size.width - 5,
      y: 70,
    })

    this.handsPosition = {
      left: new Point(leftHand.position()),
      right: new Point(rightHand.position()),
    }

    const leftHandItem = new Konva.Image({
      id: `${id}-equiped-left`,
      image: null,
      rotation: 180,
      ...this.equipment.hands.left,
      ...this.equipment.size,
      // stroke: "black",
      // strokeWidth: 3,
      visible: false,
      scaleX: -1,
      offsetX: this.equipment.size.width,
    })

    rightHand.add(rightHandItem, handBase.clone())
    rightHandItem.zIndex(-1)
    leftHand.add(leftHandItem, handBase.clone())

    this.items.settingMode.node = new Konva.Image({
      image: null,
      id: `${id}-set`,
      visible: false,
      filters: [Konva.Filters.RGB],
      opacity: 0.7,
    })

    this.items.settingMode.node.cache()

    bodyGroup.add(
      this.items.settingMode.node,
      rightHand,
      leftHand,
      body,
      this.bagNode,
      this.wearingNode
    )

    group.add(bodyGroup, name)
    const itemRange = new Konva.Line({
      id: "item-range",
      points: Converter.pointArrayToXYArray([
        this.point,
        getPointByTheta(this.point, this.theta, 30),
      ]),
      stroke: "red",
      visible: false,
    })
    group.listening(false)
    ;(this.layer.findOne("#game-players") as any).add(group, itemRange)
  }
  registerEvents(): void {
    // throw new Error("Method not implemented.")
  }
  update(
    angle: boolean = false,
    equipment: boolean = false,
    wearing: boolean
  ): void {
    const cachePoint = this.cache.get("point")
    if (cachePoint?.x !== this.point.x || cachePoint?.y !== this.point.y) {
      this.element()?.position(
        combineClasses(
          this.point,
          new Point(-(this.size.width / 2), -(this.size.height / 2))
        )
      )
      this.highlight.position(this.point)
      this.messagesNode.position(this.point)
      this.body?.position(new Point(this.size.width / 2, this.size.height / 2))
    }
    if (angle) {
      if (this.cache.get("angle") !== this.angle) {
        this.body.rotation(this.angle)
        this.cache.data.angle = this.angle
      }
    }
    this.actions.clicking()
    if (equipment) {
      if (this.cache.get("equipmentId") !== this.items.equiped?.url) {
        this.items.updateEquipment()
        this.cache.data.equipmentId = this.items.equiped?.url
      }
    }
    if (wearing) {
      if (this.cache.get("wearingId") !== this.items.weared?.url) {
        this.items.updateWearing()
        this.cache.data.wearingId = this.items.weared?.url
      }
    }
    if (this.items.bagUrl) {
      if (this.cache.get("bagUrl") !== this.items.bagUrl) {
        this.bagNode.image(
          loadImage(this.items.bagUrl, (img) => this.bagNode.image(img))
        )
        this.cache.data.bagUrl = this.items.bagUrl
      }
    }
  }

  destroy() {
    this.element()?.destroy()
    this.layer2.findOne(`#${this.id("highlight")}`)?.destroy()
    this.messagesNode.destroy()
  }
}
