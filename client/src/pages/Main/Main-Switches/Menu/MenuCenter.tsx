import {
  Component,
  createEffect,
  createResource,
  createSignal,
  on,
} from "solid-js"
import { Select } from "@thisbeyond/solid-select"
import "./MenuCenter.scss"
import { getServers } from "../../../../api/requests"
import { ServerInformation } from "../../../../api/type"
import gameState from "../../../../store/game-state"
import { socket } from "../../../../socket/socket"
import { PlayerInformationDto } from "../../../../socket/events"

const MenuCenter: Component<{}> = (props) => {
  const { gs, startGame, leaveGame, started, loading, setLoading } = gameState
  const [servers] = createResource(getServers)
  const [server, setServer] = createSignal<ServerInformation>()

  let nicknameInputRef: HTMLInputElement

  function onPlay() {
    if (started() || loading()) return
    startGame(
      nicknameInputRef.value || `unnamed#${$.randomNumber(1, 100)}`,
      server()
    )
    setLoading(true)
  }

  createEffect(
    on(servers, (value) => {
      if (value?.length > 0 && !server()) {
        setServer(value[0])
      }
    })
  )

  return (
    <div class="menu-center">
      <div
        class="nickname"
        style={{
          "background-image": "url(images/nickname-banner.png)",
        }}
      >
        <input
          ref={nicknameInputRef}
          placeholder="Your Username.."
          maxLength={18}
          value={gs.nickname}
          type="text"
          class=""
        />
      </div>
      <div class="buttons">
        <div class="servers">
          <Select
            class="custom"
            onChange={(value) => setServer(value)}
            initialValue={server()}
            format={(item: ServerInformation, type) =>
              `${item.name} (${item.players})`
            }
            options={servers()}
          />
        </div>
        <button onClick={onPlay} class="play-button">
          PLAY
        </button>
      </div>
    </div>
  )
}

export default MenuCenter
