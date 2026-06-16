import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
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

/**
 * 原站 home_works 几何（由原站 DOM 的 translate3d/rotateX 反推 + CDP 实测）：
 *  - 每项间隔 25°，active 在正前方 θ≈0
 *  - θ_i = (active − i) × STEP      （active = progress × (N−1)）
 *  - Y_i = −R·sin(θ)，Z_i = R·(cos(θ)−1)，R ≈ vh×0.52
 *  - perspective ≈ 500px（实测 .home_works_list）
 * WebGL 曲面图片层与 DOM 文字标题共用同一套角度/半径/透视 → 图片弯曲贴在「开放圆筒弧」上，背面无几何=纯深底。
 */
const STEP_DEG = 25
const FRONT_DEG = 0
const DEG2RAD = Math.PI / 180
const STEP_RAD = STEP_DEG * DEG2RAD

/** WebGL 曲面参数（可调） */
const PERSPECTIVE = 500 // 与 DOM perspective 对齐
const PANEL_DEG = 46 // 单张图片在圆周方向张角（决定屏幕上的高度；与原站一致会与相邻图重叠、前图遮后图）
const PANEL_RAD = PANEL_DEG * DEG2RAD
const SPIN_SIGN = -1 // 旋转方向：让图片随滚动「自下而上」与文字标题同向（按截图校准）
const TEX_ROTATION = -Math.PI / 2 // 贴图旋正（圆周→屏幕竖直，需转 90°）

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function splitText(text: string) {
  return Array.from(text).map((char) => (char === " " ? "\u00A0" : char))
}

/** 视口尺寸 → 圆柱半径（实测原站 R≈vh×0.52：327@626、387@744，由高度驱动） */
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

export default function JunniWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<SceneRefs | null>(null)
  const progressRef = useRef(0)
  const lenis = useLenis()

  const [progress, setProgress] = useState(0)
  const [radius, setRadius] = useState(() =>
    typeof window === "undefined" ? 360 : computeRadius(window.innerHeight),
  )

  // 视口变化时重算 DOM 标题半径
  useEffect(() => {
    const onResize = () => setRadius(computeRadius(window.innerHeight))
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // ── WebGL：开放圆筒弧的曲面图片层（仅初始化一次） ──────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 1, 8000)
    camera.position.z = PERSPECTIVE

    const drum = new THREE.Group()
    drum.rotation.z = Math.PI / 2 // 圆柱轴 → 屏幕水平（X）
    const spinner = new THREE.Group() // 绕水平轴自转（随滚动）
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
      drum.scale.setScalar(R) // 单位半径几何 → R（与 DOM 同半径）
      drum.position.z = -R // 圆筒前表面落在 z=0 → 与 DOM perspective 对齐
    }

    const renderFrame = () => {
      const p = progressRef.current
      const active = p * (N - 1)
      refs.spinner.rotation.y = SPIN_SIGN * active * STEP_RAD
      refs.panels.forEach(({ mat, mesh, index }) => {
        const eff = (active - index) * STEP_DEG // 该图相对正前方的角度（度）
        const a = Math.abs(eff)
        // 正前方最亮，越偏越暗、越偏越淡（>~75° 基本消失）
        mat.opacity = clamp(1 - (a - 6) / 78, 0, 1)
        const b = clamp(0.34 + (1 - a / 92) * 0.66, 0.3, 1)
        mat.color.setScalar(b)
        mesh.renderOrder = Math.round(300 - a) // 前图后绘制=盖住后图
        mesh.visible = a < 96
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

    // 预加载 5 张作品图（and_more 无图 → 无 mesh，那一段保持空）后建曲面
    let disposed = false
    const loader = new THREE.TextureLoader()
    const loads = junniWorks
      .map((work, index) => ({ work, index }))
      .filter(({ work }) => !!work.image)
      .map(
        ({ work, index }) =>
          new Promise<{ index: number; tex: THREE.Texture } | null>((resolve) => {
            loader.load(
              work.image,
              (tex) => resolve({ index, tex }),
              undefined,
              () => resolve(null),
            )
          }),
      )

    Promise.all(loads).then((results) => {
      if (disposed) return
      results.forEach((res) => {
        if (!res) return
        const { index, tex } = res
        const img = tex.image as HTMLImageElement
        const aspect = img && img.naturalWidth ? img.naturalWidth / img.naturalHeight : 16 / 9
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        tex.center.set(0.5, 0.5)
        tex.rotation = TEX_ROTATION
        // 单位半径的局部圆筒弧段：圆周张角 PANEL_RAD，轴向长 = aspect×PANEL_RAD（保证不变形）
        const axial = aspect * PANEL_RAD
        const geo = new THREE.CylinderGeometry(1, 1, axial, 64, 1, true, -PANEL_RAD / 2, PANEL_RAD)
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          side: THREE.FrontSide,
          depthWrite: false,
          toneMapped: false,
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.rotation.y = -SPIN_SIGN * index * STEP_RAD // 该图在圆周上的基准角
        refs.spinner.add(mesh)
        refs.panels.push({ mesh, mat, index })
      })
      resize()
      renderer.render(refs.scene, refs.camera)
    })

    resize()
    window.addEventListener("resize", resize)

    if (reduce) {
      renderFrame()
    } else {
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
        refs.panels.forEach(({ mesh, mat }) => {
          mesh.geometry.dispose()
          mat.map?.dispose()
          mat.dispose()
        })
        renderer.dispose()
        sceneRef.current = null
      }
    }

    return () => {
      disposed = true
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
  }, [])

  // 滚动驱动：sticky 钉住期间用 progress 旋转（DOM 文字 + WebGL 曲面共用）
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      progressRef.current = 0
      setProgress(0)
      return
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressRef.current = self.progress
        setProgress(self.progress)
      },
    })

    const onScroll = () => ScrollTrigger.update()
    lenis?.on("scroll", onScroll)
    ScrollTrigger.refresh()

    return () => {
      lenis?.off("scroll", onScroll)
      trigger.kill()
    }
  }, [lenis])

  const active = progress * (N - 1)
  const activeIndex = clamp(Math.round(active), 0, N - 1)
  const activeWork = junniWorks[activeIndex] ?? junniWorks[0]

  // 每个文字标题的 3D 摆位（与曲面图片同一套公式）
  const items = useMemo(() => {
    return junniWorks.map((work, i) => {
      const theta = FRONT_DEG + (active - i) * STEP_DEG
      const rad = theta * DEG2RAD
      const y = -radius * Math.sin(rad)
      const z = radius * (Math.cos(rad) - 1)
      const opacity = clamp(1 - (Math.abs(theta) - 52) / 18, 0, 1)
      const isActive = i === activeIndex
      return { work, i, theta, y, z, opacity, isActive }
    })
  }, [active, activeIndex, radius])

  const stageVars = {
    "--junni-works-title-opacity": clamp(1 - progress * 3.4, 0, 1),
    "--junni-works-shift-opacity": clamp(1 - progress * 3.2, 0, 0.85),
  } as CSSProperties

  return (
    <section
      ref={sectionRef}
      className="junni-works"
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

        {/* WebGL 曲面图片层：开放圆筒弧（背面无几何=纯深底），随滚动旋转 */}
        <canvas ref={canvasRef} className="junni-works__webgl" aria-hidden="true" />
        <div className="junni-works__scrim" aria-hidden="true" />

        {/* 3D 文字标题层：与曲面共用角度/半径/透视，叠在最前 */}
        <div className="junni-works__slider">
          <ul className="junni-works__list">
            {items.map(({ work, i, y, z, theta, opacity, isActive }) => {
              const descChars = splitText(work.description)
              return (
                <li
                  key={work.slug}
                  className="junni-works__item"
                  data-works={work.slug}
                  data-active={isActive}
                  style={
                    {
                      transform: `translate(-50%, -50%) translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(
                        2,
                      )}px) rotateX(${theta.toFixed(3)}deg)`,
                      opacity,
                      zIndex: Math.round(1000 - Math.abs(theta)),
                    } as CSSProperties
                  }
                >
                  <a
                    href={work.href}
                    className="junni-works__item-link"
                    data-circle-cursor="more_detail"
                    data-slug={work.slug}
                    tabIndex={isActive ? 0 : -1}
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

        <div className="junni-works__shift" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="junni-works__shift-layer" />
          ))}
        </div>
      </div>

      <span className="junni-works__sr" aria-live="polite">
        {activeWork.title}
      </span>
    </section>
  )
}
