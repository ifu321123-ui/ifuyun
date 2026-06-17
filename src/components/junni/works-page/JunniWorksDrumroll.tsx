import { CSSProperties, useCallback, useEffect, useRef } from "react"
import * as THREE from "three"
import type { WorksPageItem } from "./junniWorksPageData"

const STEP_DEG = 25
const FRONT_DEG = 0
const DEG2RAD = Math.PI / 180
const STEP_RAD = STEP_DEG * DEG2RAD
const PERSPECTIVE = 500
const PANEL_DEG = 51.1
const PANEL_RAD = PANEL_DEG * DEG2RAD
const PANEL_FADE_DEG = 18
const PANEL_VISIBLE_DEG = 58
const VISIBLE_THETA_DEG = 52
const SPIN_SIGN = 1
const TEX_ROTATION = -Math.PI / 2

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function splitText(text: string) {
  return Array.from(text).map((char) => (char === " " ? "\u00A0" : char))
}

function computeRadius(h: number) {
  return clamp(h * 0.52, 220, 520)
}

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
  active: number
  onActiveChange: (index: number) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function JunniWorksDrumroll({
  items,
  active,
  onActiveChange,
  page,
  totalPages,
  onPageChange,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<SceneRefs | null>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const navRef = useRef<HTMLLIElement | null>(null)
  const activeRef = useRef(active)
  const radiusRef = useRef(360)
  const wheelLock = useRef(false)

  const n = items.length
  const navIndex = n

  activeRef.current = active

  const updateDomItems = useCallback(
    (activeFloat: number) => {
      const radius = radiusRef.current
      const activeIndex = clamp(Math.round(activeFloat), 0, n - 1)

      itemRefs.current.forEach((item, i) => {
        if (!item) return
        const theta = FRONT_DEG + (activeFloat - i) * STEP_DEG
        const absTheta = Math.abs(theta)
        const rad = theta * DEG2RAD
        const y = -radius * Math.sin(rad)
        const z = radius * (Math.cos(rad) - 1)
        const isActive = i === activeIndex
        const isVisible = absTheta < VISIBLE_THETA_DEG
        const opacity = isVisible ? clamp(1 - (absTheta - 38) / 14, 0, 1) : 0

        item.style.transform = `translate(-50%, -50%) translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateX(${theta.toFixed(3)}deg)`
        item.style.opacity = `${opacity}`
        item.style.visibility = isVisible ? "visible" : "hidden"
        item.style.zIndex = `${Math.round(1000 - absTheta)}`
        item.dataset.active = String(isActive)
        item.dataset.visible = String(isVisible)
      })

      const navItem = navRef.current
      if (navItem) {
        const navTheta = FRONT_DEG + (activeFloat - navIndex) * STEP_DEG
        const navAbs = Math.abs(navTheta)
        const navRad = navTheta * DEG2RAD
        const navY = -radius * Math.sin(navRad)
        const navZ = radius * (Math.cos(navRad) - 1)
        const navVisible = navAbs < VISIBLE_THETA_DEG
        const navOpacity = navVisible ? clamp(1 - (navAbs - 38) / 14, 0, 1) : 0

        navItem.style.transform = `translate(-50%, -50%) translateY(${navY.toFixed(2)}px) translateZ(${navZ.toFixed(2)}px) rotateX(${navTheta.toFixed(3)}deg)`
        navItem.style.opacity = `${navOpacity}`
        navItem.style.visibility = navVisible ? "visible" : "hidden"
        navItem.dataset.visible = String(navVisible)
      }
    },
    [n, navIndex],
  )

  useEffect(() => {
    const onResize = () => {
      radiusRef.current = computeRadius(window.innerHeight)
      updateDomItems(activeRef.current)
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
      const w = rect.width || window.innerWidth
      const h = rect.height || window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.fov = (2 * Math.atan(h / 2 / PERSPECTIVE) * 180) / Math.PI
      camera.updateProjectionMatrix()
      const R = computeRadius(h)
      radiusRef.current = R
      drum.scale.setScalar(R)
      drum.position.z = -R
      updateDomItems(activeRef.current)
    }

    const renderFrame = () => {
      const a = activeRef.current
      updateDomItems(a)
      refs.spinner.rotation.y = SPIN_SIGN * a * STEP_RAD
      refs.panels.forEach(({ mat, mesh, index }) => {
        const eff = (a - index) * STEP_DEG
        const abs = Math.abs(eff)
        const t = clamp(1 - abs / PANEL_FADE_DEG, 0, 1)
        const b = 0.1 + t * t * 0.9
        mat.color.setScalar(b)
        mesh.scale.setScalar(1 + clamp(1 - abs / 44, 0, 1) * 0.012)
        mesh.renderOrder = Math.round(1000 - abs)
        mesh.visible = abs < PANEL_VISIBLE_DEG
      })
      renderer.render(refs.scene, refs.camera)
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
        const axial = aspect * PANEL_RAD
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
  }, [items, updateDomItems])

  useEffect(() => {
    updateDomItems(active)
  }, [active, updateDomItems])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (wheelLock.current) return
      wheelLock.current = true
      setTimeout(() => {
        wheelLock.current = false
      }, 280)

      const delta = e.deltaY > 0 ? 1 : -1
      const next = clamp(activeRef.current + delta, 0, n - 1)
      if (next !== activeRef.current) onActiveChange(next)
    }

    wrap.addEventListener("wheel", onWheel, { passive: false })
    return () => wrap.removeEventListener("wheel", onWheel)
  }, [n, onActiveChange])

  return (
    <div className="jwp__drumroll-wrap" ref={wrapRef}>
      <div className="jwp__drumroll-image" aria-hidden="true" />
      <canvas ref={canvasRef} className="jwp__drumroll-canvas" aria-hidden="true" />
      <div className="jwp__drumroll-scrim" aria-hidden="true" />
      <div className="jwp__drumroll-slider">
        <ul className="jwp__drumroll-list">
          {items.map((work, i) => {
            const descChars = splitText(work.description)
            return (
              <li
                key={work.slug}
                ref={(node) => {
                  itemRefs.current[i] = node
                }}
                className="jwp__drumroll-item"
                data-active={i === active}
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
          <li
            ref={navRef}
            className="jwp__drumroll-item jwp__drumroll-item--nav"
            data-nav=""
            data-visible="false"
          >
            {page > 1 && (
              <button
                type="button"
                className="jwp__drumroll-nav"
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
            )}
            {page < totalPages && (
              <button
                type="button"
                className="jwp__drumroll-nav"
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
            )}
          </li>
        </ul>
      </div>
    </div>
  )
}
