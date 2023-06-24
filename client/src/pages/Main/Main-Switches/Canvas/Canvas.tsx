import {
  Component,
  For,
  Show,
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
import Button from "../../../../components/Button/Button"
import CraftBook from "./CraftBook/CraftBook"
import { getCompactItems, getCrafts } from "../../../../api/requests"

const Canvas: Component<{}> = (props) => {
  const game = new Game()
  let clanName: HTMLInputElement
  const [compactItems] = createResource(getCompactItems, {})
  const [crafts] = createResource(getCrafts)
  const [craftBookOpen, setCraftBookOpen] = createSignal(false)
  const [dropItemId, setDropItemId] = createSignal<number>()
  const [clans, setClans] = createSignal<{
    visualClans?: ClanVisualInformationDto[]
    currentClan?: ClanInformationDto
  }>({})
  let chatInputRef: HTMLInputElement
  const { showModal, closeModal, open: modalOpen } = modalState
  const [openChat, setOpenChat] = createSignal(false)
  const { gs, started, died, leaveGame, showGame } = gameState

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
      } else if (evt.code === "Enter") {
        setOpenChat(!openChat())
        if (openChat()) {
          chatInputRef?.focus()
        } else if (chatInputRef?.value.trim()) {
          socket.emit("messageRequest", [
            chatInputRef.value.trim().slice(0, 160),
          ])
        }
      } else if (openChat() && evt.code === "Escape") {
        setOpenChat(false)
      } else if (!openChat()) {
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
      if (visualClans) {
        showModal({
          opacity: 0.7,
          title: "SERVER CLANS",
          content: (
            <div class="clans">
              <div class="clans-list">
                {visualClans.length > 0 ? (
                  <For each={visualClans}>
                    {(clan) => (
                      <div class="visual-clan">
                        <div class="info">
                          <span class="clan-title">{clan.name}</span>
                          <span class="clan-member-count">
                            {clan.memberCount}
                          </span>
                        </div>
                        <Button
                          onClick={() =>
                            socket.emit("requestClanJoin", [clan.id])
                          }
                        >
                          Join
                        </Button>
                      </div>
                    )}
                  </For>
                ) : (
                  <span>Ooops! There's no clan yet!</span>
                )}
              </div>
              <input
                ref={clanName}
                placeholder="clan name.."
                type="text"
                class="clan-name"
                maxLength={20}
              />
            </div>
          ),
          buttons: [
            {
              children: "Create Clan",
              onClick: () =>
                socket.emit("requestClanCreate", [clanName.value || ""]),
            },
          ],
          onClose: () => setClans({}),
        })
      } else if (currentClan) {
        showModal({
          opacity: 0.7,
          title: currentClan.name,
          content: (
            <div class="clans">
              <div
                class="privacy"
                onClick={(e) => {
                  currentClan.playerOwner &&
                    socket.emit("requestClanTogglePrivacy", [])
                }}
              >
                <input
                  disabled={!currentClan.playerOwner}
                  type="checkbox"
                  checked={currentClan.joinPrivacy}
                />
                <span>Players can see clan</span>
              </div>
              <div class="clans-list">
                <For each={currentClan.members}>
                  {(member) => (
                    <div class="visual-clan">
                      <div class="info">
                        <span class="member-flex">
                          {member.id === currentClan.ownerId && (
                            <img
                              src="/images/clan-leader.png"
                              width={20}
                              height={20}
                            />
                          )}
                          {member.name}
                        </span>
                      </div>
                      <Show when={member.kickable}>
                        <img
                          class="kick-button"
                          src="/images/close.png"
                          onClick={() =>
                            socket.emit("requestClanMemberKick", [member.id])
                          }
                        />
                      </Show>
                    </div>
                  )}
                </For>
              </div>
            </div>
          ),
          onClose: () => setClans({}),
          buttons: [
            {
              children: currentClan.playerOwner ? "Delete" : "Leave",
              onClick: () => {
                socket.emit("requestClanLeave", [])
              },
            },
          ],
        })
      }
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
