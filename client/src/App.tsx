import { Component, lazy, onMount } from "solid-js"
import Main from "./pages/Main/Main"
import { Route, Router, Routes } from "@solidjs/router"

const Crafts = lazy(() => import("./pages/Crafts/Crafts"))

const App: Component = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" component={Main} />
        <Route path="/crafts" component={Crafts} />
      </Routes>
    </Router>
  )
}

export default App
