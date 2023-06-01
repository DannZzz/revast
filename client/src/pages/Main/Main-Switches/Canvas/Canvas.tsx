import {
  Component,
  Show,
  createEffect,
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
import { createStore } from "solid-js/store"
import "./Canvas.scss"
import Button from "../../../../components/Button/Button"

const Canvas: Component<{}> = (props) => {
  const game = new Game()
  const [dropItemId, setDropItemId] = createSignal<number>()
  let chatInputRef: HTMLInputElement

  const [openChat, setOpenChat] = createSignal(false)
  const { gs, started, died } = gameState

  createEffect(
    on(started, (started) => {
      if (started) {
        game.joinPlayer({ name: gs.nickname, token: gs.token() })
      }
    })
  )

  createEffect(
    on(died, (died) => {
      if (died) {
        disconnectWS()
        game.end()
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

    const layer1 = new Konva.Layer()
    const layer2 = new Konva.Layer()
    stage.add(layer1, layer2)
    // init game
    game.init({ layer: layer1, layer2: layer2 })

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
      if (evt.code === "Enter") {
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

  return (
    <div class="game-container" classList={{ back: !started() }}>
      <div id="game-canvas"></div>

      <Show when={started()}>
        <Show when={!!dropItemId()}>
          <div class="drop-item">
            <span class="description">Do you want to drop the item?</span>
            <div class="buttons">
              <Button
                onClick={() => {
                  game?.events.emit("dropItem.response", dropItemId(), false)
                  setDropItemId(null)
                }}
              >
                Yes, 1x
              </Button>
              <Button
                onClick={() => {
                  game?.events.emit("dropItem.response", dropItemId(), true)
                  setDropItemId(null)
                }}
              >
                Yes, all
              </Button>
              <Button onClick={() => setDropItemId(null)}>No, cancel</Button>
            </div>
          </div>
        </Show>
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
