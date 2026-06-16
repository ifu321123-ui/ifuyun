# JUNNI home_works 复刻 · 对话交接文档

> 用途：在新对话里继续 1:1 复刻 [junni.co.jp](https://junni.co.jp/) 首页 **home_works**（WORKS 作品轮播）。把本文件喂给新会话即可无缝接力。
> 当前版本：**椒1.0**（2026-06-16）。架构 = **WebGL 曲面图片圆筒（开放弧）** + **DOM 3D 文字标题层** 叠加，`npm run build` 通过。
> 历史命名沿用 `云N.0`（云3.0…云9.0=`5708bbb`），自本版起改用 `椒N.0`。

---

## 0. 一句话目标

1:1 复刻 junni.co.jp 首页 `home_works`：随滚动旋转的 **横置圆筒**——6 个作品的**图片弯曲贴在筒面上**（凸弧、随滚动转），正前方作品图最大最清晰、大白标题压在其上，上方相邻作品是**暗灰幽灵标题**，**背面完全空（只露深底）**；配巨型 **WORKS** 描边标题 + 底部黄绿 shift 擦除条。深底 `#1c1d21` + 黄绿 `#dcff46`。文案/动效按原站 1:1，图片为自己项目素材占位。

---

## 1. 当前架构（椒1.0）★

原站这块是 **WebGL**（`__THREE__` + 全屏 webgl2 canvas），图片弯曲贴在圆柱面上随滚动转；DOM 里另有 pin 住的 `home_works_item`（标题/逐字副标题，带内联 `translate3d/rotateX`）。本站对应实现为**两层叠加**，共用同一套角度/半径/透视：

```
section.junni-works (min-height 300vh，深底，提供滚动行程)
 └ div.junni-works__pin (sticky top:0 height:100vh)
   ├ h2.junni-works__title           # z2  巨型 WORKS 描边标题（repeatText×7 回声，进主体段淡出）
   ├ canvas.junni-works__webgl        # z1  ★WebGL 曲面图片圆筒（three.js）
   ├ div.junni-works__scrim           # z2  柔和暗罩（保证白标题在亮图上可读）
   ├ div.junni-works__slider>ul.list  # z3  ★DOM 3D 文字标题层（perspective:500px）
   │   └ li.junni-works__item × 6     #     大标题(data-size) + 逐字副标题
   └ div.junni-works__shift (×4)      # z4  底部黄绿擦除条
```

- **WebGL 曲面图片层**：每个有图的作品 = 一个**单位半径的局部圆柱弧段**，贴该作品图。背面/间隙**无几何 = 纯深底**（不是闭罐，这点是相对最早"实心圆筒"版的关键纠正）。
- **DOM 文字标题层**：当前项纯白居中独占，其余压成 `#313238` 暗灰幽灵（实测原站 `#262626`），副标题逐字浮现。
- 两层用**同一 `progress`** 驱动旋转，且半径/透视对齐 → 文字标题正好压在对应曲面图片上。

---

## 2. 核心几何（实测 + 反推，已 1:1 落地）★

由原站 6 个 `home_works_item` 的内联 `translate3d/rotateX`（及 CDP 解 matrix3d）反推：

```
N = 6，progress 0→1
active = progress × (N−1)
θ_i = (active − i) × 25°                 // 正前方 active 在 θ≈0；FRONT_DEG=0
Y_i = −R · sin(θ_i)                       // 屏幕竖直
Z_i =  R · (cos(θ_i) − 1)                 // 深度
R   = clamp(vh × 0.52, 220, 520)          // 实测 R≈327@vh626、387@vh744（由高度驱动！）
DOM transform: translate(-50%,-50%) translateY(Y) translateZ(Z) rotateX(θ)
DOM 容器 perspective: 500px（实测 .home_works_list）
```

验证：基于实测把 6 组角度代入完全吻合（and_more 在前 active=5 时 basica θ=129.34° ✓；basica 在前 active=0 时 alche θ=−25° 在下方 ✓）。

**WebGL 与 DOM 对齐**（让曲面图片与文字同位同深）：
- px 对齐相机：`camera.position.z = PERSPECTIVE(=500)`，`camera.fov = 2·atan(h/2/500)` → 1 world unit = 1px@z=0，深度衰减与 CSS `perspective:500px` 一致。
- `drum.scale = R`、`drum.position.z = −R`（单位半径几何放大到 R，前表面落 z=0）。
- 外层 `drum.rotation.z = π/2`（圆柱轴→屏幕水平 X）；内层 `spinner.rotation.y = SPIN_SIGN × active × STEP_RAD` 随滚动自转；每个 mesh `rotation.y = −SPIN_SIGN × i × STEP_RAD`（基准角）。
- 每张图弧段：`CylinderGeometry(1, 1, aspect×PANEL_RAD, 64, 1, true, −PANEL_RAD/2, PANEL_RAD)`，`axial = aspect×PANEL_RAD` 保证不变形；贴图 `tex.rotation = −π/2`（圆周→屏幕竖直需转 90°）。
- 材质 `MeshBasicMaterial({transparent, side:FrontSide, depthWrite:false, toneMapped:false})`；每帧按 `eff=(active−i)×25°` 调 `opacity`、亮度 `color.setScalar`、`renderOrder=round(300−|eff|)`（前图盖后图），`|eff|>96°` 隐藏。

---

## 3. 关键实测数值（CDP 抓原站）

| 项 | 实测值 |
|---|---|
| 页面背景 | `#1c1d21`（rgb 28,29,33）|
| 强调黄绿 | `#dcff46` |
| `.home_works_list` | `perspective:500px; transform-style:preserve-3d` |
| 作品间隔 | **25°**（snapshot 实测 21–25°，取 25）|
| 半径 R | ≈ vh × 0.52 |
| 标题字体 | **Montserrat 700**，normal≈65.8 / middle≈55.9 / small≈42.7 px @vw573 |
| 当前项标题色 | `#fff`（含 and_more 也是白，**非绿**）|
| 非当前项标题色 | `#262626` 暗灰幽灵 |
| 副标题 | ≈10px，逐字 `--transition-delay` |
| `.home_works_image` | 单独一层，~16:9（516×290）|

---

## 4. 文件清单与接入

```
src/components/junni/
├─ JunniWorks.tsx   # ★椒1.0：WebGL 曲面图片圆筒(three.js) + DOM 3D 文字标题 + WORKS 标题 + shift
├─ JunniWorks.css   # ★自包含样式（webgl canvas / scrim / list+item / 标题幽灵态 / shift）
└─ junniData.ts     # junniWorks 数组（6 项原站文案 + slug + 占位图 + titleSize），未改

public/works/junni/  # 占位图（来自原站各 /works/<slug> hero）
├─ basica.jpg / alche-studio.png / 2nd-star-production.jpg / opb_app.png / master-expo.png
└─（and_more 无图 → 无曲面 mesh，那一段保持空）

index.html           # 已加 Google Fonts: Montserrat:wght@600;700;800
```

- 依赖：`three@^0.184` + `@types/three@^0.184`（在 package.json）。bundle 因 three.js ≈ **945kB（gzip ~277kB）**，build 有 chunk>500kB warning（仅提示）。
- 接入点：`src/components/GunzeTransition.tsx` 内，`<JunniService/>`（PERFORMANCE 手风琴）**正下方**渲染 `<JunniWorks/>`。
  首页流：`Hero → … → GunzeTransition(message) → <JunniService/> → <JunniWorks/> → MovieSection → CeoSection`。
- 滚动：`SmoothScroll.tsx`(Lenis) 外层包裹；GSAP ScrollTrigger(scrub) → `progressRef`(WebGL rAF 读) + `progress` state(DOM 标题)。
- dev：`npm run dev`（端口 5173，strictPort）。**PowerShell 不支持 `&&`，命令分开或用 `;`**。

---

## 5. 调参速查（`JunniWorks.tsx` 顶部常量）

| 常量 | 现值 | 作用 |
|---|---|---|
| `STEP_DEG` | 25 | 作品间隔角 |
| `FRONT_DEG` | 0 | 当前项在正前方 θ |
| `PERSPECTIVE` | 500 | 透视（DOM/WebGL 共用，越大越平）|
| `PANEL_DEG` | 46 | 单张图圆周张角 = 屏幕高度/曲率；>STEP 故相邻图重叠、前遮后。调大=图更高更弯 |
| `SPIN_SIGN` | −1 | 旋转方向（让图随滚动与文字同向）|
| `TEX_ROTATION` | −π/2 | 贴图旋正 |
| `computeRadius` | `clamp(vh×0.52,220,520)` | 半径 |

CSS 侧：`.junni-works__item-title` 非当前色 `#313238` / 当前 `#fff`；`.junni-works__scrim` 暗罩强度；`.junni-works__title-echo` 的 WORKS 描边（现 `#dcff46` 描边，原站此屏其实是纯白实心，可按需切换）。

---

## 6. 复刻历程 / 关键决策（避免回头踩坑）

1. **云9.0 及更早**：用 three.js **实心圆柱** + 6 图烘焙成一张贴图裹满 360° → 看着像**封闭罐头**。被用户否定（"原站不是完整圆筒"）。
2. **云10.0（架构重做）**：CDP 实测 + 反推确认原站文字是 **纯 CSS 3D DOM 卡片**（25°/perspective500/开放弧）。弃用 three.js，纯 DOM 文字层落地，bundle 950→436kB。
3. **椒1.0 调优①**：DOM 版初版"灰字一堆+图压暗+半径太小"显得又乱又空。按实测改：**R=vh×0.52**（之前误用 vw×0.352 太小）、非当前项 → 暗灰幽灵、当前项纯白独占、图片放大显眼。
4. **椒1.0 调优②（plan A，本次重点）**：用户指出原站作品图是**弯曲贴在圆筒面**上的（平面 div 做不出凸弧）。于是在 DOM 文字层下加回 **WebGL 曲面图片层**，但做成**开放弧**（背面无几何=空）、与 DOM 共用角度/半径/透视。`PANEL_DEG` 从 52→46 软化曲率。✅ 当前形态。

> 教训：① 原站半径由 **vh** 驱动，不是 vw；② 非当前标题靠**暗色**（非透明）做层次；③ 图要"弯"必须真曲面(WebGL)，`rotateX` 只能倾斜；④ 改 three.js 参数后浏览器要 **navigate 重载**再截图（HMR 对一次性 useEffect 场景不干净）。

---

## 7. 待办（新对话从这里继续）

- [ ] **图片换自己作品图**：替换 `public/works/junni/*` 并改 `junniData.ts` 的 `image`（and_more 可留空）。
- [ ] **WORKS 大标题白/绿**：原站此屏是**纯白实心**，当前是黄绿描边（沿用品牌色）。要更 1:1 可切纯白或随滚动从描边→实心。
- [ ] **曲率/图大小**微调（`PANEL_DEG`）、亮度淡出曲线再贴原站手感。
- [ ] **跟随鼠标 gooey 黄绿金属球光标**（原站全屏 WebGL，`data-gooey-color="yellow"`），仍未做。
- [ ] **包体拆分**：`React.lazy` + 动态 import `JunniWorks` 降首屏。
- [ ] **移动端**：`max-width:768px` 基础适配在，小屏需再校半径/曲率。

---

## 8. 浏览器实测 / 调试备忘

- MCP：`cursor-ide-browser`（`browser_navigate` / `browser_cdp` / `browser_take_screenshot` / `browser_lock`）。**仅 Agent 模式可用**。
- 本地预览：`http://localhost:5173/`。原站参考：`https://junni.co.jp/`。
- 滚到 WORKS 段套路（Lenis 会拦截滚动，需多次写 scrollTop）：
  ```js
  const s=document.querySelector('.junni-works'); const t=s.offsetTop+s.offsetHeight*0.04;
  for(let i=0;i<24;i++){ window.scrollTo(0,t); document.scrollingElement.scrollTop=t; await wait(25); }
  await wait(700); // 再 browser_take_screenshot
  ```
- 抓原站参数：`browser_cdp` → `Runtime.evaluate` 解 `.home_works_item` 的 `getComputedStyle().transform`（matrix3d → rotateX 角 + 平移），及 `.home_works_list` 的 `perspective`。
- 原站 home_works 在 doc y≈1500 起、pin 约 2vh；和_more 为最后一项（end 态）。

---

## 9. Git / 版本

- 仓库：`https://github.com/ifu321123-ui/ifuyun.git`，分支 `main`。
- **本版本 = 椒1.0**，提交含：`JunniWorks.tsx`（WebGL 曲面图层 + DOM 文字层重写）、`JunniWorks.css`、`index.html`（Montserrat）、本交接文档。
- 上一里程碑：`云9.0`=`5708bbb`（实心圆柱贴图版，已被取代）。

---

## 10. 新对话快速启动指令（复制即用）

> 继续 junni.co.jp 首页 `home_works` 复刻。已读 `docs/junni-works-复刻交接.md`，当前版本 **椒1.0**。现状：`src/components/junni/JunniWorks.{tsx,css}` 用 **WebGL 曲面图片圆筒（three.js 开放弧，背面空）+ DOM 3D 文字标题层** 两层叠加，共用 `θ_i=(active−i)×25° / R=vh×0.52 / perspective500` 一套几何（见第 1、2 节），接入 `GunzeTransition`（`<JunniService/>` 下方），`npm run build` 通过。调参常量见第 5 节，历程/坑见第 6 节。下一步按第 7 节：①换自己作品图 ②WORKS 标题白/绿 ③曲率微调 ④gooey 光标。改后用浏览器（localhost:5173 滚到 WORKS 段，套路见第 8 节）截图对照原站，并 `npm run build` 验证。
