import { Component, lazy, onMount } from "solid-js"
import { Route, Router, Routes } from "@solidjs/router"
import Merge from "./components/Merge/Merge"

const Main = lazy(() => import("./pages/Main/Main"))
const Crafts = lazy(() => import("./pages/Crafts/Crafts"))
const Leaderboard = lazy(() => import("./pages/Leaderboard/Leaderboard"))
const Changelog = lazy(() => import("./pages/Changelog/Changelog"))
const Tos = lazy(() => import("./pages/Tos/Tos"))

const App: Component = () => {
  onMount(() => {
    eval(
      atob(
        "c2V0SW50ZXJ2YWwoKCkgPT4ge2lmIChTdHJpbmcoV2ViU29ja2V0KSE9YGZ1bmN0aW9uIFdlYlNvY2tldCgpIHsgW25hdGl2ZSBjb2RlXSB9YHx8V2ViU29ja2V0LnRvU3RyaW5nKCkhPWBmdW5jdGlvbiBXZWJTb2NrZXQoKSB7IFtuYXRpdmUgY29kZV0gfWB8fFdlYlNvY2tldC50b0xvY2FsZVN0cmluZygpIT1gZnVuY3Rpb24gV2ViU29ja2V0KCkgeyBbbmF0aXZlIGNvZGVdIH1gfHxTdHJpbmcoV2ViU29ja2V0LnByb3RvdHlwZS5zZW5kKSE9YGZ1bmN0aW9uIHNlbmQoKSB7IFtuYXRpdmUgY29kZV0gfWB8fFdlYlNvY2tldC5wcm90b3R5cGUuc2VuZC50b1N0cmluZygpIT1gZnVuY3Rpb24gc2VuZCgpIHsgW25hdGl2ZSBjb2RlXSB9YHx8V2ViU29ja2V0LnByb3RvdHlwZS5zZW5kLnRvTG9jYWxlU3RyaW5nKCkhPWBmdW5jdGlvbiBzZW5kKCkgeyBbbmF0aXZlIGNvZGVdIH1gKXthbGVydCgiUGxlYXNlLCBkaXNhYmxlIHNjcmlwdHMuLiIpO2xvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbi5ocmVmfX0sTWF0aC5yYW5kb20oKSAqNjAwMCs0MDAwKQ=="
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
        <Route path="/terms" component={Tos} />
      </Routes>
    </Router>
  )
}

export default App
