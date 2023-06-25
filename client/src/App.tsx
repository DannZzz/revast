import { Component, Suspense, lazy, onMount } from "solid-js"
import { Route, Router, Routes } from "@solidjs/router"
import Merge from "./components/Merge/Merge"
import { Transition } from "solid-transition-group"

const Main = lazy(() => import("./pages/Main/Main"))
const Crafts = lazy(() => import("./pages/Crafts/Crafts"))
const Leaderboard = lazy(() => import("./pages/Leaderboard/Leaderboard"))
const Changelog = lazy(() => import("./pages/Changelog/Changelog"))
const Tos = lazy(() => import("./pages/Tos/Tos"))

const App: Component = () => {
  onMount(() => {
    setInterval(() => {
      if (
        String(WebSocket) != `function WebSocket() { [native code] }` ||
        WebSocket.toString() != `function WebSocket() { [native code] }` ||
        WebSocket.toLocaleString() !=
          `function WebSocket() { [native code] }` ||
        String(WebSocket.prototype.send) !=
          `function send() { [native code] }` ||
        WebSocket.prototype.send.toString() !=
          `function send() { [native code] }` ||
        WebSocket.prototype.send.toLocaleString() !=
          `function send() { [native code] }`
      ) {
        alert("Please, disable scripts..")
        location.href = location.href
      }
    }, Math.random() * 6000 + 4000)
  })

  //   fallback={
  //     <div
  //       class="fallback-bg"
  //       style={{
  //         background: "#133a2b",
  //         width: "100vw",
  //         height: "100vh",
  //         display: "flex",
  //         "align-items": "center",
  //         "justify-content": "center",
  //       }}
  //     >
  //       <img src="images/loading1.png" width={300} height={300} />
  //     </div>
  //   }
  // >
  return (
    <Router>
      <Merge />
      <Routes>
        <Route path="/" component={Main} />
        <Route path="/crafts" component={Crafts} />
        <Route path="/changelog" component={Changelog} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/terms" component={Tos} />
      </Routes>
    </Router>
  )
}

export default App
