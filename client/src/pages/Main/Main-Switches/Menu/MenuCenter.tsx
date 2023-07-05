import {
  Component,
  Show,
  batch,
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
import modalState from "../../../../components/Modal/modal-state"
const gc: any = (window as any).grecaptcha
const MenuCenter: Component<{}> = (props) => {
  const { gs, startGame, leaveGame, started, loading, setLoading } = gameState
  const [servers] = createResource(getServers)
  const { open } = modalState
  const [server, setServer] = createSignal<ServerInformation>()

  let nicknameInputRef: HTMLInputElement

  function onPlay() {
    if (started() || loading()) return

    const send = (token: string = "") => {
      if (started() || loading()) return
      batch(() => {
        startGame(
          nicknameInputRef.value || `unnamed#${$.randomNumber(1, 100)}`,
          server(),
          token
        )
        setLoading(true)
      })
    }

    gc.ready(function () {
      gc.execute("6LfREZomAAAAAORz_JisAgiuSVK964J_2G2fFFxS", {
        action: "submit",
      }).then(function (token) {
        send(token)
      })
    })
    // send()
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
      <img src="images/revast.png" alt="" class="game-title" />
      <Show when={!open()}>
        <div class="join-group">
          <div
            class="nickname"
            style={{
              "background-image": "url(images/player-name.png)",
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
            {/* play button */}
            <div onClick={onPlay} class="play-button"></div>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default MenuCenter
