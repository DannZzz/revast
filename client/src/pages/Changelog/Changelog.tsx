import "./Changelog.scss"
import { cg_list, cg_small_img, cg_title } from "./helper"

const Changelog = () => {
  return (
    <div class="changelog">
      <div class="container">
        <div class="version">
          {cg_title("- 10/9/2023 - Welcome to the World of Farm")}
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
