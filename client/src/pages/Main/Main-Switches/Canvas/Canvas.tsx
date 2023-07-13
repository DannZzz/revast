import {
  Component,
  For,
  Show,
  batch,
  createEffect,
  createResource,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js"
import { Game } from "../../../../canvas/game"
import Konva from "konva"
import { KonvaEventObject } from "konva/lib/Node"
import { Point, Size } from "../../../../global/init"
import gameState from "../../../../store/game-state"
import { disconnectWS, socket } from "../../../../socket/socket"
import "./Canvas.scss"
import modalState from "../../../../components/Modal/modal-state"
import {
  ClanVisualInformationDto,
  ClanInformationDto,
} from "../../../../socket/events"
import CraftBook from "./CraftBook/CraftBook"
import {
  getCompactItems,
  getCrafts,
  sendCanvas,
} from "../../../../api/requests"
import Market from "./Market/Market"
import Clans from "./Clans/Clans"
import Settings from "./Settings/Settings"

const Canvas: Component<{}> = (props) => {
  const game = new Game()
  const [compactItems] = createResource(getCompactItems, {})
  const [crafts] = createResource(getCrafts)
  const [craftBookOpen, setCraftBookOpen] = createSignal(false)
  const [marketOpen, setMarketOpen] = createSignal(false)
  const [settingsOpen, setSettingsOpen] = createSignal(false)
  const [dropItemId, setDropItemId] = createSignal<number>()
  const [canMove, setCanMove] = createSignal<boolean>(true)
  const [clans, setClans] = createSignal<{
    visualClans?: ClanVisualInformationDto[]
    currentClan?: ClanInformationDto
  }>({})
  let chatInputRef: HTMLInputElement
  const { showModal, closeModal, open: modalOpen } = modalState
  const [openChat, setOpenChat] = createSignal(false)
  const { gs, started, died, leaveGame, showGame } = gameState

  createEffect(
    on(compactItems, (items) => {
      if (items) {
        game.items = items
      }
    })
  )

  createEffect(
    on(started, (started) => {
      if (started) {
        game.joinPlayer({
          skin: gs.skin,
          name: gs.nickname,
          token: gs.token(),
          recaptcha_token: gs.recaptcha_token,
        })

        socket.on("playerDied", ([playerInformationDto]) => {
          leaveGame(playerInformationDto)
        })

        socket.on("clansInformation", ([visualClans, currentClan]) => {
          setClans({ visualClans, currentClan })
        })

        socket.on("requestCanvas", ([n]) => {
          const stage = game.layer.getStage().clone()
          stage.find(".message-node").forEach((node) => {
            node.destroy()
          })
          sendCanvas(n, stage.toDataURL())
          stage.destroy()
        })
      }
    })
  )

  createEffect(
    on(died, (died) => {
      if (died) {
        disconnectWS()
        game.end()
        closeModal()
      }
    })
  )

  createEffect(
    on(settingsOpen, (cbOpen) => {
      if (cbOpen) {
        showModal({
          title: "Settings",
          closeButtonSrc: "/images/out-button.png",
          content: (
            <Settings
              onChange={(settings) => {
                game?.setSettings(settings)
              }}
            />
          ),
          opacity: 0.7,
          onClose: () => {
            setSettingsOpen(false)
          },
        })
      }
    })
  )

  createEffect(
    on(craftBookOpen, (cbOpen) => {
      if (cbOpen) {
        showModal({
          content: <CraftBook compactItems={compactItems} crafts={crafts} />,
          opacity: 0.7,
          onClose: () => {
            setCraftBookOpen(false)
          },
        })
      }
    })
  )

  createEffect(
    on(marketOpen, (cbOpen) => {
      if (cbOpen) {
        showModal({
          content: <Market />,
          containerStyle: { background: "unset", "box-shadow": "none" },
          noCloseButton: true,
          opacity: 0.7,
          onClose: () => {
            setMarketOpen(false)
          },
        })
      }
    })
  )

  onCleanup(() => {
    disconnectWS()
  })

  onMount(() => {
    // konva
    Konva.pixelRatio = 1
    const stage = new Konva.Stage({
      container: "game-canvas",
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const layer1 = new Konva.Layer({ listening: false })
    const layer2 = new Konva.Layer()
    stage.add(layer1, layer2)
    // init game
    game.init({ layer: layer1, layer2: layer2 })

    game.events.on("loaded", showGame)

    game.events.on("craft-book", () => {
      setCraftBookOpen(true)
    })

    game.events.on("market", () => {
      setMarketOpen(true)
    })

    game.events.on("settings", () => {
      setSettingsOpen(true)
    })

    // events
    window.onresize = () => {
      game.events.emit(
        "screen.resize",
        new Size(window.innerWidth, window.innerHeight)
      )
    }

    document.onkeyup = (evt) =>
      started() && !openChat() && game.events.emit("keyboard.up", evt)
    document.onkeydown = (evt) => {
      if (!started()) return
      if (evt.code === "Tab") {
        if (modalOpen()) {
          closeModal()
        } else {
          game?.player?.clans.openClans()
        }
      } else if (["NumpadEnter", "Enter"].includes(evt.code)) {
        batch(() => {
          setOpenChat(!openChat())
          setCanMove(!openChat())
        })
        if (openChat()) {
          chatInputRef?.focus()
        } else if (chatInputRef?.value.trim()) {
          socket.emit("messageRequest", [
            chatInputRef.value.trim().slice(0, 160),
          ])
        }
      } else if ((openChat() || modalOpen()) && evt.code === "Escape") {
        closeModal()
        setOpenChat(false)
        setCanMove(true)
      } else if (evt.code == "KeyG") {
        game.events.emit("setmode.toggle")
      } else if (canMove()) {
        game.events.emit("keyboard.down", evt)
      }
    }
    game.events.on("dropItem.request", (itemId) => {
      setDropItemId(itemId)
    })

    function onMouseMove(e: KonvaEventObject<MouseEvent>) {
      game.events.emit(
        "player.mouse-move",
        new Point(e.evt.clientX, e.evt.clientY)
      )
    }

    function onMouseDown(e: KonvaEventObject<MouseEvent>) {
      if (e.evt.button === 0) game.events.emit("mouse.down", e)
    }

    function onMouseUp(e: KonvaEventObject<MouseEvent>) {
      if (e.evt.button === 0) game.events.emit("mouse.up", e)
    }

    stage.on("mousedown", onMouseDown)
    stage.on("mouseup", onMouseUp)
    stage.on("mousemove", onMouseMove)
  })

  createEffect(
    on(clans, ({ visualClans, currentClan }) => {
      if (!visualClans && !currentClan) {
        if ("waitingServer" in (game?.player?.clans || {}))
          game.player.clans.waitingServer = false
        return
      }
      if (!game?.player?.clans?.waitingServer) return
      setCanMove(false)
      showModal({
        content: (
          <Clans
            onClose={() => {
              closeModal()
              setCanMove(true)
              setClans({})
            }}
            clans={visualClans}
            currentClan={currentClan}
          />
        ),
        noCloseButton: true,
        containerStyle: { background: "transparent", "box-shadow": "unset" },
        onClose: () => {
          setCanMove(true)
          setClans({})
        },
      })
    })
  )

  createEffect(
    on(dropItemId, (id) => {
      if (!id) {
        return closeModal()
      }
      showModal({
        opacity: 0.7,
        content: (
          <span class="drop-item-description">
            Do you want to drop the item?
          </span>
        ),
        buttons: [
          {
            onClick: () => {
              game?.events.emit("dropItem.response", dropItemId(), false)
              setDropItemId(null)
            },
            children: "Yes, 1x",
          },
          {
            onClick: () => {
              game?.events.emit("dropItem.response", dropItemId(), true)
              setDropItemId(null)
            },
            children: "Yes, All",
          },
          {
            onClick: () => setDropItemId(null),
            children: "Cancel",
          },
        ],
        onClose: () => setDropItemId(null),
      })
    })
  )

  return (
    <div class="game-container" classList={{ back: !started() }}>
      <div id="game-canvas"></div>

      <Show when={started()}>
        <Show when={openChat()}>
          <input
            ref={chatInputRef}
            class="chat-input"
            maxLength={160}
            type="text"
          />
        </Show>
      </Show>
    </div>
  )
}

export default Canvas
