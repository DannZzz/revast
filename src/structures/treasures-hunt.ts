import { GameServer } from 'src/game/server'
import { BiomeOptions } from './GameMap'
import { Point, Size } from 'src/global/global'
import { BasicDrop } from 'src/game/basic/drop.basic'
import { Items } from 'src/data/items'
import { randomItem } from 'anytool'
import { getRandomPointInRectangle } from 'src/utils/polygons'

export interface TreasureHuntPlace {
  rectCorners: [Point, Point]
  maxCount: number
  ids: string[]
}

const Treasure = 'treasure'

const exceptIds: number[] = [95, 44, 93]

export class TreasuresHunt {
  /**
   * seconds
   */
  readonly times = [25, 60]
  lastAdded = 0 // date now

  items = Items.filter(
    (item) =>
      !item.isEatable() &&
      !['emerald', 'ruby'].includes(item.data.resType) &&
      !exceptIds.includes(item.data.id),
  )

  private readonly availablePlaces: TreasureHuntPlace[] = []

  constructor(readonly gs: GameServer) {}

  addPlace(...places: Omit<TreasureHuntPlace, 'ids'>[]) {
    this.availablePlaces.push(...places.map((place) => ({ ids: [], ...place })))
    return this
  }

  everySecond() {
    if (this.availablePlaces.length === 0 || this.lastAdded > Date.now()) return
    const treasures = this.gs.staticItems
      .for('all')
      .drops.filter((drop) => drop.type === Treasure)
    const randomSecond = $.randomNumber(this.times[0], this.times[1])
    this.lastAdded = Date.now() + randomSecond * 1000
    if (this.gs.maxTreasures <= treasures.length) return
    const places = this.availablePlaces.filter(
      (place) => place.ids.length < place.maxCount,
    )

    if (places.length === 0) return
    const randomPlace = randomItem(places)
    const [lt, rb] = randomPlace.rectCorners
    let point: Point = getRandomPointInRectangle(lt.x, lt.y, rb.x, rb.y)

    const newDrop = new BasicDrop({
      authorId: `system-treasure`,
      point,
      data: this.items.random(),
      hp: 200,
      hurtSource: 'HURT_BARREL',
      onEnd: (drop) => {
        this.gs.staticItems.for(point).removeDrop(drop.id)
        randomPlace.ids = randomPlace.ids.filter((id) => id !== drop.id)
      },
      take(player, item) {
        player.items.addable(item.id) && player.items.addItem(item.id, 1)
      },
      hitboxRadius: 50,
      size: new Size(128, 128),
      source: 'BARREL',
      type: 'treasure',
    })
    this.gs.staticItems.for(point).addDrop(newDrop)
    randomPlace.ids.push(newDrop.id)
  }
}
