import { Chest } from 'anytool'
import { MAX_TREASURES_ISLAND } from 'src/constant'
import { BasicMisc, BasicMiscProps, Misc } from 'src/game/basic/misc.basic'
import { GameServer } from 'src/game/server'
import { Point, Size, combineClasses } from 'src/global/global'
import { BiomeOptions, Biome, BiomeEffect } from 'src/structures/GameMap'

let startMisc = 16

const misc = (props: Omit<BasicMiscProps, 'mapId'>) =>
  new BasicMisc({ mapId: startMisc++, ...props })

export const MiscItems = new Chest<number, BasicMisc>(
  [
    misc({
      source: 'LAKE',
      size: new Size(210, 210),
    }),
    misc({
      source: 'LAKE_BOTTOM',
      size: new Size(210, 210),
    }),
    misc({
      source: 'LAKE_LEFT',
      size: new Size(210, 210),
    }),
    misc({
      source: 'LAKE_LEFT_BOTTOM',
      size: new Size(210, 210),
    }),
    misc({
      source: 'LAKE_LEFT_TOP',
      size: new Size(210, 210),
    }),
    misc({
      source: 'LAKE_RIGHT',
      size: new Size(210, 210),
    }),
    misc({
      source: 'LAKE_RIGHT_BOTTOM',
      size: new Size(210, 210),
    }),
    misc({
      source: 'LAKE_RIGHT_TOP',
      size: new Size(210, 210),
    }),
    misc({
      source: 'LAKE_TOP',
      size: new Size(210, 210),
    }),
    misc({
      source: 'HERB_1',
      size: new Size(273, 224),
    }),
    misc({
      source: 'HERB_2',
      size: new Size(275, 280),
    }),
    misc({
      source: 'HERB_3',
      size: new Size(223, 181),
    }),
    misc({
      source: 'HERB_4',
      size: new Size(155, 163),
    }),
    misc({
      source: 'HERB_5',
      size: new Size(225, 220),
    }),
    misc({
      source: 'HERB_6',
      size: new Size(400, 391),
    }),
    misc({
      source: 'HERB_7',
      size: new Size(400, 391),
    }),
    misc({
      source: 'HERB_8',
      size: new Size(225, 220),
    }),
    misc({
      source: 'ISLAND_0',
      size: new Size(962, 729),
      afterCreating(gameServer) {
        gameServer.map.addBiome(
          islandBeach(this, [
            new Point(100, 180),
            new Point(280, 60),
            new Point(500, 60),
            new Point(800, 180),
            new Point(900, 340),
            new Point(860, 540),
            new Point(600, 680),
            new Point(280, 640),
            new Point(60, 440),
          ]),
        )
        const center = combineClasses(
          this.point,
          new Point(this.size.width / 2, this.size.height / 2),
        )
        gameServer.treasures.addPlace({
          maxCount: MAX_TREASURES_ISLAND,
          rectCorners: [
            new Point(center.x - 210, center.y - 125),
            new Point(center.x + 200, center.y + 125),
          ],
        })
      },
    }),
    misc({
      source: 'ISLAND_1',
      size: new Size(970, 775),
      afterCreating(gameServer) {
        gameServer.map.addBiome(
          islandBeach(this, [
            new Point(120, 200),
            new Point(360, 60),
            new Point(680, 60),
            new Point(860, 160),
            new Point(920, 340),
            new Point(800, 660),
            new Point(440, 753),
            new Point(160, 640),
            new Point(50, 380),
          ]),
        )
        const center = combineClasses(
          this.point,
          new Point(this.size.width / 2, this.size.height / 2),
        )

        gameServer.treasures.addPlace({
          maxCount: MAX_TREASURES_ISLAND,
          rectCorners: [
            new Point(center.x - 200, center.y - 135),
            new Point(center.x + 200, center.y + 135),
          ],
        })
      },
    }),
    misc({
      source: 'ISLAND_2',
      size: new Size(856, 693),
      afterCreating(gameServer) {
        gameServer.map.addBiome(
          islandBeach(this, [
            new Point(80, 200),
            new Point(280, 80),
            new Point(500, 80),
            new Point(760, 180),
            new Point(800, 320),
            new Point(720, 548),
            new Point(480, 650),
            new Point(180, 620),
            new Point(60, 480),
            new Point(48, 320),
          ]),
        )
        const center = combineClasses(
          this.point,
          new Point(this.size.width / 2, this.size.height / 2),
        )
        gameServer.treasures.addPlace({
          maxCount: MAX_TREASURES_ISLAND,
          rectCorners: [
            new Point(center.x - 360, center.y - 125),
            new Point(center.x + 360, center.y + 125),
          ],
        })
      },
    }),
  ].map((msc) => [msc.props.mapId, msc]),
)

export const miscByMapId = (
  mapId: number,
  point: Point,
  gs: GameServer,
): Misc => {
  const item = MiscItems.find((item) => item.props.mapId === mapId)
  try {
    const micsc = item.generate(gs)
    micsc.preCreate(
      new Point(point.x, point.y - item.props.size.height),
      // point,
    )
    return micsc
  } catch (e) {
    console.log(e)
    // console.log('misc not found id: ', mapId)
  }
}

function islandBeach(misc: Misc, points: Point[]) {
  return new BiomeOptions({
    type: Biome.beach,
    priority: 2,
    digItemId: 83,
    absoluteSize: true,
    notDrawAble: true,
    name: `island${$.randomNumber(1, 100)}`,
    points: points.map((p) => combineClasses(misc.point, p)),
    effect: new BiomeEffect({
      temperatureDay: -3,
      temperatureNight: -20,
    }),
  })
}

// new Point(189, 5),
//       new Point(195, 5),
//       new Point(196, 8),
//       new Point(196, 10),
//       new Point(194, 11),
//       new Point(192, 12),
//       new Point(189, 11),
//       new Point(187, 8),
