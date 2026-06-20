import { CSSProperties, useEffect, useRef, useState } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import {
  FRONT_DEG,
  PANEL_ASPECT,
  PANEL_RAD,
  PANEL_VISIBLE_DEG,
  PERSPECTIVE,
  SPIN_SIGN,
  STEP_DEG,
  STEP_RAD,
  TEX_ROTATION,
  clamp,
  computeHomeWorksRadius,
  computePanelBox,
  drumrollItemOpacity,
  drumrollItemVisible,
  drumrollPanelBrightness,
  fitTextureCover,
  splitDrumrollText,
  workDrumrollSrc,
} from "./drumrollGeometry"
import { bindScrollTriggerUpdate } from "@/lib/scrollSync"
import { isTouchLikeDevice, shouldUseWebGL } from "@/lib/scrollEnv"
import { markHomeWorksReturn } from "@/hooks/useRoute"
import { junniWorks } from "./junniData"
import "./JunniWorks.css"

gsap.registerPlugin(ScrollTrigger)

/** 巨型层叠 WORKS 标题的回声副本（与原站 repeatText 同构） */
const TITLE_ECHOES = [
  { kind: "lower", ty: 18.6, delay: 0.16 },
  { kind: "lower", ty: 13.9, delay: 0.08 },
  { kind: "lower", ty: 7.8, delay: 0 },
  { kind: "upper", ty: -23.3, delay: 0.16 },
  { kind: "upper", ty: -13.9, delay: 0.08 },
  { kind: "upper", ty: -6.2, delay: 0 },
  { kind: "main", ty: 0, delay: 0 },
] as const

const N = junniWorks.length
const DEG2RAD = Math.PI / 180

type PanelRef = { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; index: number }
type SceneRefs = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  drum: THREE.Group
  spinner: THREE.Group
  panels: PanelRef[]
  raf: number
  running: boolean
}

export default function JunniWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<SceneRefs | null>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const progressRef = useRef(0)
  const radiusRef = useRef(
    typeof window === "undefined" ? 360 : computeHomeWorksRadius(window.innerHeight),
  )
  const activeIndexRef = useRef(0)
  const lenis = useLenis()

  const [activeTitle, setActiveTitle] = useState(junniWorks[0]?.title ?? "")

  useEffect(() => {
    const onResize = () => {
      radiusRef.current = computeHomeWorksRadius(window.innerHeight)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const updateDomItems = (active: number) => {
    const radius = radiusRef.current
    const progress = clamp(active / (N - 1), 0, 1)
    sectionRef.current?.style.setProperty("--junni-works-title-opacity", `${clamp(1 - progress * 3.4, 0, 1)}`)
    sectionRef.current?.style.setProperty("--junni-works-shift-opacity", `${clamp(1 - progress * 3.2, 0, 0.85)}`)

    const activeIndex = clamp(Math.round(active), 0, N - 1)
    if (activeIndex !== activeIndexRef.current) {
      activeIndexRef.current = activeIndex
      setActiveTitle(junniWorks[activeIndex]?.title ?? "")
    }

    itemRefs.current.forEach((item, i) => {
      if (!item) return
      const theta = FRONT_DEG + (active - i) * STEP_DEG
      const absTheta = Math.abs(theta)
      const rad = theta * DEG2RAD
      const y = -radius * Math.sin(rad)
      const z = radius * (Math.cos(rad) - 1)
      const isActive = i === activeIndex
      const isVisible = drumrollItemVisible(absTheta)
      const opacity = drumrollItemOpacity(absTheta)

      item.style.transform = `translate(-50%, -50%) translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(
        2,
      )}px) rotateX(${theta.toFixed(3)}deg)`
      item.style.opacity = `${opacity}`
      item.style.visibility = isVisible && opacity > 0.02 ? "visible" : "hidden"
      item.style.zIndex = `${Math.round(1000 - absTheta)}`
      item.dataset.active = String(isActive)
      item.dataset.visible = String(isVisible && opacity > 0.02)
      item
        .querySelector<HTMLAnchorElement>(".junni-works__item-link")
        ?.setAttribute("tabindex", isActive ? "0" : "-1")
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    const viewport = viewportRef.current
    if (!canvas || !section || !viewport) return

    updateDomItems(0)

    if (!shouldUseWebGL()) {
      section.dataset.webgl = "off"
      return
    }

    let disposed = false
    let renderer: THREE.WebGLRenderer | null = null
    let refs: SceneRefs | null = null

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouchLikeDevice() ? 1.25 : 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, 1, 1, 8000)
      camera.position.z = PERSPECTIVE

      const drum = new THREE.Group()
      drum.rotation.z = Math.PI / 2
      const spinner = new THREE.Group()
      drum.add(spinner)
      scene.add(drum)

      refs = {
        renderer,
        scene,
        camera,
        drum,
        spinner,
        panels: [],
        raf: 0,
        running: false,
      }
      sceneRef.current = refs
    } catch {
      section.dataset.webgl = "off"
      return
    }

    if (!refs || !renderer) return

    const resize = () => {
      const panelBox = computePanelBox(window.innerWidth)
      const rect = viewport.getBoundingClientRect()
      const w = rect.width || panelBox.width
      const h = rect.height || panelBox.height
      renderer!.setSize(w, h, false)
      refs!.camera.aspect = w / h
      refs!.camera.fov = (2 * Math.atan(h / 2 / PERSPECTIVE) * 180) / Math.PI
      refs!.camera.updateProjectionMatrix()
      const drumRadius = computeHomeWorksRadius(window.innerHeight)
      radiusRef.current = drumRadius
      refs!.drum.scale.setScalar(drumRadius)
      refs!.drum.position.z = -drumRadius
      updateDomItems(progressRef.current * (N - 1))
    }

    const renderFrame = () => {
      if (!refs || !renderer) return
      const p = progressRef.current
      const active = p * (N - 1)
      updateDomItems(active)
      refs.spinner.rotation.y = SPIN_SIGN * active * STEP_RAD
      refs.panels.forEach(({ mat, mesh, index }) => {
        const eff = (active - index) * STEP_DEG
        const a = Math.abs(eff)
        mat.color.setScalar(drumrollPanelBrightness(a))
        mesh.scale.setScalar(1 + clamp(1 - a / 44, 0, 1) * 0.012)
        mesh.renderOrder = Math.round(1000 - a)
        mesh.visible = a < PANEL_VISIBLE_DEG
      })
      renderer.render(refs.scene, refs.camera)
      if (refs.running) refs.raf = requestAnimationFrame(renderFrame)
    }

    const start = () => {
      if (!refs) return
      if (refs.running) return
      refs.running = true
      refs.raf = requestAnimationFrame(renderFrame)
    }
    const stop = () => {
      if (!refs) return
      refs.running = false
      cancelAnimationFrame(refs.raf)
    }

    const loader = new THREE.TextureLoader()
    const loads = junniWorks
      .map((work, index) => ({ work, index }))
      .filter(({ work }) => !!workDrumrollSrc(work))
      .map(
        ({ work, index }) =>
          new Promise<{ index: number; tex: THREE.Texture } | null>((resolve) => {
            loader.load(
              workDrumrollSrc(work),
              (tex) => resolve({ index, tex }),
              undefined,
              () => resolve(null),
            )
          }),
      )

    Promise.all(loads).then((results) => {
      if (disposed || !refs || !renderer) return
      results.forEach((res) => {
        if (!res) return
        const { index, tex } = res
        const img = tex.image as HTMLImageElement
        const work = junniWorks[index]
        const aspect = img?.naturalWidth ? img.naturalWidth / img.naturalHeight : 16 / 9
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        tex.center.set(0.5, 0.5)
        tex.rotation = TEX_ROTATION
        fitTextureCover(tex, aspect, PANEL_ASPECT, work?.drumrollFocal ?? "center")
        const axial = PANEL_ASPECT * PANEL_RAD
        const geo = new THREE.CylinderGeometry(1, 1, axial, 64, 1, true, -PANEL_RAD / 2, PANEL_RAD)
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: false,
          side: THREE.FrontSide,
          depthTest: true,
          depthWrite: true,
          toneMapped: false,
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.rotation.y = -SPIN_SIGN * index * STEP_RAD
        refs!.spinner.add(mesh)
        refs!.panels.push({ mesh, mat, index })
      })
      resize()
      renderer!.render(refs!.scene, refs!.camera)
    })

    resize()
    window.addEventListener("resize", resize)

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
      { threshold: 0 },
    )
    io.observe(section)

    return () => {
      disposed = true
      io.disconnect()
      stop()
      window.removeEventListener("resize", resize)
      refs?.panels.forEach(({ mesh, mat }) => {
        mesh.geometry.dispose()
        mat.map?.dispose()
        mat.dispose()
      })
      renderer?.dispose()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressRef.current = self.progress
        updateDomItems(self.progress * (N - 1))
      },
    })

    progressRef.current = trigger.progress
    updateDomItems(trigger.progress * (N - 1))

    const unbindScroll = bindScrollTriggerUpdate(lenis)
    ScrollTrigger.refresh()

    return () => {
      unbindScroll()
      trigger.kill()
    }
  }, [lenis])

  const stageVars = {
    "--junni-works-title-opacity": 1,
    "--junni-works-shift-opacity": 0.85,
  } as CSSProperties

  return (
    <section
      ref={sectionRef}
      className="junni-works"
      data-menu-bg="dark"
      data-gooey-color="yellow"
      aria-label="WORKS"
      style={stageVars}
    >
      <div className="junni-works__pin">
        <h2 className="junni-works__title repeatText" aria-label="WORKS">
          <span className="junni-works__title-wrap text-repeat" data-rep-txt="home_works">
            {TITLE_ECHOES.map((echo) => (
              <span
                key={`${echo.kind}-${echo.ty}`}
                className="junni-works__title-echo"
                data-rep-txt-item={echo.kind}
                style={
                  {
                    "--junni-works-title-y": `${echo.ty}%`,
                    "--junni-works-title-delay": `${echo.delay}s`,
                  } as CSSProperties
                }
              >
                WORKS
              </span>
            ))}
          </span>
        </h2>

        <div className="junni-works__inner">
          <div className="junni-works__viewport" ref={viewportRef} aria-hidden="true">
            <canvas ref={canvasRef} className="junni-works__webgl" />
            <div className="junni-works__scrim" />
          </div>

          <div className="junni-works__slider">
            <ul className="junni-works__list">
              {junniWorks.map((work, i) => {
                const descChars = splitDrumrollText(work.description)
                const isActive = i === 0
                return (
                  <li
                    key={work.slug}
                    ref={(node) => {
                      itemRefs.current[i] = node
                    }}
                    className="junni-works__item"
                    data-works={work.slug}
                    data-active={isActive}
                    data-visible="false"
                  >
                    <a
                      href={work.href}
                      className="junni-works__item-link"
                      data-circle-cursor="more_detail"
                      data-slug={work.slug}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => {
                        markHomeWorksReturn(window.scrollY)
                      }}
                    >
                      <span className="junni-works__item-title" data-size={work.titleSize ?? "normal"}>
                        {work.title}
                      </span>
                      <span className="junni-works__item-desc" aria-label={work.description}>
                        {descChars.map((char, charIndex) => (
                          <span
                            key={`${work.slug}-${charIndex}`}
                            translate="no"
                            className="junni-works__item-desc-char"
                            style={{ "--transition-delay": `${charIndex * 0.03}s` } as CSSProperties}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="junni-works__shift" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="junni-works__shift-layer" />
          ))}
        </div>
      </div>

      <span className="junni-works__sr" aria-live="polite">
        {activeTitle}
      </span>
    </section>
  )
}
