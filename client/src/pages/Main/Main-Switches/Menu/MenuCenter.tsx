import {
  Component,
  createEffect,
  createResource,
  createSignal,
  on,
} from "solid-js"
import { Select } from "@thisbeyond/solid-select"
import "./MenuCenter.css"
import { getServers } from "../../../../api/requests"
import { ServerInformation } from "../../../../api/type"
import gameState from "../../../../store/game-state"
import { socket } from "../../../../socket/socket"
import { PlayerInformationDto } from "../../../../socket/events"

const MenuCenter: Component<{}> = (props) => {
  const { gs, startGame, leaveGame, started } = gameState
  const [servers] = createResource(getServers)
  const [server, setServer] = createSignal<ServerInformation>()

  let nicknameInputRef: HTMLInputElement

  function onPlay() {
    if (started()) return
    startGame(
      nicknameInputRef.value || `unnamed#${$.randomNumber(1, 100)}`,
      server()
    )
    socket.on("playerDied", ([playerInformationDto]) => {
      leaveGame(playerInformationDto)
    })
  }

  createEffect(
    on(servers, (value) => {
      if (value?.length > 0 && !server()) {
        setServer(value[0])
      }
    })
  )

  return (
    <div class="flex flex-col justify-center items-center">
      <div
        class="w-[400px] h-32 bg-cover bg-no-repeat bg-center flex justify-start items-end px-4 pb-3"
        style={{
          "background-image": `url("images/nickname-banner.png")`,
        }}
      >
        <input
          ref={nicknameInputRef}
          placeholder="Your Username.."
          maxLength={18}
          value={gs.nickname}
          type="text"
          class="w-[360px] h-10 bg-transparent outline-none border-none text-center placeholder-[#252525] text-[#252525] text-lg"
        />
      </div>
      <div class="relative flex w-full justify-between px-2 items-center gap-1">
        <div
          class="p-1 flex-1 h-16 bg-cover bg-no-repeat bg-center"
          style={{
            "background-image": `url("images/servers.png")`,
          }}
        >
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
        <img
          onClick={onPlay}
          src={"images/play-button.png"}
          alt=""
          class="w-28 h-16 mr-2 cursor-pointer"
        />
      </div>
    </div>
  )
}

export default MenuCenter
