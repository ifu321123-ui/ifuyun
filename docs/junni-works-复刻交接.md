# JUNNI home_works 复刻 · 对话交接文档

> 用途：在新对话里继续 1:1 复刻 [junni.co.jp](https://junni.co.jp/) 首页 **home_works**（3D 纸卷圆柱 WORKS 轮播 + 巨型层叠标题 + 浮动球）。把本文件作为上下文喂给新会话即可无缝接力。
> 最后更新：2026-06-16（**鼓面已从"米白纸+黑字"升级为"原站作品图占位+白色 Logo 的深色面板"**：分段贴图 + 暗化叠层 + 标题叠加，配合"低环境光 + 正前方 key 光"实现正前方亮/邻段暗的层次；`npm run build` 通过；本版本 = `云9.0`，待 push）。
> 上一版：three.js 真 3D 圆柱落地（方向/对齐/比例/光照已修），`云8.0` = commit `8e7ba84`。

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

public/works/junni/   # ✅ 云9.0 新增：从原站扒下的 6 作品 hero 图占位（鼓面贴图素材）
├─ basica.jpg / alche-studio.png / 2nd-star-production.jpg
├─ opb_app.png / master-expo.png   # 均来自 junni.co.jp 各 /works/<slug> 详情页 hero
└─（and_more 无图，纹理里画纯色深底 + 黄绿 "AND MORE..." 字）
```

> 占位图来源：浏览器实测各详情页，取首张 ≥1000px 的 hero（microCMS 资源，`?w=1280&q=82` 下载）。PNG 约 ~1MB，正式替换为自己作品图时建议压一下。

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
- 光（云9.0 重调，制造正前方亮/侧背暗的层次）：`AmbientLight 0.7` + **正前方 key** `DirectionalLight 1.65 @ (0,2.5,9)`（从相机方向打亮当前作品）+ 顶侧 fill `0.28` + 黄绿 rim `0.22`。
- 鼓体：`CylinderGeometry(DRUM_RADIUS=1.58, 1.58, DRUM_HEIGHT=7.35, 160, 1, true)`（半径 1.58、轴长 7.35、开口无盖；段数 128→160）。
  - 包在 `Group`：`drum.rotation.z = π/2`（轴向转水平）、`drum.rotation.x = -0.035`（轻俯仰）。
  - 自转：`tube.rotation.y = baseAngle - progress * SPAN`；`SECTOR = 2π/6`、`SPAN = 5*SECTOR`。
  - **对齐基准**：`baseAngle = π/2 - SECTOR*2`（让 WebGL 正前方作品 == DOM `activeIndex` 的副标题）。
  - 材质：`MeshStandardMaterial({map, roughness:.66, metalness:.05, side:DoubleSide})`（roughness 0.82→0.66，更接近原站屏幕质感）。
- 浮动球：`SphereGeometry(0.42)` × 4，灰 `0xb9bcc4`、`metalness .55`，rAF 里轻微正弦浮动 + 自转。
- 性能：`IntersectionObserver` 进出视口 start/stop rAF；卸载 dispose 几何/材质/纹理/renderer。`prefers-reduced-motion` 渲染一帧静帧。

**鼓面纹理 `buildDrumTexture(images)`（云9.0 大改：分段贴图）**：
- 2048² canvas，**深底 `#101116`**（取代米白纸）→ 段与段之间留深色缝隙，圆柱整体与深底融为一体，不再是发亮白块。
- 映射不变：canvas X = 圆周方向（堆叠 6 段，每段 1 作品占 `size/6` 带），canvas Y = 圆柱轴向（屏幕水平）。每段在 `translate(cx,size/2); rotate(π/2)` 的 local 系里绘制（local +x=屏幕横向/轴向，+y=屏幕纵向/圆周）。
- **每段绘制流程**：① clip 出面板矩形（`panelAxialPx = size*0.64`、`panelCircPx = band*0.84`，四周留深色）→ ② 填面板深底 → ③ `drawImage` 把作品图 **cover 铺满**（用 `ASPECT_COMP = 2π*R/H` 校正 canvas 圆周/轴向各向异性，避免拉伸变形）→ ④ 上下边缘暗化渐变（中间几乎不压暗，保留正面鲜亮）→ ⑤ 叠**白色大标题/Logo**（`shadowBlur`，`and_more` 段用黄绿 `#dcff46`）。
- 字号：normal 150 / middle 128 / small 96（比纯文字版更大，当 Logo 用）。
- **异步**：`buildDrumTexture` 现在接收已加载的 `HTMLImageElement[]`。初始化先用 `junniWorks.map(()=>null)`（纯深底+标题）建一版，`Promise.all([document.fonts.ready, loadDrumImages()])` 完成后**重建纹理替换** `material.map`。用 `disposed` 标志防卸载后回写。
- 纹理：`CanvasTexture`，`colorSpace=SRGB`、`anisotropy=8`、`wrap=Repeat`。
- ⚠️ 纹理只画"图 + 标题"，副标题仍在 DOM overlay（避免重复）。**纹理方向沿用 `rotate(+π/2)`、flipY 默认 true、无 scale(-1,1)** 的正向可读组合。

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
9. ✅【云9.0】鼓面"米白纸+黑字"与原站差距大 → **改为分段贴原站作品图 + 白 Logo 的深色面板**（待办①落地）。
10. ✅【云9.0】整个圆柱通体发亮、6 个作品一样清晰 → **深底纹理 + 低环境光 + 正前方 key 光**，正前方亮、邻段自然变暗，层次接近原站（待办②的光照部分落地）。
11. ✅【云9.0】贴图按圆周/轴向拉伸变形 → 引入 `ASPECT_COMP` 比例补偿做 cover。

最新验证：滚到 WORKS 主体段（sec 42%）截图肉眼对照原站——深色鼓 + 作品图面板 + 白 Logo + 正前方亮/邻段暗 + 浮动球，已与图2原站很接近。

---

## 6. 待办（下一步，新对话从这里继续）★

1. ~~【高】鼓面贴真实素材~~ ✅ **云9.0 已落地**（分段贴原站占位图 + 白 Logo）。剩余：把占位图换成用户**自己的作品图**（替换 `public/works/junni/*` 并改 `junniData.ts` 的 `image` 即可）。
2. **【中】正前方作品再强调**：光照已实现"正前方亮/邻段暗"。若想更像原站，可对 active 段再加一档亮度/描边（纹理层或叠加层）。
3. **【中】圆柱两端开口处理**：极左/右屏幕边缘能瞄到一点筒内分隔条（原站鼓更长、两端跑出屏幕外）。可加长轴向或加深色端盖消除。
4. **【中】ghost 背景大字视差**：原站上下有极淡的相邻作品名滚动；当前 `ghost-title` 仍是居中单份淡字，可改成"上一个/下一个"上下分布。
5. **【中】gooey 黄绿光标**：原站全屏 WebGL 着色器光标（`data-gooey-color="yellow"`），可后补近似。
6. **【低】占位图体积**：扒下的 PNG 约 ~1MB，正式素材建议压缩 / 转 webp。
7. **【低】滚动行程标定**：原站 ≈2.15vh，当前 `min-height:320vh`，可按手感微调。
8. **【低】包体拆分**：three.js 让 bundle ~950kB，可对 `JunniWorks` 做 `React.lazy` + 动态 import。
9. **【低】移动端**：`max-width:768px` 基础适配在，three.js 场景小屏需再校半径/相机。

---

## 7. 原站 WORKS 数据（已写入 `junniData.ts` 的 `junniWorks`）

| slug | title | description（日文，1:1） | href | titleSize | image（云9.0 占位） |
|---|---|---|---|---|---|
| basica | BaSICA | 株式会社BaSICA コーポレートサイトリニューアル | /works/basica | normal | /works/junni/basica.jpg |
| alche-studio | Alche, Inc | Alche株式会社 コーポレートサイトリニューアル | /works/alche-studio | normal | /works/junni/alche-studio.png |
| 2nd-star-production | 2nd STAR PRODUCTION | 「2nd STAR PRODUCTION」コーポレートサイト制作 | /works/2nd-star-production | small | /works/junni/2nd-star-production.jpg |
| opb_app | ONE PIECE BASE | ONE PIECE BASEアプリ開発／制作 | /works/opb_app | middle | /works/junni/opb_app.png |
| master-expo | M@STER EXPO | THE IDOLM@STER M@STER EXPO 公式ブース出展 | /works/master-expo | middle | /works/junni/master-expo.png |
| and_more | and more... | WORKS - 制作実績一覧ページ | /works | (default) | ""（无图，纹理画纯色+黄绿字） |

> `JunniWork` 类型：`{ slug, title, description, href, image, titleSize? }`。**云9.0 已把 image 从 `/works/shiyuan/0X.png` 换成原站扒下的 `/works/junni/*` 占位**，待替换为自己的项目素材。

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
- 版本命名沿用 `云N.0`（历史 云3.0…云8.0=`8e7ba84`）。**本版本 = `云9.0`**。
- 云9.0 提交含：`JunniWorks.tsx`（buildDrumTexture 分段贴图 + 异步加载 + 光照重调）、`junniData.ts`（image 改 `/works/junni/*`）、`public/works/junni/*`（6 张占位图）、本交接文档。
- 注意：`docs/junni-service-复刻交接.md` 有未提交的本地改动（与本任务无关）。

---

## 10. 新对话快速启动指令（复制即用）

> 继续 junni.co.jp 首页 `home_works` 复刻。已读 `docs/junni-works-复刻交接.md`。现状：已用 **three.js** 实现横置圆柱（`src/components/junni/JunniWorks.{tsx,css}` + `junniData.ts`），接入 `GunzeTransition`（`<JunniService/>` 正下方），`npm run build` 通过，本版本 `云9.0`。**鼓面已改为分段贴原站作品图占位（`public/works/junni/*`）+ 白 Logo 的深色面板，配合低环境光+正前方 key 光做正前方亮/邻段暗**（见第 4、5 节）。下一步按第 6 节优先级继续：①把占位图换成用户自己的作品图 ②正前方再强调/描边 ③圆柱两端开口收边 ④ghost 上下视差 ⑤gooey 黄绿光标。每步用浏览器（localhost:5173，滚到 sec 42% 处）截图与原站对照微调，并 `npm run build` 验证。
