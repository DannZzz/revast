import { Layer } from "konva/lib/Layer"
import { EquipmentDto, WearingDto } from "../../socket/events"
import { BasicPlayer } from "./player.basic"
import { Point } from "../../global/init"
import { loadImage } from "../structures/fetchImages"
import Konva from "konva"

export class BasicPlayerItems {
  equiped: EquipmentDto
  layer: Konva.Group
  bagUrl: string
  weared: WearingDto

  readonly settingMode: { id: number; grid: boolean; node: Konva.Image } = {
    id: null,
    grid: false,
    node: null,
  }

  constructor(protected player: BasicPlayer) {
    this.layer = player.layer2
  }

  updateEquipment() {
    const equiped = this.equiped
    const handRight = this.player.element(
      `#${this.player.id("equiped", "right")}`
    )
    const handLeft = this.player.element(
      `#${this.player.id("equiped", "left")}`
    )
    if (equiped) {
      handLeft.visible(!!equiped.twoHandMode)
      const equipmentSize = equiped.size || this.player.equipment.size
      if (!!equiped.twoHandMode) {
        handLeft.position(
          new Point(
            this.player.size.width - equiped.drawPosition.x,
            equiped.drawPosition.y
          )
        )
        handLeft.rotation(
          this.player.equipment.hands.right.rotation - equiped.startRotationWith
        )
        handLeft.size(equipmentSize)
        handLeft.setAttr(
          "image",
          loadImage(equiped.url, (img) =>
            handLeft.setAttr("image", img).cache()
          )
        )
      }
      handLeft.cache()
      handRight.visible(true)
      handRight.position(equiped.drawPosition)
      handRight.size(equipmentSize)
      handRight
        .setAttr(
          "image",
          loadImage(equiped.url, (img) =>
            handRight.setAttr("image", img).cache()
          )
        )
        .cache()
      handRight.scaleX(equiped.flip ? -1 : 1)
      handRight.offsetX(equiped.flip ? equipmentSize.width : 0)
      handRight.rotation(
        this.player.equipment.hands.right.rotation + equiped.startRotationWith
      )
    } else {
      handLeft.visible(false)
      handLeft.size(this.player.equipment.size)
      handLeft.setAttr("image", null).cache()
      handRight.visible(false)
      handRight.size(this.player.equipment.size)
      handRight.setAttr("image", null).cache()
    }
  }

  updateWearing() {
    if (this.weared) {
      this.player.wearingNode
        .image(
          loadImage(this.weared.url, (img) =>
            this.player.wearingNode.image(img).cache()
          )
        )
        .cache()
      this.player.bagNode.visible(false)
      this.player.wearingNode.offset(
        new Point(-this.weared.drawPosition.x, -this.weared.drawPosition.y)
      )
      this.player.wearingNode.visible(true)
    } else {
      // this.player.wearingNode.image(null)
      this.player.bagNode.visible(true)
      this.player.wearingNode.visible(false)
    }
  }
}
