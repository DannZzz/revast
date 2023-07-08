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
import { PlyaerBodyEffect } from "../../socket/events"
import { equal } from "anytool"
import GameIcons from "../data/icons"

export interface BasicPlayerProps {
  name: string
  skin: PlayerSkin
  id: string
  icons: number[]
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
  readonly cache = new Cache<BasicPlayerCache>(() => ({}))
  handsPosition: {
    left: Point
    right: Point
  }
  bagNode: Konva.Image
  wearingNode: Konva.Image
  messagesNode: Konva.Group
  messages: PlayerMessages
  private inBodyEffect = false
  handsGroup: Konva.Group
  footPrint = false
  running = false
  icons: number[] = []
  nameNodes: { group: Konva.Group; text: Konva.Text; icons: Konva.Group } = <
    any
  >{}

  constructor(props: ElementProps<BasicPlayerProps>) {
    const { name, skin, id, icons, ...otherProps } = props
    super(otherProps)
    this.skin = skin
    this.icons = icons || []
    this.name = name
    this._id = id
    this.actions = new PlayerAction(this)
    this.items = new BasicPlayerItems(this)
    this.messages = new PlayerMessages(this)
  }

  get body() {
    return this.element(`#${this.id("body")}`)
  }

  takeIcons(icons: number[], force: boolean = false) {
    if (
      !force &&
      icons.length === this.icons.length &&
      icons.every((ic) => this.icons.includes(ic))
    )
      return
    this.icons = icons
    const width = this.icons.length * 40
    const x = (300 - this.nameNodes.text.width()) / 2 - width
    this.nameNodes.icons.destroyChildren()
    this.nameNodes.icons.x(x)
    this.icons.forEach((icon, i) => {
      const iconNode = new Konva.Image({
        image: loadImage(GameIcons[icon], (img) => iconNode.image(img).cache()),
        x: i * 40,
        width: 30,
        height: 30,
        offset: {
          x: 0,
          y: 5,
        },
      }).cache()
      this.nameNodes.icons.add(iconNode)
    })
  }

  draw(): void {
    const id = this.id()
    const group = new Konva.Group({ id })
    group.position(this.point)
    const nameGroup = new Konva.Group({
      offsetX: 150 - this.size.width / 2,
      y: -25,
    })

    const name = new KonvaText({
      text: this.name,
      align: "center",
      // width: 0,
      wrap: "none",
      fill: "white",
      fontSize: 20,
      strokeWidth: 0.5,
      stroke: "black",
    }).cache()
    name.offsetX(-(150 - name.width() / 2))
    const iconsGroup = new Konva.Group()
    nameGroup.add(iconsGroup, name)
    this.nameNodes.group = nameGroup
    this.nameNodes.text = name
    this.nameNodes.icons = iconsGroup

    this.messagesNode = new Konva.Group({
      offsetX: 150,
      offsetY: 100,
      name: "message-node",
      // ...absolutePoint,
    })
    Game.createMessageGroup(this.layer, this.messagesNode)

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
        ? loadImage(this.items.bagUrl, (img) => this.bagNode.image(img).cache())
        : null,
      // x: -60,
      y: -40,
      width: 120,
      height: 120,
    }).cache()

    this.wearingNode = new Konva.Image({
      image: null,
      ...this.size,
    }).cache()

    const body = new Konva.Image({
      image: loadImage(this.skin.url, (image) => {
        body.image(image).cache()
      }),
      id: `${id}-body-image`,
      // filters: [],
      // red: 250,
      ...this.size,
    }).cache()

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

    rightHand.add(rightHandItem, handBase)
    leftHand.add(leftHandItem, handBase.clone())
    this.handsGroup = new Konva.Group().add(rightHand, leftHand)

    this.items.settingMode.node = new Konva.Image({
      image: null,
      id: `${id}-set`,
      visible: false,
      opacity: 0.7,
    })

    bodyGroup.add(
      this.items.settingMode.node,
      this.handsGroup,
      this.bagNode,
      body,
      this.wearingNode
    )

    group.add(bodyGroup, nameGroup)
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
    ;(this.layer.findOne("#game-players") as any).add(group)
    this.takeIcons(this.icons, true)
    this.actions.running()
  }
  registerEvents(): void {
    // throw new Error("Method not implemented.")
  }

  bodyEffect(effectType: PlyaerBodyEffect) {
    if (this.inBodyEffect) return
    const node = this.element(`#${this.id("body", "image")}`)
    if (!node) return
    switch (effectType) {
      case "attacked": {
        this.inBodyEffect = true
        node.cache()
        node.filters([Konva.Filters.RGB])
        node.red(100)
        node.to({
          red: 150,
          duration: 0.1,
          onFinish: () => {
            node.to({
              filters: [],
              red: 100,
              duration: 0.1,
              onFinish: () => {
                this.inBodyEffect = false
              },
            })
          },
        })
        break
      }

      default:
        break
    }
  }

  update(
    angle: boolean = false,
    equipment: boolean = false,
    wearing: boolean
  ): void {
    const cachePoint = this.cache.get("point")
    if (cachePoint?.x !== this.point.x || cachePoint?.y !== this.point.y) {
      this.running = true
      this.element()?.position(
        combineClasses(
          this.point,
          new Point(-(this.size.width / 2), -(this.size.height / 2))
        )
      )
      this.messagesNode.position(this.point)
      this.cache.data.point = this.point
      // this.body?.position(new Point(this.size.width / 2, this.size.height / 2))
    } else {
      this.running = false
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
        this.bagNode
          .image(
            loadImage(this.items.bagUrl, (img) =>
              this.bagNode.image(img).cache()
            )
          )
          .cache()
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
