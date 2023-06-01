import { Component, For, createEffect, createResource, on } from "solid-js"
import "./Crafts.scss"
import { getCompactItems, getCrafts } from "../../api/requests"
import CraftItem from "./CraftItem/CraftItem"
import Button from "../../components/Button/Button"

const Crafts: Component = () => {
  const [compactItems] = createResource(getCompactItems)
  const [crafts] = createResource(getCrafts)

  const item = (id: number) => {
    return compactItems().find((it) => it.id === id)
  }

  return (
    <div class="crafts">
      <div class="bar">
        <Button onClick={() => window.location.replace("/")}>Go Back</Button>
      </div>
      <div class="container">
        <For each={crafts()}>
          {(craft, index) => <CraftItem {...craft} item={item} />}
        </For>
      </div>
    </div>
  )
}

export default Crafts
