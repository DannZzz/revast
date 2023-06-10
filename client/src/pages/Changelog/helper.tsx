import { For } from "solid-js"

export const cg_list = (title: string, items: string[]) => (
  <div class="list">
    <span>{title}</span>
    <ul>
      <For each={items}>{(item) => <li>{item}</li>}</For>
    </ul>
  </div>
)

export const cg_title = (title: string) => <h1 class="title">{title}</h1>

export const cg_small_img = (src: string) => (
  <img src={src} alt="" class="small-image" />
)

export const cg_big_img = (src: string) => (
  <img src={src} alt="" class="big-image" />
)
