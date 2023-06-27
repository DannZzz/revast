import { Component } from "solid-js"
import MenuCenter from "./Menu/MenuCenter"
import "./Menu.scss"
import { DISCORD_SERVER_LINK } from "../../../constants"
import Skins from "./Menu/Skins/Skins"
import ChangelogPreview from "./Menu/ChangelogPreview/ChangelogPreview"

const Menu: Component<{}> = (props) => {
  return (
    <div class="menu">
      <MenuCenter />
      <Skins />
      <ChangelogPreview />
      <a href={DISCORD_SERVER_LINK} target="_blank" class="social discord">
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
