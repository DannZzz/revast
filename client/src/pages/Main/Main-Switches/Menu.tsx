import { Component } from "solid-js"
import MenuCenter from "./Menu/MenuCenter"

const Menu: Component<{}> = (props) => {
  return (
    <div class="flex justify-center pb-96 w-full h-full">
      <MenuCenter />
    </div>
  )
}

export default Menu
