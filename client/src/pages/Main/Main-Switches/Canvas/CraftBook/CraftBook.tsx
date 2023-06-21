import { For, Show, createResource, createSignal } from "solid-js"
import { getCompactItems, getCrafts } from "../../../../../api/requests"
import "./CraftBook.scss"
import { Craft } from "../../../../../api/type"

const CraftBook = () => {
  const [compactItems] = createResource(getCompactItems)
  const [crafts] = createResource(getCrafts)
  const [selectedItem, setSelectedItem] = createSignal<Craft>()

  const item = (id: number) => {
    return compactItems().find((it) => it.id === +id)
  }

  return (
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
              <img src={item(+craft.id).iconUrl} />
            </div>
          )}
        </For>
      </div>
      <div class="craft">
        <Show when={!!selectedItem()}>
          <h2>{item(selectedItem().id).name}</h2>
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
                      class="recept-item-icon"
                      src={item(+id).iconUrl}
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
                  <img class="recept-item-icon" src="images/water.png" alt="" />
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
  )
}

export default CraftBook
