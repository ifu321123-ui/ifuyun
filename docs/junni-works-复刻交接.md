# JUNNI home_works 复刻 · 对话交接文档

> 用途：在新对话里继续 1:1 复刻 [junni.co.jp](https://junni.co.jp/) 首页 **home_works**（3D 纸卷圆柱 WORKS 轮播 + 巨型层叠标题 + 浮动球）。把本文件作为上下文喂给新会话即可无缝接力。
> 最后更新：2026-06-16（**已切换为 three.js 真 3D 圆柱方案**并落地；方向/对齐/比例/光照已修；`npm run build` 通过；已提交 GitHub `云8.0` = commit `8e7ba84`）。

---

## 0. 一句话目标

1:1 复刻 junni.co.jp 首页 `home_works`：随滚动旋转的 **横置纸卷圆柱（drum）**，6 个作品名贴在圆柱表面随曲面转动，正前方作品名最大最清晰，配 **巨型黄绿描边 WORKS 标题**（进圆柱主体段淡出）、**漂浮金属球**、底部黄绿 shift 擦除条、深底 `#1c1d21` + 黄绿 `#dcff46`。文案/动效先按原站 1:1，鼓面素材后续替换为自己的项目图。

参考截图（原站）：横置浅色纸卷圆柱，正前方一个作品名 + Logo，四周漂浮灰色金属球，背后很淡的巨型作品名，跟随鼠标的黄绿 gooey 线框光标。

---

## 1. 关键认知：原站是 three.js（已确认）

- 用浏览器 CDP 实测原站：存在 `__THREE__` 全局 + 一个 **webgl2** 的全屏 `<canvas id="canvas">`（挂在 `.container`，`position:fixed; z-index:1`）。
- 圆柱、作品名、浮动球**全画在这块共享 WebGL canvas 上**；DOM 里只有那个 pin 住的巨型 `repeatText` WORKS 标题 + 隐藏的 `home_works_item`（title/desc 逐字 span，作数据/无障碍用）。
- 原站 `home_works` 滚动行程 ≈ **2.15×视口高**；6 个作品。
- 结论：纯 CSS 3D 做不出"文字贴曲面"的纸卷质感，必须用 three.js。**已选方案 A（three.js 真还原）并落地。**

---

## 2. 技术栈与现状

- 框架：**React 19 + Vite 8 + TS**，Tailwind v4，已装 `gsap` / `lenis`。
- **新增依赖**：`three@^0.184`（dependencies）、`@types/three@^0.184`（devDependencies）。已在 `package.json` / `package-lock.json`。
- 平滑滚动：`src/components/SmoothScroll.tsx`（Lenis）在 `App` 外层统一包裹。
- 滚动驱动：**GSAP ScrollTrigger（scrub）** → `progressRef` → three.js rAF 里旋转圆柱 + React state 控制 active 文案/标题淡出。
- 构建包体因 three.js 增大到 ~950kB（gzip ~278kB），build 有 chunk>500kB warning（仅提示，后续可按需 `dynamic import()` 拆分）。

---

## 3. 文件清单与接入

```
src/components/junni/
├─ JunniWorks.tsx     # ✅ three.js 圆柱场景（canvas 纹理 + 浮动球 + 滚动旋转）+ DOM 标题/副标题/shift
├─ JunniWorks.css     # ✅ 自包含样式（canvas 铺满 + 标题 + ghost 大字 + overlay 副标题 + shift 条）
└─ junniData.ts       # ✅ junniWorks 数组（6 项原站文案 + slug + 占位图 + titleSize）
```

接入点：`src/components/GunzeTransition.tsx` 顶部 `import JunniWorks`，在 `<JunniService />`（PERFORMANCE 手风琴）**正下方**、`<MovieSection />` 之前渲染 `<JunniWorks />`。
首页流：`Hero → … → GunzeTransition(message) → <JunniService/> → <JunniWorks/> → MovieSection → CeoSection`。

dev：`npm run dev`（端口 5173，strictPort）。**PowerShell 不支持 `&&`，命令分开或用 `;`**。

---

## 4. JunniWorks.tsx 结构与核心参数（现状值）

**DOM 层（z-index 由低到高）**：
```
section.junni-works[style=stageVars]            # min-height 320vh 提供滚动行程；深底
 └ div.junni-works__pin                          # sticky top:0 height:100vh
     ├ h2.junni-works__title (repeatText × 7)     # 巨型 WORKS，全副本 #1c1d21 填充 + #dcff46 描边
     ├ div.junni-works__ghost-title               # 背后很淡的当前作品大字（进场渐显）
     ├ canvas.junni-works__canvas                 # three.js 渲染目标，inset:0 铺满
     ├ div.junni-works__overlay > a > .active-desc# 当前作品日文副标题，逐字浮现（DOM，非纹理）
     └ div.junni-works__shift (layer × 4)         # 底部黄绿擦除条，进主体段淡出
```

**three.js 场景（仅初始化一次的 useEffect）**：
- 渲染器：`WebGLRenderer({alpha:true, antialias:true})`，`pixelRatio=min(dpr,2)`，`outputColorSpace=SRGB`。
- 相机：`PerspectiveCamera(36, aspect, .1, 100)`，`position.z = 16`。
- 光：`AmbientLight 1.15` + 顶部 `DirectionalLight 0.55` + 黄绿 `DirectionalLight 0.24`（放平、低反差）。
- 鼓体：`CylinderGeometry(1.58, 1.58, 7.35, 128, 1, true)`（半径 1.58、轴长 7.35、开口无盖）。
  - 包在 `Group`：`drum.rotation.z = π/2`（轴向转水平）、`drum.rotation.x = -0.035`（轻俯仰）。
  - 自转：`tube.rotation.y = baseAngle - progress * SPAN`；`SECTOR = 2π/6`、`SPAN = 5*SECTOR`。
  - **对齐基准**：`baseAngle = π/2 - SECTOR*2`（让 WebGL 正前方作品 == DOM `activeIndex` 的副标题）。
  - 材质：`MeshStandardMaterial({map, roughness:.82, metalness:.04, side:DoubleSide})`。
- 浮动球：`SphereGeometry(0.42)` × 4，灰 `0xb9bcc4`、`metalness .55`，rAF 里轻微正弦浮动 + 自转。
- 性能：`IntersectionObserver` 进出视口 start/stop rAF；卸载 dispose 几何/材质/纹理/renderer。`prefers-reduced-motion` 渲染一帧静帧。

**鼓面纹理 `buildDrumTexture()`（关键，纹理方向已调对）**：
- 2048² canvas，米白底 `#f1f1ef` + 噪点纸感。
- 映射：canvas X = 圆周方向（堆叠 6 个名字，每个占 `size/6` 带），canvas Y = 圆柱轴向（屏幕水平）。
- 每个名字：`ctx.translate(cx, size/2); ctx.rotate(Math.PI/2); fillText(标题)`。**无 `scale(-1,1)`、纹理 `flipY` 用默认 true** —— 这套组合是正向可读的最终解（之前 `rotate(-π/2)+scale(-1,1)+flipY=false` 会上下颠倒；`rotate(+π/2)+scale(-1,1)` 会水平镜像）。
- 字号：normal 128 / middle 110 / small 92。
- 纹理：`CanvasTexture`，`colorSpace=SRGB`、`anisotropy=8`、`wrap=Repeat`。
- `document.fonts.ready` 后重建一次纹理，避免首帧 fallback 字体。
- ⚠️ 目前纹理**只画标题文字**（副标题已移到 DOM overlay，避免重复）。

**stageVars（随 progress 的 CSS 变量）**：
- `--junni-works-title-opacity = clamp(1 - p*4.2, 0,1)`（WORKS 标题进主体段淡出）
- `--junni-works-ghost-opacity = clamp((p-.1)*.55, 0,.14)`（背后淡大字渐显）
- `--junni-works-shift-opacity = clamp(1 - p*3.6, 0,.9)`（shift 条淡出）

---

## 5. 已修问题（按解决顺序）

1. ✅ 鼓面文字**上下颠倒** → 调 `rotate` 方向 + 去掉 `flipY=false`。
2. ✅ 鼓面文字**水平镜像** → 去掉 canvas 的 `scale(-1,1)`。
3. ✅ **正前方作品与 DOM 副标题不对齐** → `baseAngle = π/2 - SECTOR*2`。
4. ✅ 圆柱**铺满全屏/太胖** → 相机 z 12→16、半径 2.12→1.58、轴长 10.8→7.35、字号下调。
5. ✅ 鼓面**上下明暗反差太重** → 环境光升、方向光降、底色提亮。
6. ✅ 副标题**重复**（鼓面+DOM）→ 纹理只留标题，副标题仅 DOM。
7. ✅ 底部 shift 条/overlay **打架** → overlay 上移到 `bottom:18vh`，shift 条调细 + 主体段淡出。
8. ✅ WORKS 标题一直压在圆柱后 → 进主体段按 progress 淡出 + 背后 ghost 大字渐显。

最新验证截图（临时目录）：`junni-works-three-tuned-7.png`（方向正、对齐、比例接近原站纸卷）。

---

## 6. 待办（下一步，新对话从这里继续）★

1. **【高】鼓面贴真实素材**（当前最大差距）：原站圆柱面不是纯文字，而是**每个作品的视觉图/Logo/标语组合**。应把 `buildDrumTexture` 改成**按作品分段贴图**：每段绘入对应 work 的项目图 + 标题 + Logo（用户后续提供素材，先用 `/works/shiyuan/0X.png` 占位）。可能需要按作品生成多块纹理或一张大图分区。
2. **【中】正前方作品高亮**：原站正前方作品更突出（更亮/更大/描边），其余偏灰。可在纹理或叠加层做 active 强调。
3. **【中】gooey 黄绿光标**：原站全屏 WebGL 着色器光标（`data-gooey-color="yellow"`），可后补近似（跟随鼠标的黄绿不规则线框/果冻效果）。
4. **【中】进场/退场动效细化**：圆柱进入时的旋入、作品切换时副标题逐字（已具备）、Logo 淡入等。
5. **【低】滚动行程标定**：原站 ≈2.15vh，当前 `min-height:320vh`，可按手感微调每个作品停留时长。
6. **【低】包体拆分**：three.js 让 bundle ~950kB，可对 `JunniWorks` 做 `React.lazy` + 动态 import 降低首屏。
7. **【低】移动端**：当前有 `max-width:768px` 基础适配，three.js 场景在小屏需再校半径/相机。

---

## 7. 原站 WORKS 数据（已写入 `junniData.ts` 的 `junniWorks`）

| slug | title | description（日文，1:1） | href | titleSize |
|---|---|---|---|---|
| basica | BaSICA | 株式会社BaSICA コーポレートサイトリニューアル | /works/basica | normal |
| alche-studio | Alche, Inc | Alche株式会社 コーポレートサイトリニューアル | /works/alche-studio | normal |
| 2nd-star-production | 2nd STAR PRODUCTION | 「2nd STAR PRODUCTION」コーポレートサイト制作 | /works/2nd-star-production | small |
| opb_app | ONE PIECE BASE | ONE PIECE BASEアプリ開発／制作 | /works/opb_app | middle |
| master-expo | M@STER EXPO | THE IDOLM@STER M@STER EXPO 公式ブース出展 | /works/master-expo | middle |
| and_more | and more... | WORKS - 制作実績一覧ページ | /works | (default) |

> `JunniWork` 类型：`{ slug, title, description, href, image, titleSize? }`。图片暂用 `/works/shiyuan/01–06.png` 占位，待替换为自己的项目素材。

---

## 8. 浏览器实测/调试备忘（环境）

- 浏览器 MCP：`cursor-ide-browser`（`browser_navigate` / `browser_cdp` / `browser_lock` / `browser_take_screenshot` / `browser_tabs`）。**仅 Agent 模式可用**。
- 本地预览用 **`http://localhost:5173/`**（注意：`127.0.0.1` 那个标签曾报 chrome-error，dev server `--open` 默认 localhost）。
- 调试套路：`browser_cdp` → `Runtime.evaluate(awaitPromise:true)`，`window.scrollTo(sec.offsetTop + sec.offsetHeight*0.42)` 滚到圆柱主体段，`await wait(~900ms)` 等动画稳定后 `browser_take_screenshot` 截图肉眼对照原站。
- 改 three.js 参数后需 **navigate 重载页面**（HMR 对 useEffect 内一次性场景不一定干净），再滚动截图。
- 原站参考标签：`https://junni.co.jp/`（CDP 实测得 three.js / webgl2 / `home_works` 2.15vh 等）。

---

## 9. Git / 版本

- 仓库：`https://github.com/ifu321123-ui/ifuyun.git`，分支 `main`。
- 版本命名沿用 `云N.0`（历史 云3.0…云7.0）。**本版本 = `云8.0`，commit `8e7ba84`，已 push。**
- 本次提交含：`JunniWorks.tsx/.css`、`junniData.ts`、`GunzeTransition.tsx`、`package.json`、`package-lock.json`、本交接文档。
- 注意：`docs/junni-service-复刻交接.md` 有未提交的本地改动（与本任务无关，未纳入 云8.0）。

---

## 10. 新对话快速启动指令（复制即用）

> 继续 junni.co.jp 首页 `home_works` 复刻。已读 `docs/junni-works-复刻交接.md`。现状：已用 **three.js** 实现横置纸卷圆柱（`src/components/junni/JunniWorks.{tsx,css}` + `junniData.ts`），接入 `GunzeTransition`（`<JunniService/>` 正下方），`npm run build` 通过，已提交 `云8.0`(8e7ba84)。圆柱方向/对齐/比例/光照已修对（见第 5 节），关键参数见第 4 节。下一步按第 6 节优先级继续：①鼓面改"按作品分段贴真实素材/Logo"（当前最大差距，先用 `/works/shiyuan/0X.png` 占位）②正前方作品高亮 ③gooey 黄绿光标。每步用浏览器（localhost:5173，滚到 sec 42% 处）截图与原站对照微调，并 `npm run build` 验证。
