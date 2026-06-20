import React from "react"
import ReactDOM from "react-dom/client"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import App from "./App"
import "./index.css"

import { clearHomeWorksReturn } from "@/hooks/useRoute"
import {
  isTouchLikeDevice,
  markTouchStaticDocument,
  setupEmbeddedBrowserLifecycle,
} from "@/lib/scrollEnv"

gsap.registerPlugin(ScrollTrigger)

markTouchStaticDocument()
setupEmbeddedBrowserLifecycle(clearHomeWorksReturn)

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
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
