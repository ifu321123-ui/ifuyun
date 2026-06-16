import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import { junniWorks } from "./junniData"
import "./JunniWorks.css"

gsap.registerPlugin(ScrollTrigger)

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
const TWO_PI = Math.PI * 2
/** 每个作品占据圆周上的角度间隔 */
const SECTOR = TWO_PI / N
/** 滚动 0→1 时鼓体转过的总角度：让 6 个作品依次转到正前方 */
const SPAN = (N - 1) * SECTOR

/** 鼓体几何尺寸（与 CylinderGeometry 保持一致，用于纹理比例补偿） */
const DRUM_RADIUS = 1.58
const DRUM_HEIGHT = 7.35
/** canvas 各向异性补偿：圆周方向 world/px ÷ 轴向 world/px */
const ASPECT_COMP = (TWO_PI * DRUM_RADIUS) / DRUM_HEIGHT

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function splitText(text: string) {
  return Array.from(text).map((char) => (char === " " ? "\u00A0" : char))
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null)
      return
    }
    const img = new Image()
    img.decoding = "async"
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/** 预加载所有作品占位图，供 buildDrumTexture 直接绘制 */
function loadDrumImages() {
  return Promise.all(junniWorks.map((work) => loadImage(work.image)))
}

/**
 * 把 6 个作品的视觉图（占位）+ 标题分段画到一张 canvas，作为圆柱表面纹理。
 * 映射：canvas X = 圆周方向（堆叠 6 段，每段一作品），canvas Y = 圆柱轴向（屏幕水平）。
 * 每段：深底 → 居中铺作品图（cover 裁切，按 ASPECT_COMP 校正不变形）→ 暗化渐变 → 白色标题/Logo。
 */
function buildDrumTexture(images: (HTMLImageElement | null)[]) {
  const size = 2048
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!

  // 整张深底：段与段之间、面板四周露出的鼓面与深色舞台融为一体
  ctx.fillStyle = "#101116"
  ctx.fillRect(0, 0, size, size)

  const band = size / N
  // 面板尺寸（local 坐标，旋转后 x=轴向/屏幕横向，y=圆周/屏幕纵向）
  const panelAxialPx = size * 0.64 // 屏幕横向（轴向）占比
  const panelCircPx = band * 0.84 // 屏幕纵向（圆周）占比，留出段间深色缝隙

  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  junniWorks.forEach((work, index) => {
    const cx = (index + 0.5) * band
    const img = images[index]
    ctx.save()
    ctx.translate(cx, size / 2)
    ctx.rotate(Math.PI / 2) // 与文字同一套朝向：local 正向 = 屏幕可读方向

    const halfX = panelAxialPx / 2
    const halfY = panelCircPx / 2

    ctx.save()
    ctx.beginPath()
    ctx.rect(-halfX, -halfY, panelAxialPx, panelCircPx)
    ctx.clip()

    // 面板深底（无图时也有质感）
    ctx.fillStyle = work.slug === "and_more" ? "#15171c" : "#0c0d10"
    ctx.fillRect(-halfX, -halfY, panelAxialPx, panelCircPx)

    if (img) {
      // cover：按屏幕比例铺满面板并裁切（ASPECT_COMP 校正 canvas 各向异性）
      const imgAspect = img.width / img.height
      const panelScreenAspect = panelAxialPx / panelCircPx / ASPECT_COMP
      let drawX: number
      let drawY: number
      if (imgAspect > panelScreenAspect) {
        drawY = panelCircPx
        drawX = drawY * imgAspect * ASPECT_COMP
      } else {
        drawX = panelAxialPx
        drawY = drawX / (imgAspect * ASPECT_COMP)
      }
      ctx.drawImage(img, -drawX / 2, -drawY / 2, drawX, drawY)

      // 暗化叠层：仅上下边缘略加深，让白色标题更突出、又保留正面画面的鲜亮
      const grad = ctx.createLinearGradient(0, -halfY, 0, halfY)
      grad.addColorStop(0, "rgba(8,9,12,0.42)")
      grad.addColorStop(0.5, "rgba(8,9,12,0.05)")
      grad.addColorStop(1, "rgba(8,9,12,0.5)")
      ctx.fillStyle = grad
      ctx.fillRect(-halfX, -halfY, panelAxialPx, panelCircPx)
    }
    ctx.restore()

    // 标题 / Logo（白色，居中，带柔和阴影）
    const title = work.title.toUpperCase()
    const fontSize = work.titleSize === "small" ? 96 : work.titleSize === "middle" ? 128 : 150
    ctx.font = `900 ${fontSize}px "Inter", system-ui, sans-serif`
    ctx.shadowColor = "rgba(0,0,0,0.45)"
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 4
    ctx.fillStyle = work.slug === "and_more" ? "#dcff46" : "#ffffff"
    ctx.fillText(title, 0, 0)
    ctx.restore()
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

type SceneRefs = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  drum: THREE.Group
  tube: THREE.Mesh
  spheres: THREE.Mesh[]
  texture: THREE.CanvasTexture
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
  const [activeIndex, setActiveIndex] = useState(0)

  // three.js 场景：仅初始化一次
  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(0, 0, 16)

    // 低环境光 → 让圆周侧面/背面自然压暗；正面 key 光从相机方向打亮当前作品
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const key = new THREE.DirectionalLight(0xffffff, 1.65)
    key.position.set(0, 2.5, 9)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 0.28)
    fill.position.set(-4, 5, 4)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xdcff46, 0.22)
    rim.position.set(4, -3, 2)
    scene.add(rim)

    // 鼓体（横置圆柱）：初始用纯文字纹理（深底+标题），图片异步加载后重建
    const texture = buildDrumTexture(junniWorks.map(() => null))
    const geometry = new THREE.CylinderGeometry(DRUM_RADIUS, DRUM_RADIUS, DRUM_HEIGHT, 160, 1, true)
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.66,
      metalness: 0.05,
      side: THREE.DoubleSide,
    })
    const tube = new THREE.Mesh(geometry, material)

    const drum = new THREE.Group()
    drum.add(tube)
    drum.rotation.z = Math.PI / 2 // 轴向转到水平（屏幕 X）
    drum.rotation.x = -0.035 // 轻微俯仰，露出顶/底弧面
    scene.add(drum)

    // 漂浮金属球
    const sphereGeo = new THREE.SphereGeometry(0.42, 48, 48)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xb9bcc4,
      roughness: 0.32,
      metalness: 0.55,
    })
    const sphereSeeds = [
      { x: -3.45, y: 2.1, z: 2.4, s: 0.75 },
      { x: 3.45, y: -1.8, z: 1.8, s: 1.05 },
      { x: -2.5, y: -2.35, z: 2.9, s: 0.58 },
      { x: 2.8, y: 2.15, z: 1.2, s: 0.88 },
    ]
    const spheres = sphereSeeds.map((seed) => {
      const mesh = new THREE.Mesh(sphereGeo, sphereMat)
      mesh.position.set(seed.x, seed.y, seed.z)
      mesh.scale.setScalar(seed.s)
      mesh.userData = seed
      scene.add(mesh)
      return mesh
    })

    const refs: SceneRefs = {
      renderer,
      scene,
      camera,
      drum,
      tube,
      spheres,
      texture,
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
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener("resize", resize)

    const clock = new THREE.Clock()
    const baseAngle = Math.PI / 2 - SECTOR * 2 // 对齐 WebGL 鼓面正前方与 DOM active 文案

    const renderFrame = () => {
      const t = clock.getElapsedTime()
      const p = progressRef.current
      tube.rotation.y = baseAngle - p * SPAN
      spheres.forEach((mesh, i) => {
        const seed = mesh.userData as { x: number; y: number; z: number }
        mesh.position.y = seed.y + Math.sin(t * 0.6 + i) * 0.32
        mesh.position.x = seed.x + Math.cos(t * 0.4 + i) * 0.18
        mesh.rotation.y = t * 0.3 + i
      })
      renderer.render(scene, camera)
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

    // 字体就绪 + 占位图加载完成后重建纹理（首帧用 fallback 字体 / 无图，随后替换）
    let disposed = false
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    Promise.all([fontsReady, loadDrumImages()]).then(([, imgs]) => {
      if (disposed) return
      const fresh = buildDrumTexture(imgs)
      material.map = fresh
      material.needsUpdate = true
      refs.texture.dispose()
      refs.texture = fresh
      renderer.render(scene, camera)
    })

    if (reduce) {
      renderFrame() // 渲染一帧静态画面
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => (entry.isIntersecting ? start() : stop()))
        },
        { threshold: 0 },
      )
      io.observe(section)

      return () => {
        disposed = true
        io.disconnect()
        stop()
        window.removeEventListener("resize", resize)
        geometry.dispose()
        material.dispose()
        sphereGeo.dispose()
        sphereMat.dispose()
        refs.texture.dispose()
        renderer.dispose()
        sceneRef.current = null
      }
    }

    return () => {
      disposed = true
      stop()
      window.removeEventListener("resize", resize)
      geometry.dispose()
      material.dispose()
      sphereGeo.dispose()
      sphereMat.dispose()
      refs.texture.dispose()
      renderer.dispose()
      sceneRef.current = null
    }
  }, [])

  // 滚动驱动：更新 progress 与 active 作品
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      progressRef.current = 0
      setProgress(0)
      setActiveIndex(0)
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
        setActiveIndex(clamp(Math.round(self.progress * (N - 1)), 0, N - 1))
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

  const activeWork = junniWorks[activeIndex] ?? junniWorks[0]

  const descChars = useMemo(() => splitText(activeWork.description), [activeWork.description])
  const stageVars = {
    "--junni-works-title-opacity": clamp(1 - progress * 4.2, 0, 1),
    "--junni-works-ghost-opacity": clamp((progress - 0.1) * 0.55, 0, 0.14),
    "--junni-works-shift-opacity": clamp(1 - progress * 3.6, 0, 0.9),
  } as CSSProperties

  return (
    <section ref={sectionRef} className="junni-works" data-gooey-color="yellow" aria-label="WORKS" style={stageVars}>
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

        <div className="junni-works__ghost-title" aria-hidden="true">
          <span>{activeWork.title}</span>
        </div>

        <canvas ref={canvasRef} className="junni-works__canvas" aria-hidden="true" />

        <div className="junni-works__overlay">
          <a
            href={activeWork.href}
            className="junni-works__active-link"
            data-circle-cursor="more_detail"
            data-slug={activeWork.slug}
            style={{ "--junni-works-progress": progress } as CSSProperties}
          >
            <span className="junni-works__active-desc" aria-label={activeWork.description}>
              {descChars.map((char, charIndex) => (
                <span
                  key={`${activeWork.slug}-${charIndex}`}
                  translate="no"
                  className="junni-works__active-desc-char"
                  style={{ "--transition-delay": `${charIndex * 0.024}s` } as CSSProperties}
                >
                  {char}
                </span>
              ))}
            </span>
          </a>
        </div>

        <div className="junni-works__shift" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="junni-works__shift-layer" />
          ))}
        </div>
      </div>
    </section>
  )
}
