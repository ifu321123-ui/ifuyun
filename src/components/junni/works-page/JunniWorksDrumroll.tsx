import { CSSProperties, useCallback, useEffect, useRef } from "react"
import * as THREE from "three"
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
  computeDrumRadius,
  computePanelBox,
  drumrollItemOpacity,
  drumrollItemVisible,
  drumrollPanelBrightness,
  fitTextureCover,
  splitDrumrollText,
} from "../drumrollGeometry"
import type { WorksPageItem } from "./junniWorksPageData"

const DEG2RAD = Math.PI / 180

/** Phase past last work item until every WebGL panel leaves the visible arc (|Δ|×25° ≥ 58°). */
export const DRUMROLL_EXIT_WORK_MARGIN = 2.5
/** Hold on empty nav screen before page scroll continues to footer. */
export const DRUMROLL_NAV_HOLD_MARGIN = 1.2

export function getDrumrollImagesGonePhase(itemCount: number) {
  return Math.max(0, itemCount - 1) + DRUMROLL_EXIT_WORK_MARGIN
}

export function getDrumrollNavStartPhase(itemCount: number) {
  return getDrumrollImagesGonePhase(itemCount)
}

export function getDrumrollPhaseMax(itemCount: number) {
  return getDrumrollImagesGonePhase(itemCount) + DRUMROLL_NAV_HOLD_MARGIN
}

/** @deprecated Use getDrumrollPhaseMax — kept for grep compatibility */
export const DRUMROLL_EXIT_MARGIN = DRUMROLL_EXIT_WORK_MARGIN + DRUMROLL_NAV_HOLD_MARGIN

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

type Props = {
  items: WorksPageItem[]
  /** Continuous drum phase (0 … getDrumrollPhaseMax(items.length)). */
  active: number
  onActiveIndexChange?: (index: number) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function JunniWorksDrumroll({
  items,
  active,
  onActiveIndexChange,
  page,
  totalPages,
  onPageChange,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<SceneRefs | null>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const navOverlayRef = useRef<HTMLElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const targetActiveRef = useRef(active)
  const smoothActiveRef = useRef(active)
  const radiusRef = useRef(360)
  const activeIndexRef = useRef(Math.round(active))

  const n = items.length
  const imagesGonePhase = getDrumrollImagesGonePhase(n)
  const navStartPhase = getDrumrollNavStartPhase(n)

  targetActiveRef.current = active

  const updateStageChrome = useCallback(
    (activeFloat: number) => {
      const wrap = wrapRef.current
      const viewport = viewportRef.current
      const navOverlay = navOverlayRef.current
      if (!wrap) return

      const fadeStart = imagesGonePhase - 0.55
      const imagesFade = clamp((activeFloat - fadeStart) / 0.55, 0, 1)
      const imagesGone = activeFloat >= imagesGonePhase - 0.04
      const navFade = clamp((activeFloat - navStartPhase) / 0.45, 0, 1)
      const navVisible = activeFloat >= navStartPhase - 0.02

      wrap.dataset.imagesGone = String(imagesGone)
      wrap.dataset.navVisible = String(navVisible)
      wrap.dataset.stage = imagesGone ? "nav" : activeFloat > n - 1 + 0.08 ? "exit" : "works"

      if (viewport) {
        viewport.style.opacity = `${1 - imagesFade}`
        viewport.style.visibility = imagesFade >= 0.98 ? "hidden" : "visible"
      }
      if (navOverlay) {
        navOverlay.style.opacity = `${navFade}`
        navOverlay.style.visibility = navFade > 0.02 ? "visible" : "hidden"
        navOverlay.style.pointerEvents = navFade > 0.85 ? "auto" : "none"
      }
    },
    [imagesGonePhase, navStartPhase, n],
  )

  const emitActiveIndex = useCallback(
    (activeFloat: number) => {
      const index = clamp(Math.round(Math.min(activeFloat, n - 1)), 0, n - 1)
      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index
        onActiveIndexChange?.(index)
      }
    },
    [n, onActiveIndexChange],
  )

  const updateDomItems = useCallback(
    (activeFloat: number) => {
      const radius = radiusRef.current
      const spinPhase = Math.min(activeFloat, imagesGonePhase)
      const activeIndex = clamp(Math.round(spinPhase), 0, n - 1)
      const titleFadeStart = imagesGonePhase - 0.65
      const titleFade =
        activeFloat < titleFadeStart ? 1 : clamp(1 - (activeFloat - titleFadeStart) / 0.35, 0, 1)

      itemRefs.current.forEach((item, i) => {
        if (!item) return
        const theta = FRONT_DEG + (spinPhase - i) * STEP_DEG
        const absTheta = Math.abs(theta)
        const rad = theta * DEG2RAD
        const y = -radius * Math.sin(rad)
        const z = radius * (Math.cos(rad) - 1)
        const isActive = i === activeIndex
        const isVisible = drumrollItemVisible(absTheta, titleFade)
        const opacity = drumrollItemOpacity(absTheta, titleFade)

        item.style.transform = `translate(-50%, -50%) translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateX(${theta.toFixed(3)}deg)`
        item.style.opacity = `${opacity}`
        item.style.visibility = isVisible && opacity > 0.02 ? "visible" : "hidden"
        item.style.zIndex = `${Math.round(1000 - absTheta)}`
        item.dataset.active = String(isActive)
        item.dataset.visible = String(isVisible && opacity > 0.02)
      })

      updateStageChrome(activeFloat)
    },
    [imagesGonePhase, n, updateStageChrome],
  )

  useEffect(() => {
    const onResize = () => {
      radiusRef.current = computeDrumRadius(window.innerWidth)
      updateDomItems(smoothActiveRef.current)
    }
    window.addEventListener("resize", onResize)
    onResize()
    return () => window.removeEventListener("resize", onResize)
  }, [updateDomItems])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 1, 8000)
    camera.position.z = PERSPECTIVE

    const drum = new THREE.Group()
    drum.rotation.z = Math.PI / 2
    const spinner = new THREE.Group()
    drum.add(spinner)
    scene.add(drum)

    const refs: SceneRefs = {
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

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const panelBox = computePanelBox(window.innerWidth)
      const w = rect.width || panelBox.width
      const h = rect.height || panelBox.height
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.fov = (2 * Math.atan(h / 2 / PERSPECTIVE) * 180) / Math.PI
      camera.updateProjectionMatrix()
      const drumRadius = computeDrumRadius(window.innerWidth)
      radiusRef.current = drumRadius
      drum.scale.setScalar(drumRadius)
      drum.position.z = -drumRadius
      updateDomItems(smoothActiveRef.current)
    }

    const imagesGone = getDrumrollImagesGonePhase(n)

    const renderFrame = () => {
      const phaseMax = getDrumrollPhaseMax(n)
      const target = clamp(targetActiveRef.current, 0, phaseMax)
      const current = smoothActiveRef.current
      const diff = target - current
      const absDiff = Math.abs(diff)
      const edgeDistance = Math.min(target, phaseMax - target)
      const edgeDrag = edgeDistance <= 0.35 ? 0.78 : 1
      const damping = clamp((0.14 + absDiff * 0.1) * edgeDrag, 0.12, 0.34)
      const next = current + diff * damping
      smoothActiveRef.current = next

      const spinPhase = Math.min(next, imagesGone)
      const canvasFade = clamp((next - (imagesGone - 0.55)) / 0.55, 0, 1)

      emitActiveIndex(next)
      updateDomItems(next)
      refs.spinner.rotation.y = SPIN_SIGN * spinPhase * STEP_RAD
      refs.panels.forEach(({ mat, mesh, index }) => {
        const eff = (spinPhase - index) * STEP_DEG
        const abs = Math.abs(eff)
        mat.color.setScalar(drumrollPanelBrightness(abs, canvasFade))
        mesh.scale.setScalar(1 + clamp(1 - abs / 44, 0, 1) * 0.012)
        mesh.renderOrder = Math.round(1000 - abs)
        mesh.visible = canvasFade < 0.98 && abs < PANEL_VISIBLE_DEG
      })
      if (canvasFade < 0.98) {
        renderer.render(refs.scene, refs.camera)
      }
      if (refs.running) refs.raf = requestAnimationFrame(renderFrame)
    }

    const start = () => {
      if (refs.running) return
      refs.running = true
      refs.raf = requestAnimationFrame(renderFrame)
    }
    const stop = () => {
      refs.running = false
      cancelAnimationFrame(refs.raf)
    }

    let disposed = false
    const loader = new THREE.TextureLoader()
    const loads = items
      .map((work, index) => ({ work, index }))
      .filter(({ work }) => !!work.image)
      .map(
        ({ work, index }) =>
          new Promise<{ index: number; tex: THREE.Texture } | null>((resolve) => {
            loader.load(work.image, (tex) => resolve({ index, tex }), undefined, () => resolve(null))
          }),
      )

    Promise.all(loads).then((results) => {
      if (disposed) return
      results.forEach((res) => {
        if (!res) return
        const { index, tex } = res
        const img = tex.image as HTMLImageElement
        const aspect = img?.naturalWidth ? img.naturalWidth / img.naturalHeight : 16 / 9
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        tex.center.set(0.5, 0.5)
        tex.rotation = TEX_ROTATION
        fitTextureCover(tex, aspect, PANEL_ASPECT)
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
        refs.spinner.add(mesh)
        refs.panels.push({ mesh, mat, index })
      })
      resize()
      start()
    })

    resize()
    window.addEventListener("resize", resize)

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
      { threshold: 0 },
    )
    io.observe(wrap)

    return () => {
      disposed = true
      io.disconnect()
      stop()
      window.removeEventListener("resize", resize)
      refs.panels.forEach(({ mesh, mat }) => {
        mesh.geometry.dispose()
        mat.map?.dispose()
        mat.dispose()
      })
      renderer.dispose()
      sceneRef.current = null
    }
  }, [items, updateDomItems, emitActiveIndex, n])

  useEffect(() => {
    targetActiveRef.current = active
    if (Math.abs(smoothActiveRef.current - active) < 0.0001) {
      smoothActiveRef.current = active
      updateDomItems(active)
    }
  }, [active, updateDomItems])

  return (
    <div className="jwp__drumroll-wrap" ref={wrapRef} data-stage="works">
      <div className="jwp__drumroll-viewport" ref={viewportRef} aria-hidden="true">
        <canvas ref={canvasRef} className="jwp__drumroll-canvas" />
      </div>
      <div className="jwp__drumroll-scrim" aria-hidden="true" />
      <div className="jwp__drumroll-slider">
        <ul className="jwp__drumroll-list">
          {items.map((work, i) => {
            const descChars = splitDrumrollText(work.description)
            return (
              <li
                key={work.slug}
                ref={(node) => {
                  itemRefs.current[i] = node
                }}
                className="jwp__drumroll-item"
                data-active={i === Math.round(active)}
                data-visible="false"
              >
                <a className="jwp__drumroll-link" href={`#work/${work.slug}`}>
                  <span className="jwp__drumroll-title" data-size={work.titleSize ?? "normal"}>
                    {work.title}
                  </span>
                  <span className="jwp__drumroll-desc" aria-label={work.description}>
                    {descChars.map((char, charIndex) => (
                      <span
                        key={`${work.slug}-${charIndex}`}
                        className="jwp__drumroll-desc-char"
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
      <nav
        ref={navOverlayRef}
        className="jwp__drumroll-nav-overlay"
        aria-label="作品ページネーション"
      >
        {page > 1 ? (
          <button
            type="button"
            className="jwp__drumroll-nav jwp__drumroll-nav--prev"
            data-nav="prev"
            onClick={() => onPageChange(page - 1)}
          >
            <i className="jwp__drumroll-nav-arrow" aria-hidden="true">
              <svg viewBox="0 0 37.77 66.93" xmlns="http://www.w3.org/2000/svg">
                <path d="M34.77,3L3,32.57l31.77,31.36" />
              </svg>
            </i>
            <span className="jwp__drumroll-nav-en">PREV</span>
            <span className="jwp__drumroll-nav-ja">前のページ</span>
          </button>
        ) : (
          <span className="jwp__drumroll-nav-spacer" aria-hidden="true" />
        )}
        {page < totalPages ? (
          <button
            type="button"
            className="jwp__drumroll-nav jwp__drumroll-nav--next"
            data-nav="next"
            data-active={page < totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <i className="jwp__drumroll-nav-arrow" aria-hidden="true">
              <svg viewBox="0 0 37.77 66.93" xmlns="http://www.w3.org/2000/svg">
                <path d="M3,3l31.77,29.57L3,63.93" />
              </svg>
            </i>
            <span className="jwp__drumroll-nav-en">NEXT</span>
            <span className="jwp__drumroll-nav-ja">次のページ</span>
          </button>
        ) : (
          <span className="jwp__drumroll-nav-spacer" aria-hidden="true" />
        )}
      </nav>
    </div>
  )
}

