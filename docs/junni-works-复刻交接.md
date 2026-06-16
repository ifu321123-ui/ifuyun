# JUNNI home_works 复刻 · 对话交接文档

> 用途：在新对话里继续 1:1 复刻 [junni.co.jp](https://junni.co.jp/) 首页 **home_works**（WORKS 作品轮播）。把本文件喂给新会话即可无缝接力。
> 当前版本：**椒2.0**（2026-06-16）。架构 = **WebGL 曲面图片圆筒（开放弧，不透明深度遮挡）** + **DOM 3D 文字标题层** 叠加，**图文同一 rAF 驱动**，`npm run build` 通过。
> 历史命名沿用 `云N.0`（云3.0…云9.0=`5708bbb`），自椒系列起改用 `椒N.0`（椒1.0 → 椒2.0）。

> **椒2.0 相对椒1.0 的核心变更（本轮重点，解决"不丝滑 / 图文不同向 / 图片重叠"）：**
> 1. **图文同帧**：文字层不再用 React `setProgress` 每帧重渲，改为在 WebGL 的 `requestAnimationFrame` 里**命令式**直接写 `<li>` 的 transform/opacity（`updateDomItems`），图片与文字严格同帧、丝滑同步。
> 2. **方向校正**：`SPIN_SIGN` 由 `-1` 改为 `1`，让图片与 DOM 标题**竖直同向**滚动（椒1.0 文档里"-1 同向"是误判）。
> 3. **去重叠**：图片材质由"半透明交叉淡入"改为**不透明 + 深度遮挡**（`transparent:false` / `depthTest:true` / `depthWrite:true`），前图靠深度干净盖住后图；相邻图片只做**强暗化**只剩暗边，不再半透明糊叠。`PANEL_DEG` 回到 `25`。

---

## 0. 一句话目标

1:1 复刻 junni.co.jp 首页 `home_works`：随滚动旋转的 **横置圆筒**——6 个作品的**图片弯曲贴在筒面上**（凸弧、随滚动转），正前方作品图最大最清晰、大白标题压在其上，上方相邻作品是**暗灰幽灵标题**，**背面完全空（只露深底）**；配巨型 **WORKS** 描边标题 + 底部黄绿 shift 擦除条。深底 `#1c1d21` + 黄绿 `#dcff46`。文案/动效按原站 1:1，图片为自己项目素材占位。

---

## 1. 当前架构（椒2.0）★

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

- **WebGL 曲面图片层**：每个有图的作品 = 一个**单位半径的局部圆柱弧段**，贴该作品图。背面/间隙**无几何 = 纯深底**（不是闭罐，这点是相对最早"实心圆筒"版的关键纠正）。**椒2.0：材质改为不透明 + 深度遮挡**，前图盖后图靠 z-buffer，相邻图片只做强暗化（只露暗边），不再半透明互叠。
- **DOM 文字标题层**：当前项纯白居中独占，其余压成 `#313238` 暗灰幽灵（实测原站 `#262626`），副标题逐字浮现。
- 两层用**同一 `progress`** 驱动旋转，且半径/透视对齐 → 文字标题正好压在对应曲面图片上。**椒2.0：两层都在 WebGL 的 rAF 内同帧更新**——`progressRef`（GSAP onUpdate 写）→ rAF 内 `updateDomItems(active)` 命令式写 DOM transform + 同帧转 WebGL，去掉了 React 每帧重渲，丝滑且不脱节。只有"当前项标题文本"用一个 `activeTitle` state 在 activeIndex 变化时更新（无障碍 `aria-live`）。

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
- 外层 `drum.rotation.z = π/2`（圆柱轴→屏幕水平 X）；内层 `spinner.rotation.y = SPIN_SIGN × active × STEP_RAD` 随滚动自转；每个 mesh `rotation.y = −SPIN_SIGN × i × STEP_RAD`（基准角）。**椒2.0：`SPIN_SIGN = 1`**（椒1.0 的 `-1` 会让图片与文字竖直反向，已纠正为同向）。
- 每张图弧段：`CylinderGeometry(1, 1, aspect×PANEL_RAD, 64, 1, true, −PANEL_RAD/2, PANEL_RAD)`，`axial = aspect×PANEL_RAD` 保证不变形；贴图 `tex.rotation = −π/2`（圆周→屏幕竖直需转 90°）。
- **椒2.0 材质（关键改动）**：`MeshBasicMaterial({transparent:false, side:FrontSide, depthTest:true, depthWrite:true, toneMapped:false})` —— **不透明 + 写深度**，前图靠 z-buffer 干净遮挡后图，彻底消除半透明卡片互相糊叠。每帧按 `eff=(active−i)×25°`：用 `t=clamp(1−|eff|/25,0,1)`、亮度 `b=0.1+t²×0.9`（相邻图迅速压暗到只剩暗边），`color.setScalar(b)`；`renderOrder=round(1000−|eff|)`、正前方轻微放大 `scale=1+clamp(1−|eff|/44,0,1)×0.012` 防共面闪烁；`|eff|>64°` 隐藏。
  - 椒1.0 旧逻辑（已废弃）：`transparent:true / depthWrite:false`，`opacity=1−(a−6)/78` 交叉淡入 → 多张半透明弧片叠加发糊（即用户截图里的"卡片重叠"）。

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
├─ JunniWorks.tsx   # ★椒2.0：WebGL 曲面图片圆筒(three.js,不透明深度遮挡) + DOM 3D 文字标题(rAF 命令式) + WORKS 标题 + shift
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
- 滚动：`SmoothScroll.tsx`(Lenis) 外层包裹；GSAP ScrollTrigger(scrub) → `progressRef`（rAF 读，**同帧同时驱动 WebGL 旋转 + DOM 标题 transform**，见 `updateDomItems`）。椒2.0 已移除 `progress` state（避免每帧 React 重渲）。
- dev：`npm run dev`（端口 5173，strictPort）。**PowerShell 不支持 `&&`，命令分开或用 `;`**。

---

## 5. 调参速查（`JunniWorks.tsx` 顶部常量）

| 常量 | 现值 | 作用 |
|---|---|---|
| `STEP_DEG` | 25 | 作品间隔角 |
| `FRONT_DEG` | 0 | 当前项在正前方 θ |
| `PERSPECTIVE` | 500 | 透视（DOM/WebGL 共用，越大越平）|
| `PANEL_DEG` | 25 | 单张图圆周张角=屏幕高度/曲率；椒2.0 与 STEP 接近避免实体卡片互挤。调大=图更高更弯（不透明深度遮挡下可放心调大）|
| `SPIN_SIGN` | 1 | 旋转方向（椒2.0 改为 1，让图随滚动与文字**竖直同向**）|
| `TEX_ROTATION` | −π/2 | 贴图旋正 |
| `computeRadius` | `clamp(vh×0.52,220,520)` | 半径 |

椒2.0 渲染调参（在 `renderFrame` 里，非顶部常量）：相邻图暗化曲线 `b=0.1+t²×0.9`（`t=1−|eff|/25`，调小分母=相邻图更暗更快消失）；可见阈值 `|eff|<64°`；`renderOrder=1000−|eff|`。

CSS 侧：`.junni-works__item-title` 非当前色 `#313238` / 当前 `#fff`；`.junni-works__scrim` 暗罩强度；`.junni-works__title-echo` 的 WORKS 描边（现 `#dcff46` 描边，原站此屏其实是纯白实心，可按需切换）。

---

## 6. 复刻历程 / 关键决策（避免回头踩坑）

1. **云9.0 及更早**：用 three.js **实心圆柱** + 6 图烘焙成一张贴图裹满 360° → 看着像**封闭罐头**。被用户否定（"原站不是完整圆筒"）。
2. **云10.0（架构重做）**：CDP 实测 + 反推确认原站文字是 **纯 CSS 3D DOM 卡片**（25°/perspective500/开放弧）。弃用 three.js，纯 DOM 文字层落地，bundle 950→436kB。
3. **椒1.0 调优①**：DOM 版初版"灰字一堆+图压暗+半径太小"显得又乱又空。按实测改：**R=vh×0.52**（之前误用 vw×0.352 太小）、非当前项 → 暗灰幽灵、当前项纯白独占、图片放大显眼。
4. **椒1.0 调优②（plan A）**：用户指出原站作品图是**弯曲贴在圆筒面**上的（平面 div 做不出凸弧）。于是在 DOM 文字层下加回 **WebGL 曲面图片层**，但做成**开放弧**（背面无几何=空）、与 DOM 共用角度/半径/透视。`PANEL_DEG` 从 52→46 软化曲率。
5. **椒2.0 调优①（丝滑 + 同向）**：用户反馈"没原站丝滑、图文不同方向滚"。定位到两套时钟（WebGL 走 rAF、DOM 走 React setState）导致脱节，且 `SPIN_SIGN=-1` 让图文竖直反向。→ 文字改 **rAF 内命令式更新**（去掉 setProgress），`SPIN_SIGN` 改 **1**。
6. **椒2.0 调优②（去重叠，本轮重点）**：用户截图指出"卡片重叠发糊"。**先误判**为"原站是单图层只显示一张图"（建议改单图层）；用户又补 4 张原站不同滚动位置截图，证明原站是**真·多图滚筒**（相邻作品图确实存在，只是被推到边缘、强烈变暗、只露暗边，且彼此不糊叠）。**纠正方案**：保留多图滚筒，把材质从"半透明交叉淡入"改为**不透明 + 深度遮挡**，相邻图强暗化。一次过头（`PANEL_DEG=44` + 暗化太弱→实体大图互挤），再收 `PANEL_DEG→25` + 暗化曲线 `b=0.1+t²×0.9`（`t=1−|eff|/25`）。✅ 当前形态。

> 教训：① 原站半径由 **vh** 驱动，不是 vw；② 非当前标题靠**暗色**（非透明）做层次；③ 图要"弯"必须真曲面(WebGL)，`rotateX` 只能倾斜；④ 改 three.js 参数后浏览器要 **navigate 重载**再截图（HMR 对一次性 useEffect 场景不干净）；⑤ **图文必须同一时钟**（同一 rAF）才丝滑、不脱节，别让 WebGL 走 rAF、DOM 走 React state；⑥ **多曲面图片去重叠靠"不透明+深度遮挡"，不是靠半透明淡入**（半透明叠加=糊）；⑦ 判断原站机制前**多要几张不同滚动位置的截图**，单帧容易误判（本轮"单图层"误判教训）；⑧ 截图验证时滚到的位置可能正处于**两作品过渡中点**，会天然看到两图相接，别误当 bug。

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
- **本版本 = 椒2.0**，提交含：`JunniWorks.tsx`（图文同 rAF 命令式驱动 + `SPIN_SIGN=1` + 不透明深度遮挡材质 + 暗化曲线 + `PANEL_DEG=25`）、本交接文档更新。
- 上一里程碑：`椒1.0`（WebGL 曲面图层 + DOM 文字层，半透明交叉淡入版，已被椒2.0 取代）；`云9.0`=`5708bbb`（实心圆柱贴图版）。

---

## 10. 新对话快速启动指令（复制即用）

> 继续 junni.co.jp 首页 `home_works` 复刻。已读 `docs/junni-works-复刻交接.md`，当前版本 **椒2.0**。现状：`src/components/junni/JunniWorks.{tsx,css}` 用 **WebGL 曲面图片圆筒（three.js 开放弧，背面空，不透明+深度遮挡）+ DOM 3D 文字标题层** 两层叠加，**图文同一 rAF 命令式驱动**（`updateDomItems`，无 React 每帧重渲），`SPIN_SIGN=1` 图文同向，共用 `θ_i=(active−i)×25° / R=vh×0.52 / perspective500` 一套几何（见第 1、2 节），接入 `GunzeTransition`（`<JunniService/>` 下方），`npm run build` 通过。重叠靠不透明深度遮挡 + 相邻图强暗化解决（非半透明淡入）。调参见第 5 节，历程/坑见第 6 节（注意"单图层"是已纠正的误判，原站是多图滚筒）。下一步按第 7 节：①换自己作品图 ②WORKS 标题白/绿 ③曲率微调 ④gooey 光标。改后用浏览器（localhost:5173 滚到 WORKS 段，套路见第 8 节）截图对照原站，并 `npm run build` 验证。
