import React from "react"
import ReactDOM from "react-dom/client"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import App from "./App"
import "./index.css"

gsap.registerPlugin(ScrollTrigger)

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual"
}

if (typeof window !== "undefined") {
  let resizeTimer = 0
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    },
    { passive: true },
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
