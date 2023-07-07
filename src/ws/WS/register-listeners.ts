import { NB } from 'src/utils/NumberBoolean'
import { Wss } from './WSS'
import { isNumber } from 'src/utils/is-number-in-range'
import { verifyUserRecaptcha } from 'src/utils/verfify-recaptcha'
import CameraViewQuery from 'src/structures/camera-view-query'

export default function registerListeners(this: Wss) {
  this.on('joinServer', async ({ ws, player }, [joinPlayerDto]) => {
    if (ws.inGame) return
    const { recaptcha_token, ...props } = joinPlayerDto
    ws.requestToJoin = true
    const verifyCaptcha = await verifyUserRecaptcha(recaptcha_token)
    if (verifyCaptcha) this.gameServer.joinPlayer({ ...props, socket: ws })
  })
    .on('toggles', ({ ws, player }, toggles) => {
      player?.toggle.set(toggles)
    })
    .on('mouseAngle', ({ ws, player }, data) => {
      if ([data[0], data[1]].some((n) => !isNumber(n, -1000, 1000))) {
        return
      }
      player?.setAngle(data[0], data[1])
    })
    .on('clickItem', ({ ws, player }, data) => {
      if (!isNumber(data[0], 1, 1000)) {
        return
      }
      player?.items.click(data[0])
    })
    .on('craftRequest', ({ ws, player }, data) => {
      player?.items.craftItem(data[0])
    })
    .on('setItemRequest', ({ ws, player }, data) => {
      if (
        !isNumber(data[0], 1, 1000) ||
        !isNumber(data[1]) ||
        !isNumber(data[2])
      ) {
        return
      }

      if (!player) return
      this.emitable(ws.id).emit('setItemResponse', [
        player.items.setItem(...data),
        NB.to(player.items.timeout.building > Date.now()),
      ])
    })
    .on('screenSize', ({ ws, player }, data) => {
      if (player) player.camera.screenSize(data[0], player.point())
    })
    .on('autofood', ({ ws, player }, data) => {
      if (player) player.settings.autofood(NB.from(data[0]))
    })
    .on('dropRequest', ({ ws, player }, data) => {
      if (!isNumber(data[0], 1, 1000)) {
        return
      }

      if (player) player.items.dropItem(data[0], NB.from(data[1]))
    })
    .on('messageRequest', ({ ws, player }, data) => {
      player?.makeMessage(data[0])
    })
    .on('requestChatStatus', ({ ws, player }, data) => {
      player?.chatStatus(NB.from(data[0]))
    })
    .on('requestActionableHolder', ({ ws, player }, data) => {
      if (!isNumber(data[1], 1, 1000)) {
        return
      }
      player?.actions.actionableHold(data)
    })
    .on('requestActionableHolderTake', ({ ws, player }, data) => {
      if (!isNumber(data[1], 0, 15)) {
        return
      }
      player?.actions.actionableTake(data)
    })
    .on('requestClanCreate', ({ ws, player }, [name]) => {
      player?.clanActions.create(name)
    })
    .on('requestClansInformation', ({ ws, player }) => {
      player?.clanActions.showInfo()
    })
    .on('requestClanJoin', ({ ws, player }, [clanId]) => {
      player?.clanActions.join(clanId)
    })
    .on('requestClanAcceptMember', ({ ws, player }, [memberId]) => {
      player?.clanActions.acceptMember(memberId)
    })
    .on('requestClanTogglePrivacy', ({ player }) => {
      player?.clanActions.togglePrivacy()
    })
    .on('requestClanMemberKick', ({ player }, [memberId]) => {
      player?.clanActions.kick(memberId)
    })
    .on('requestClanLeave', ({ player }, []) => {
      player?.clanActions.leave()
    })
    .on('market', ({ player }, [i, quantity]) => {
      player?.gameServer.market.try(player, i, quantity)
    })
}
