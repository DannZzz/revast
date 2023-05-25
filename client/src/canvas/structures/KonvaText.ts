import Konva from "konva"
import { TextConfig } from "konva/lib/shapes/Text"

export class KonvaText extends Konva.Text {
  constructor(textConfig: TextConfig) {
    super(textConfig)
    this.fontFamily("Righteous")
    this.letterSpacing(0.5)
  }
}
