import { Accessor, Component, For, InitializedResource } from "solid-js"
import modalState from "../../../../../components/Modal/modal-state"
import { PlayerSkinDto } from "../../../../../socket/events"

const SkinsModal: Component<{
  getSkin: (index: number) => PlayerSkinDto
  currentSkin: Accessor<number>
  setNewSkin: (i: number) => void
  skins: InitializedResource<PlayerSkinDto[]>
}> = ({ getSkin, currentSkin, setNewSkin, skins }) => {
  const { closeModal } = modalState

  return (
    <div class="skins-container">
      <div class="selected-skin">
        <img crossorigin="anonymous" src={getSkin(currentSkin())?.url} alt="" />
      </div>
      <div class="skins">
        <img src="/images/skins.png" class="title" />
        <div class="list">
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
      </div>
      <img
        onClick={() => closeModal()}
        crossorigin="anonymous"
        src="/images/out-button.png"
        alt=""
        class="out-button"
      />
    </div>
  )
}

export default SkinsModal
