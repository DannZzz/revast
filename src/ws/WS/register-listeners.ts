import { NB } from 'src/utils/NumberBoolean'
import { Wss } from './WSS'

export default function registerListeners(this: Wss) {
  this.on('joinServer', (ws, [joinPlayerDto]) => {
    this.gameServer.joinPlayer({ ...joinPlayerDto, socketId: ws.id })
  })
    .on('toggles', (ws, toggles) => {
      this.gameServer.to(ws.id)?.toggle.set(toggles)
    })
    .on('mouseAngle', (ws, data) => {
      this.gameServer.to(ws.id)?.setAngle(data[0], data[1])
    })
    .on('clickItem', (ws, data) => {
      this.gameServer.to(ws.id)?.items.click(data[0])
    })
    .on('craftRequest', (ws, data) => {
      this.gameServer.to(ws.id)?.items.craftItem(data[0])
    })
    .on('setItemRequest', (ws, data) => {
      const player = this.gameServer.to(ws.id)
      if (!player) return
      this.emitable(ws.id).emit('setItemResponse', [
        player.items.setItem(data[0]),
        NB.to(player.items.timeout.building > Date.now()),
      ])
    })
    .on('screenSize', (ws, data) => {
      const player = this.gameServer.to(ws.id)
      if (player) player.camera.screenSize(data[0], player.point())
    })
    .on('autofood', (ws, data) => {
      const player = this.gameServer.to(ws.id)
      if (player) player.settings.autofood(NB.from(data[0]))
    })
    .on('dropRequest', (ws, data) => {
      const player = this.gameServer.to(ws.id)
      if (player) player.items.dropItem(data[0], NB.from(data[1]))
    })
    .on('messageRequest', (ws, data) => {
      this.gameServer.to(ws.id)?.makeMessage(data[0])
    })
    .on('requestChatStatus', (ws, data) => {
      this.gameServer.to(ws.id)?.chatStatus(NB.from(data[0]))
    })
    .on('requestActionableHolder', (ws, data) => {
      this.gameServer.to(ws.id)?.actions.actionableHold(data)
    })
    .on('requestActionableHolderTake', (ws, data) => {
      this.gameServer.to(ws.id)?.actions.actionableTake(data)
    })
}
