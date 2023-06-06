import { Accessor, onCleanup } from "solid-js"

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      clickOutside: () => any
      clickInside: () => any
    }
  }
}

function clickOutside(el: HTMLElement, accessor: Accessor<any>) {
  const onClick = (e) => !el.contains(e.target) && accessor()?.()
  document.body.addEventListener("click", onClick)

  onCleanup(() => document.body.removeEventListener("click", onClick))
}

function clickInside(el: HTMLElement, accessor: Accessor<any>) {
  const onClick = (e) => el.contains(e.target) && accessor()?.()
  document.body.addEventListener("click", onClick)

  onCleanup(() => document.body.removeEventListener("click", onClick))
}

export default {
  clickOutside,
  clickInside,
}
