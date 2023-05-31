import { Component } from "solid-js"
import MenuCenter from "./Menu/MenuCenter"
import "./Menu.scss"

const Menu: Component<{}> = (props) => {
  return (
    <div class="menu">
      <MenuCenter />
    </div>
  )
}

export default Menu
