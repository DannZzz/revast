import { For, batch, createResource, createSignal } from "solid-js"
import "./Skins.scss"
import { getSkins } from "../../../../../api/requests"
import modalState from "../../../../../components/Modal/modal-state"
import gameState from "../../../../../store/game-state"
import SkinsModal from "./SkinsModal"

const Skins = () => {
  const { setSkin } = gameState
  const { showModal, closeModal } = modalState
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

  return (
    <div
      onClick={() =>
        showModal({
          noCloseOutside: true,
          content: (
            <SkinsModal
              skins={skins}
              currentSkin={currentSkin}
              getSkin={getSkin}
              setNewSkin={setNewSkin}
            />
          ),
          containerStyle: { background: "transparent", "box-shadow": "unset" },
          noCloseButton: true,
        })
      }
      class="action-button skin"
    >
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
