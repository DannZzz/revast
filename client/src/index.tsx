/* @refresh reload */
import { Buffer } from "buffer"

// @ts-ignore
window.Buffer = Buffer
import { render } from "solid-js/web"
import "@thisbeyond/solid-select/style.css"
import initTypes from "datypes"
initTypes()
import "./index.scss"
import "./data-templates/teamplates"
import App from "./App"

const root = document.getElementById("root")

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?"
  )
}

render(() => <App />, root!)
