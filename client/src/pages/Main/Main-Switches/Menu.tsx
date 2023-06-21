import { Component } from "solid-js"
import MenuCenter from "./Menu/MenuCenter"
import "./Menu.scss"

const Menu: Component<{}> = (props) => {
  return (
    <div class="menu">
      <MenuCenter />
      <div class="footer">
        <a style={{ "z-index": 10000 }} href="/terms?nonav" target="_blank">
          Terms of Service
        </a>
      </div>
    </div>
  )
}

export default Menu
