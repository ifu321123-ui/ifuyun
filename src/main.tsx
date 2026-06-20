import React from "react"
import ReactDOM from "react-dom/client"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import App from "./App"
import "./index.css"

import { installScrollTriggerResizeSync, markTouchStaticDocument } from "@/lib/scrollEnv"

gsap.registerPlugin(ScrollTrigger)

markTouchStaticDocument()

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual"
}

if (typeof window !== "undefined") {
  installScrollTriggerResizeSync(() => ScrollTrigger.refresh())
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
