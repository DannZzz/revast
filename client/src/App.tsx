import { Component, lazy, onMount } from "solid-js"
import { Route, Router, Routes } from "@solidjs/router"
import Nav from "./components/Nav/Nav"

const Main = lazy(() => import("./pages/Main/Main"))
const Crafts = lazy(() => import("./pages/Crafts/Crafts"))
const Leaderboard = lazy(() => import("./pages/Leaderboard/Leaderboard"))
const Changelog = lazy(() => import("./pages/Changelog/Changelog"))

const App: Component = () => {
  return (
    <Router>
      <Nav />
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
