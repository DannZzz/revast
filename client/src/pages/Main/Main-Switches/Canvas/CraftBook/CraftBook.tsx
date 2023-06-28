import {
  Accessor,
  Component,
  For,
  Resource,
  Show,
  createEffect,
  createResource,
  createSignal,
} from "solid-js"
import { getCompactItems, getCrafts } from "../../../../../api/requests"
import "./CraftBook.scss"
import { CompactItem, Craft } from "../../../../../api/type"
import { on } from "solid-js"

const CraftBook: Component<{
  compactItems: Resource<CompactItem[]>
  crafts: Resource<Craft[]>
}> = ({ compactItems, crafts }) => {
  const [selectedItem, setSelectedItem] = createSignal<Craft>()

  const item = (items: Resource<CompactItem[]>, id: number) => {
    return items().find((it) => it.id === +id)
  }

  // createEffect(on(compactItems))

  return (
    <Show when={compactItems()}>
      <div class="craft-book">
        <div class="item-list">
          <For each={crafts()}>
            {(craft) => (
              <div
                onClick={() =>
                  setSelectedItem((currentCraft) =>
                    currentCraft?.id === craft.id ? undefined : craft
                  )
                }
                classList={{ selected: selectedItem()?.id === +craft.id }}
                class="craft-item"
              >
                <img
                  crossorigin="anonymous"
                  src={item(compactItems, +craft.id).iconUrl}
                />
              </div>
            )}
          </For>
        </div>
        <div class="craft">
          <Show when={!!selectedItem()}>
            <h2>{item(compactItems, selectedItem().id).name}</h2>
            <div class="req-container">
              <div class="recept">
                <For
                  each={Object.entries(selectedItem().items.required).sort(
                    (a, b) => b[1] - a[1]
                  )}
                >
                  {([id, quantity]) => (
                    <div class="recept-item">
                      <img
                        crossorigin="anonymous"
                        class="recept-item-icon"
                        src={item(compactItems, +id).iconUrl}
                        alt=""
                      />
                      x{quantity}
                    </div>
                  )}
                </For>
              </div>
              <Show
                when={selectedItem().state && !$(selectedItem().state).$empty()}
              >
                <img src="images/add.png" width={50} height={50} alt="" />
                <div class="additional">
                  <Show when={selectedItem().state.water}>
                    <img
                      class="recept-item-icon"
                      src="images/water.png"
                      alt=""
                    />
                  </Show>
                  <Show when={selectedItem().state.fire}>
                    <img
                      class="recept-item-icon"
                      src="images/campfire-icon.png"
                      alt=""
                    />
                  </Show>
                  <Show when={selectedItem().state.workbench}>
                    <img
                      class="recept-item-icon"
                      src="images/workbench.png"
                      alt=""
                    />
                  </Show>
                </div>
              </Show>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  )
}

export default CraftBook
