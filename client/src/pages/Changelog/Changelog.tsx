import "./Changelog.scss"
import { cg_big_img, cg_list, cg_small_img, cg_title } from "./helper"

const Changelog = () => {
  return (
    <div class="changelog">
      <div class="container">
        <div class="version">
          {cg_title("- 21/6/2023 - Craft Easier!")}
          <div class="content">
            {cg_small_img("/images/craft-book.png")}
            {cg_list("Added", ["InGame craft list (BOOK)", "Terms of Service"])}
          </div>
        </div>
        <div class="version">
          {cg_title("- 21/6/2023 - Clans Are Arrived")}
          <div class="content">
            {cg_big_img("/images/clan-icon.png")}
            <span>Create your clan and have a fun with friends!</span>
            {cg_list("Information", [
              "Maximum 9 members can be in a clan (THE LEADER AND 8 MEMBERS)",
              "Clan members can open doors(spike doors) created by another member",
              "Clan members cannot damage each other, also their spikes have no damage",
              "Clan Leaders can make their clan private by making clan invisible to others",
              "Clan Leaders will get a notification when someone will try to join",
              "Clan Leaders are able to kick their members",
            ])}
          </div>
        </div>
        <div class="version">
          {cg_title("- 20/6/2023 - Spiky")}
          <div class="content">
            <div class="group">
              {cg_small_img("/api/images/wooden-spike.webp")}
              {cg_small_img("/api/images/wooden-spike-door-closed.webp")}
            </div>
            <span>FINALLY SPIKES ARE HERE!</span>
            <div class="group">
              {cg_small_img("/api/images/stone-spike.webp")}
              {cg_small_img("/api/images/stone-spike-door-closed.webp")}
              {cg_small_img("/api/images/golden-spike.webp")}
              {cg_small_img("/api/images/golden-spike-door-closed.webp")}
              {cg_small_img("/api/images/diamond-spike.webp")}
              {cg_small_img("/api/images/diamond-spike-door-closed.webp")}
            </div>
            <div class="group">
              {cg_small_img("/api/images/amethyst-spike.webp")}
              {cg_small_img("/api/images/amethyst-spike-door-closed.webp")}
              {cg_small_img("/api/images/ruby-spike.webp")}
              {cg_small_img("/api/images/ruby-spike-door-closed.webp")}
            </div>
            {cg_list("Added", ["Spikes and Spike Doors"])}
            {cg_list("Changed", [
              "Healing effect was buffed",
              "Your body will show when you will get damage",
              "Building Cooldown: 0.8s --> 1s",
              "Beach is smaller",
              "Player collisions with static objects were changed",
            ])}
          </div>
        </div>
        <div class="version">
          {cg_title("- 12/6/2023 - Water and Oxygen")}
          <div class="content">
            {cg_big_img("/images/water-walk.png")}
            <div class="group">
              {cg_small_img("/api/images/diving-suit.webp")}
              {cg_small_img("/api/images/hat.webp")}
            </div>
            {cg_list("Added", [
              "Diving Suit (NEXT LEVEL OF DIVING MASK)",
              "New Cool Hat (EASY TO SURVIVE IN WINTER)",
              "New Effect while being in water",
            ])}
            {cg_list("Changed", [
              "Piranhas and Megalodons speed was decreased",
              "Megalodons cannot come ashore",
              "Also all mob's damage speed was decreased too",
              "Building Cooldown: 1.2s --> 0.8s",
              "More Berry Bushes in the Forest biome",
              "Berry Seeds growing and dehydrating time was increased",
            ])}
          </div>
        </div>
        <div class="version">
          {cg_title("- 10/6/2023 - Welcome to the World of Farm")}
          <div class="content">
            <div class="group">
              {cg_small_img("/api/images/plot.webp")}
              {cg_small_img("/api/images/berry-seeds.webp")}
              {cg_small_img("/api/images/watering-can.webp")}
              {cg_small_img("/api/images/full-watering-can-icon.webp")}
            </div>
            {cg_list("Added", [
              "Plots, berry seeds and watering can (NOW YOU CAN BE A REAL FARMER!)",
            ])}
            {cg_list("Fixed", ["Craft visualation losing"])}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Changelog
