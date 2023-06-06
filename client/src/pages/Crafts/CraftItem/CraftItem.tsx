import { Component, For, Show } from "solid-js"
import "./CraftItem.scss"
import { CompactItem, Craft } from "../../../api/type"
import modalState from "../../../components/Modal/modal-state"

const CraftItem: Component<Craft & { item: (id: number) => CompactItem }> = ({
  id,
  item,
  items,
  state,
}) => {
  const required = Object.entries(items.required).sort((a, b) => b[1] - a[1])
  const { showModal } = modalState

  function open() {
    showModal({
      content: (
        <div class="req-container">
          <div class="recept">
            <For each={required}>
              {([id, quantity]) => (
                <div class="recept-item">
                  <img
                    class="recept-item-icon"
                    src={item(+id).iconUrl}
                    alt=""
                  />
                  x{quantity}
                </div>
              )}
            </For>
          </div>
          <Show when={state && !$(state).$empty()}>
            <img src="images/add.png" width={50} height={50} alt="" />
            <div class="additional">
              <Show when={state.water}>
                <img class="recept-item-icon" src="images/water.png" alt="" />
              </Show>
              <Show when={state.fire}>
                <img
                  class="recept-item-icon"
                  src="images/campfire-icon.png"
                  alt=""
                />
              </Show>
              <Show when={state.workbench}>
                <img
                  class="recept-item-icon"
                  src="images/workbench.png"
                  alt=""
                />
              </Show>
            </div>
          </Show>
        </div>
      ),
    })
  }

  return (
    <div id={`${id}-item`} class="craft-item">
      <div class="img-container" onClick={open}>
        <img class="main-img" src={item(id).iconUrl} alt="" />
      </div>
    </div>
  )
}

export default CraftItem
