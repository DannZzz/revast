import { Point, Size } from 'src/global/global'
import { ChangeEvented, onChange } from '../utils/OnChange'
import { GetSet } from './GetSet'
import { rectToPolygon } from '../utils/polygons'
import { UniversalHitbox } from 'src/utils/universal-within'

export class Camera {
  point: GetSet<Point> = GetSet(new Point())
  private readonly maxScreenSize = new Size(2540, 2000)
  size: GetSet<Size> = GetSet(null)
  map: GetSet<Size> = GetSet(null)
  private evented: boolean = false
  private cb: () => void
  constructor(startPoint: Point, sizes: { map: Size; size: Size }) {
    this.registerEvents()
    this.point = GetSet(startPoint)
    this.size(sizes.size)
    this.map(sizes.map)
  } //

  viewRect(more: number = 200): UniversalHitbox {
    const { x, y } = this.point()
    const { width: mapW, height: mapH } = this.map()
    const { width: screenW, height: screenH } = this.size()

    let topLeft = new Point(x - more, y - more)
    let bottomRight = new Point(
      topLeft.x + screenW + more * 2,
      topLeft.y + screenH + more * 2,
    )

    if (topLeft.x < 0) topLeft.x = 0
    if (topLeft.y < 0) topLeft.y = 0
    if (bottomRight.x > mapW) bottomRight.x = mapW
    if (bottomRight.y > mapH) bottomRight.y = mapH
    return {
      point: topLeft,
      size: new Size(bottomRight.x - topLeft.x, bottomRight.y - topLeft.y),
    }
  }

  registerEvents() {
    this.size.onChange((newVal) => {
      if (!newVal) return
      let correctSize = new Size(newVal.width, newVal.height)
      let shouldReturn = false
      if (newVal.width > this.maxScreenSize.width) {
        shouldReturn = true
        correctSize.width = this.maxScreenSize.width
      }
      if (newVal.height > this.maxScreenSize.height) {
        shouldReturn = true
        correctSize.height = this.maxScreenSize.height
      }
      if (shouldReturn) return correctSize
    })
  }

  calculateCameraPoint(playerPos: Point) {
    const { width: sW, height: sH } = this.size()
    const { width: mapW, height: mapH } = this.map()
    const [sW2, sH2] = [sW / 2, sH / 2]

    const screenPoint = new Point(0, 0)

    if (playerPos.x < sW2) {
      screenPoint.x = 0
    } else if (playerPos.x < mapW - sW2) {
      screenPoint.x = playerPos.x - sW2
    } else {
      screenPoint.x = mapW - sW
    }

    if (playerPos.y < sH2) {
      screenPoint.y = 0
    } else if (playerPos.y < mapH - sH2) {
      screenPoint.y = playerPos.y - sH2
    } else {
      screenPoint.y = mapH - sH
    }

    this.point(screenPoint)
  }

  screenSize(size: Size, playerPos: Point) {
    this.size(size)
    this.calculateCameraPoint(playerPos)
  }
}
