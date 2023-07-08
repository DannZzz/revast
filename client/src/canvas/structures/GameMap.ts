import Konva from "konva"
import { MapDto } from "../../socket/events"
import { Point, Size } from "../../global/init"
import { NodeConfig } from "konva/lib/Node"

export class GameMap {
  static draw(mapDto: MapDto, config: NodeConfig = {}): Konva.Group {
    const group = new Konva.Group(config)
    const aP = (p: Point) =>
      new Point(p.x * mapDto.tileSize.width, p.y * mapDto.tileSize.height)
    const aS = (s: Size) =>
      new Size(
        s.width * mapDto.tileSize.width,
        s.height * mapDto.tileSize.height
      )

    mapDto.biomes.forEach((biome) => {
      const rect = new Konva.Rect({
        ...aP(biome.point),
        ...aS(biome.size),
        fill: biome.bgColor,
        stroke: biome.bgColor,
      })
      group.add(rect)
    })
    return group
  }
}
