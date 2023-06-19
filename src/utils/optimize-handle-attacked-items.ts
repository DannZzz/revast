import { getAngle } from 'src/game/animations/rotation'
import { Bio } from 'src/game/basic/bio-item.basic'
import { StaticSettableItem } from 'src/game/basic/static-item.basic'
import { Point } from 'src/global/global'
import { percentOf, percentFrom } from './percentage'

export const optimizeHandleAttackedItems = (
  items: Array<StaticSettableItem | Bio>,
  from: Point,
) => {
  const players = items
    .map((item) => [...item.validPlayersSockets().values()])
    .flat()
    .filter(
      (player, i, self) =>
        self.findIndex((pl) => pl.id() === player.id()) === i,
    )

  players.forEach((player) => {
    const ids = [
      ...player.cache.get('staticBios', true),
      ...player.cache.get('staticSettables', true),
    ]
    const touched = items.filter((item) => ids.includes(item.id))
    player.socket().emit(
      'staticItemAttacked',
      touched.map(
        (item) =>
          <any>[
            item.id,
            getAngle(from, item.centerPoint),
            item instanceof StaticSettableItem &&
              item.data.showHpRadius &&
              percentOf(percentFrom(item.tempHp(), item.data.hp), 360),
          ],
      ),
    )
  })
}
