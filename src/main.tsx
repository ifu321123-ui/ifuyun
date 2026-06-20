import React from "react"
import ReactDOM from "react-dom/client"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import App from "./App"
import "./index.css"

import { isTouchLikeDevice } from "@/lib/scrollEnv"

gsap.registerPlugin(ScrollTrigger)

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual"
}

if (typeof window !== "undefined" && !isTouchLikeDevice()) {
  let resizeTimer = 0
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    },
    { passive: true },
  )
} else if (typeof window !== "undefined") {
  // iOS 地址栏伸缩会频繁触发 resize；防抖避免 ScrollTrigger 反复 refresh 导致回顶。
  let resizeTimer = 0
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    },
    { passive: true },
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
