import { Cache } from 'src/structures/cache/cache'
import { PlayerCache, VisualPlayerData } from '../types/player.types'
import { pointPolygon } from 'intersects'
import { Transformer } from 'src/structures/Transformer'
import { BioEntity } from 'src/entities/bio.entity'
import { EquipmentEntity } from 'src/entities/equipment.entity'
import { MobDynamicEntity } from 'src/entities/mob-dynamic.entity'
import { MobEntity } from 'src/entities/mob.entity'
import { OtherPlayersEntity } from 'src/entities/other-players.entity'
import { PlayerSkinEntity } from 'src/entities/player-skin.entity'
import { StaticSettableEntity } from 'src/entities/static-settable.entity'
import { Converter } from 'src/structures/Converter'
import { deepDifference } from 'src/utils/deepDifference'
import { Player } from './player'
import { DropEntity } from 'src/entities/drop.entity'
import { WearingEntity } from 'src/entities/wearing.entity'
import { Items } from 'src/data/items'

export class PlayerLoop {
  readonly cache: Cache<PlayerCache>
  constructor(readonly player: Player) {
    this.cache = player.cache
  }

  action() {
    this.player.actions.state.update()
    this.player.bars.onAction()
    const socket = this.player.socket()
    if (
      (this.cache.has('lastSentPosition') &&
        !$(this.cache.get('lastSentPosition')).$same(this.player.point())) ||
      (this.cache.has('lastSentCameraPosition') &&
        !$(this.cache.get('lastSentCameraPosition')).$same(
          this.player.camera.point(),
        ))
    ) {
      socket.emit('playerPosition', [
        this.player.point().round(),
        this.player.camera.point().round(),
      ])
    }
    this.cache.data.lastSentPosition = this.player.point().clone()
    this.cache.data.lastSentCameraPosition = this.player.camera.point().clone()
    this.player.actions.doPositionChanges()
    this.player.actions.clicking()

    const staticItems = this.player.staticItems.for(
      this.player.cache.get('biome'),
    )
    const viewRect = this.player.camera.viewRect()

    // bios
    const itemsInView = staticItems.bio.filter((bio) => bio.within(viewRect))
    const itemIds = itemsInView.map((bio) => bio.id)
    const cacheBioIds = this.cache.get('staticBios', true)
    if (!$(cacheBioIds).same(itemIds)) {
      const toRemoveIds = cacheBioIds.filter(
        (bioId) => !itemIds.includes(bioId),
      )
      const toAdd = itemsInView.filter((bio) => !cacheBioIds.includes(bio.id))
      socket.emit('staticBios', [
        toAdd.map(
          (bio) =>
            Transformer.toPlain(
              new BioEntity({
                ...bio.data,
                id: bio.id,
                point: bio.point,
                _currentResources: bio.resources(),
              }),
            ) as BioEntity,
        ),
        toRemoveIds,
      ])
      this.cache.data.staticBios = itemsInView
    }

    // static settable items
    const settablesInView = staticItems.settable.filter((item) =>
      item.withinStrict(viewRect),
    )
    const settableIds = settablesInView.map((item) => item.id)
    const cacheSettableIds = this.cache.get('staticSettables', true)
    if (!$(cacheSettableIds).same(settableIds)) {
      const toRemoveIds = cacheSettableIds.filter(
        (settableId) => !settableIds.includes(settableId),
      )
      const toAdd = settablesInView.filter(
        (settable) => !cacheSettableIds.includes(settable.id),
      )
      socket.emit('staticSettables', [
        toAdd.map((settable) =>
          Transformer.toPlain(new StaticSettableEntity(settable)),
        ),
        toRemoveIds,
      ])
      this.cache.data.staticSettables = settablesInView
    }

    // send other users
    const playersInView = this.player.gameServer.dynamicItems.filter(
      (item) =>
        item.id() !== this.player.id() &&
        pointPolygon(
          ...Converter.pointToXYArray(item.point()),
          Converter.pointArrayToXYArray(viewRect),
          1,
        ),
    )
    const playersInViewArray = playersInView.map((player) => player)
    const otherCachedPlayers = this.cache.get('otherPlayers')
    const visualPlayers = playersInView.map(
      (player) =>
        new VisualPlayerData({
          id: player.id(),
          clicking: {
            duration: player.actions.click.duration,
            status: player.actions.click.clickStatus,
          },
          name: this.player.settings.admin()
            ? `#${player.uniqueId} ${player.name}`
            : player.name,
          point: player.point(),
          wearing: player.items.weared
            ? new WearingEntity(player.items.weared.item.data)
            : null,
          skin: new PlayerSkinEntity(player.skin),
          rotation: player.angle(),
          equipment: player.items.equiped
            ? new EquipmentEntity(player.items.equiped.item.data)
            : null,
          bagSource: player.items.specialItems.bag
            ? Items.get(player.items.specialItems.bag).source
            : null,
        }),
    )
    let otherPlayers: OtherPlayersEntity = null

    if (deepDifference(otherCachedPlayers, visualPlayers)) {
      const toRemoveIds = otherCachedPlayers
        .filter(
          (player) => !playersInViewArray.find((pl) => pl.id() === player.id),
        )
        .map((pl) => pl.id)

      otherPlayers = Transformer.toPlain(
        new OtherPlayersEntity({
          toRemoveIds,
          players: visualPlayers,
        }),
      )
      this.cache.data.otherPlayers = visualPlayers
    }
    const dynamicItems = [otherPlayers]

    // mobs
    const mobsInView = this.player.gameServer.mobs.all.filter((mob) =>
      pointPolygon(
        ...Converter.pointToXYArray(mob.point),
        Converter.pointArrayToXYArray(viewRect),
        1,
      ),
    )
    const cachedMobs = this.cache.get('mobs')
    const mobInViewIds = mobsInView.map((mob) => mob.id)
    if (mobsInView.size !== cachedMobs.length || mobsInView.size !== 0) {
      const toRemoveIds = cachedMobs
        .filter((mob) => !mobInViewIds.includes(mob.id))
        .map((mob) => mob.id)
      const mobsEntity = Transformer.toPlain(
        new MobDynamicEntity({
          mobs: mobsInView.map((mob) => new MobEntity(mob)),
          toRemoveIds,
        }),
      )
      dynamicItems.push(mobsEntity)
      this.cache.data.mobs = [...mobsInView.values()]
    }
    // mobsInView.forEach(mob => console.log(mob.id, mob.point))
    if (dynamicItems.some((i) => i))
      socket.emit('dynamicItems', dynamicItems as any)

    // drops
    const cachedDrops = this.cache.get('drops')
    const cachedDropsIds = this.cache.get('drops', true)
    const dropsInView = staticItems.drops.filter((drop) =>
      drop.within(viewRect),
    )
    const dropsInViewIds = dropsInView.map((drop) => drop.id)
    if (
      cachedDrops.length !== dropsInView.length ||
      !cachedDrops.every((drop) => dropsInViewIds.includes(drop.id))
    ) {
      const toRemoveIds = cachedDrops
        .filter((drop) => !dropsInViewIds.includes(drop.id))
        .map((drop) => drop.id)

      const toSend = dropsInView
        .filter((drop) => !cachedDropsIds.includes(drop.id))
        .map((drop) => Transformer.toPlain(new DropEntity(drop)))

      socket.emit('drops', [toSend, toRemoveIds])
      this.cache.data.drops = dropsInView
    }
  }
}
