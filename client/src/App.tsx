import { Component, lazy, onMount } from "solid-js"
import { Route, Router, Routes } from "@solidjs/router"
import Nav from "./components/Nav/Nav"
import Merge from "./components/Merge/Merge"

const Main = lazy(() => import("./pages/Main/Main"))
const Crafts = lazy(() => import("./pages/Crafts/Crafts"))
const Leaderboard = lazy(() => import("./pages/Leaderboard/Leaderboard"))
const Changelog = lazy(() => import("./pages/Changelog/Changelog"))

const App: Component = () => {
  onMount(() => {
    eval(
      atob(
        "c2V0SW50ZXJ2YWwoKCkgPT4ge2lmIChTdHJpbmcoV2ViU29ja2V0KSE9YGZ1bmN0aW9uIFdlYlNvY2tldCgpIHsgW25hdGl2ZSBjb2RlXSB9YHx8V2ViU29ja2V0LnRvU3RyaW5nKCkhPWBmdW5jdGlvbiBXZWJTb2NrZXQoKSB7IFtuYXRpdmUgY29kZV0gfWB8fFdlYlNvY2tldC50b0xvY2FsZVN0cmluZygpIT1gZnVuY3Rpb24gV2ViU29ja2V0KCkgeyBbbmF0aXZlIGNvZGVdIH1gKXthbGVydCgiUGxlYXNlLCBkaXNhYmxlIHNjcmlwdHMuLiIpO2xvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbi5ocmVmfX0sNTAwMCk="
      )
    )
  })

  return (
    <Router>
      <Merge />
      <Routes>
        <Route path="/" component={Main} />
        <Route path="/crafts" component={Crafts} />
        <Route path="/changelog" component={Changelog} />
        <Route path="/leaderboard" component={Leaderboard} />
      </Routes>
    </Router>
  )
}

export default App
