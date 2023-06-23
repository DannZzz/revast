import { For, batch, createResource, createSignal } from "solid-js"
import "./Skins.scss"
import { getSkins } from "../../../../../api/requests"
import modalState from "../../../../../components/Modal/modal-state"
import gameState from "../../../../../store/game-state"

const Skins = () => {
  const { setSkin } = gameState
  const { showModal } = modalState
  const [currentSkin, setCurrentSkin] = createSignal(
    +localStorage.getItem("skin") || 1
  )
  const [skins] = createResource(getSkins, { initialValue: [] })

  const getSkin = (index: number) =>
    skins().find((skin) => skin.index === index) ||
    skins().find((skin) => skin.index === 1)

  const setNewSkin = (i: number) => {
    batch(() => {
      setCurrentSkin(i)
      setSkin(i)
    })
  }

  const modalContent = (
    <div class="skins">
      <For each={skins()}>
        {(skin) => (
          <div
            onClick={() => setNewSkin(skin.index)}
            class="skin-option"
            classList={{ selected: currentSkin() === skin.index }}
          >
            <img
              crossorigin="anonymous"
              src={skin.url}
              alt=""
              class="skin-option-img"
            />
          </div>
        )}
      </For>
    </div>
  )

  return (
    <div onClick={() => showModal({ content: modalContent })} class="skin">
      <div class="title">SKINS</div>
      <img
        crossorigin="anonymous"
        src={getSkin(currentSkin())?.url}
        alt=""
        class="current-skin"
      />
    </div>
  )
}

export default Skins
