import "./Changelog.scss"
import { cg_big_img, cg_list, cg_small_img, cg_title } from "./helper"

const Changelog = () => {
  return (
    <div class="changelog">
      <div class="container">
        <div class="version">
          {cg_title("- 27/6/2023 - Islands And Treasures")}
          <div class="content">
            {cg_big_img("/images/islands-preview.png")}
            <span>EXPLORE THE ISLANDS AND FIND LOST TREASURES</span>
            <div class="group">
              {cg_small_img("/api/images/skin9.png")}
              {cg_small_img("/api/images/golden-double-sword-icon.png")}
            </div>
            {cg_list("Added", [
              "New Skin",
              "New Double Sword (CAN BE FOUND ON THE ISLANDS)",
            ])}
            {cg_list("Fixed", [
              "Winter cave",
              "Furnace and Chest craft durations",
              "Mobs visual bugs",
            ])}
          </div>
        </div>
        <div class="version">
          {cg_title("- 25/6/2023 - Skins And Footprints!")}
          <div class="content">
            <div class="group">
              {cg_small_img("/api/images/skin6.png")}
              {cg_small_img("/api/images/skin7.png")}
              {cg_small_img("/api/images/skin8.png")}
            </div>
          </div>
        </div>
        <div class="version">
          {cg_title("- 25/6/2023 - Regeneration!")}
          <div class="content">
            <div class="group">
              {cg_small_img("/api/images/bandage.png")}
              {cg_small_img("/images/bandage-activated.png")}
            </div>
            <span>Use bandages to buff your health Regeneration!</span>
            <span>NEW SKIN (TEMPORARY)</span>
            {cg_small_img("/api/images/skin5.png")}
            {cg_list("Changed", ["Killing a wolf gives 1 more fur (now 2)"])}
          </div>
        </div>
        <div class="version">
          {cg_title("- 23/6/2023 - Skins!")}
          <div class="content">
            <div class="group">
              {cg_small_img("/api/images/skin1.png")}
              {cg_small_img("/api/images/skin3.png")}
              {cg_small_img("/api/images/skin4.png")}
            </div>
            {cg_list("Added", ["New Skins"])}
            {cg_list("Fixed", ["Visual bug while crafting"])}
          </div>
        </div>
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
              {cg_small_img("/api/images/wooden-spike.png")}
              {cg_small_img("/api/images/wooden-spike-door-closed.png")}
            </div>
            <span>FINALLY SPIKES ARE HERE!</span>
            <div class="group">
              {cg_small_img("/api/images/stone-spike.png")}
              {cg_small_img("/api/images/stone-spike-door-closed.png")}
              {cg_small_img("/api/images/golden-spike.png")}
              {cg_small_img("/api/images/golden-spike-door-closed.png")}
              {cg_small_img("/api/images/diamond-spike.png")}
              {cg_small_img("/api/images/diamond-spike-door-closed.png")}
            </div>
            <div class="group">
              {cg_small_img("/api/images/amethyst-spike.png")}
              {cg_small_img("/api/images/amethyst-spike-door-closed.png")}
              {cg_small_img("/api/images/ruby-spike.png")}
              {cg_small_img("/api/images/ruby-spike-door-closed.png")}
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
              {cg_small_img("/api/images/diving-suit.png")}
              {cg_small_img("/api/images/hat.png")}
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
              {cg_small_img("/api/images/plot.png")}
              {cg_small_img("/api/images/berry-seeds.png")}
              {cg_small_img("/api/images/watering-can.png")}
              {cg_small_img("/api/images/full-watering-can-icon.png")}
            </div>
            {cg_list("Added", [
              "Plots, berry seeds and watering can (NOW YOU CAN BE A REAL FARMER!)",
            ])}
            {cg_list("Fixed", ["Craft visualization losing"])}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Changelog
