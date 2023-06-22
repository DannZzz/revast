import { Component } from "solid-js"
import MenuCenter from "./Menu/MenuCenter"
import "./Menu.scss"

const Menu: Component<{}> = (props) => {
  return (
    <div class="menu">
      <MenuCenter />
      <a
        href="https://discord.gg/anevqcFqjS"
        target="_blank"
        class="social discord"
      >
        <img src="images/social-discord.png" />
      </a>
      <div class="footer">
        <a style={{ "z-index": 10000 }} href="/terms?nonav" target="_blank">
          Terms of Service
        </a>
      </div>
    </div>
  )
}

export default Menu
