import { Component, For, createEffect, createResource, on } from "solid-js"
import "./Crafts.scss"
import { getCompactItems, getCrafts } from "../../api/requests"
import CraftItem from "./CraftItem/CraftItem"

const Crafts: Component = () => {
  const [compactItems] = createResource(getCompactItems)
  const [crafts] = createResource(getCrafts)

  const item = (id: number) => {
    return compactItems().find((it) => it.id === id)
  }

  return (
    <div class="crafts">
      <div class="container">
        <For each={crafts()}>
          {(craft, index) => <CraftItem {...craft} item={item} />}
        </For>
      </div>
    </div>
  )
}

export default Crafts
