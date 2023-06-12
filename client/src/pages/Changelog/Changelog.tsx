import "./Changelog.scss"
import { cg_big_img, cg_list, cg_small_img, cg_title } from "./helper"

const Changelog = () => {
  return (
    <div class="changelog">
      <div class="container">
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
