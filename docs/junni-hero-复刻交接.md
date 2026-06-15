# JUNNI Hero 复刻 · 对话交接文档

> 用途：在新对话里继续调整 junni.co.jp 首屏（Hero）复刻效果。把本文件作为上下文喂给新会话即可无缝接力。
> 最后更新：2026-06-15（MVP 2.0 6×6 网格卡片版已落地并实测通过，见第 4½ 节）

---

## 0. 一句话目标

复刻 [junni.co.jp](https://junni.co.jp/) 首页 TOP 区，作为本站「真正的入口界面」，拼接在现有首页 Hero（图一 `FUYUN PRODUCT OS`）**上方**，向下滚动自然过渡进入图一。最终要完整复刻 Hero + WORKS + SERVICE + AWARDS + RECRUIT + CONTACT，保留日文原文案做 1:1 视觉复刻。

**当前阶段**：`JunniHero` 首屏 MVP 2.0（6×6 网格卡片翻面）+ `JunniAbout` 绿底区**已完成并实测通过**；下一步补 WORKS / SERVICE 等后续区块。

---

## 1. 技术栈与项目现状（已确认）

- 框架：**React 19 + Vite 8 + TypeScript**（不是原站的 Astro，不影响动效复刻）
- 已有依赖：**`gsap ^3.15.0`**、**`lenis ^1.3.23`**（平滑滚动）、Tailwind v4
- **无 Three.js / Pixi.js**（原站 Hero 有 `canvas data-engine="three.js"` 氛围层，但非灵魂动效，暂不引入）
- 平滑滚动由 `src/components/SmoothScroll.tsx`（Lenis）在 `App` 外层统一包裹
- 既有同款滚动驱动先例：**`src/components/GunzeTransition.tsx`**（sticky + GSAP ScrollTrigger `scrub` + `lenis.on('scroll', ScrollTrigger.update)`）——这是 junni Hero 应对齐的模式范本

### 插入位置
`src/App.tsx` 首页 `home` 分支，`<JunniTop />` 放在 `<Hero />` 之上：

```tsx
default:
  return (
    <>
      <JunniTop onInZoneChange={onJunniZoneChange} />
      <Hero />   {/* 图一 FUYUN PRODUCT OS */}
    </>
  )
```

`Navbar` 已加 `hidden` prop：junni 区域内隐藏全局导航，滚过后淡入。

---

## 2. 已创建的文件（MVP 2.0 已落地，6×6 网格卡片版）

```
src/components/junni/
├─ JunniTop.tsx      # 编排器（JunniHero + JunniAbout，预留 WORKS/SERVICE 等）
├─ JunniHero.tsx     # ✅ 6×6=36 格卡片网格：方案 B 负位移 + rotateY(180) 翻面 + sticky 手动 progress
├─ JunniAbout.tsx    # ✅ home_about 绿底黑字逐段日文 + ABOUT JUNNI 按钮
├─ junni.css         # .junni-* 命名空间（网格/卡片/双面/about + 性能）
└─ junniData.ts      # 日文文案 + 网格常量（COLS/ROWS/COUNT/STAGE_VH）
```

> 已通过浏览器实测：负位移拼回 KV 文字正确、从中心向四周扩散翻面（角度网格呈同心圆梯度）、
> ±5° 鼠标随动生效、progress=1 后整块 `display:none`、自然滚入绿底 about。

改动过的既有文件：
- `src/App.tsx`：引入 `JunniTop`，加 `inJunniZone` 状态与 `onJunniZoneChange`
- `src/components/Navbar.tsx`：新增 `hidden?: boolean` prop

构建状态：`npm run build` 通过（注意 Windows PowerShell 不支持 `&&`，命令分开写或用 `;`）。

---

## 3. 关键认知演进（避免新对话重走弯路）

经历了 3 次方向修正，最终对原站的正确理解如下。

### ❌ 弯路一：纯 CSS 静态复刻
最初以为用 `IntersectionObserver` + CSS keyframes 即可。**错**：做不出原站滚动驱动的 3D 翻转。

### ❌ 弯路二：横向百叶窗切片（= 当前 MVP 1.0 的实现）
改成 8 条水平条带绕 X 轴 `rotateX(-90)` + 淡出。**仍错**：原站不是横条。

### ✅ 正确模型（看原站真实 DOM 后确认）
原站 Hero (`.home_kv`) 是 **6 × 6 = 36 格卡片矩阵**：

```html
<div class="home_kv_panel" data-panel="1" style="--pos-x:0; --pos-y:0;">
  <div class="home_kv_panel_item" data-panel-item="front"></div>
  <div class="home_kv_panel_item" data-panel-item="back"></div>
</div>
<!-- ... 共 36 个 ... -->
```

- 整张 KV 视觉被切成 6 列 × 6 行（`background-size:1160px...; background-position` 每列偏移 `1160/6≈193.33px`）
- 每格有 **front / back 两面**（卡片正反翻面）
- 滚动时整块被 GSAP **`pin`** 锁定（DOM 里有 `pin-spacer-home_kv`，内部 `position:fixed`）
- 翻完后继续下滚进入 `.home_about`（荧光绿 `#CBEA41` 底 + 逐字日文大段文案 + `ABOUT JUNNI` 翻转按钮）
- 氛围层：`canvas`(three.js) 噪点、`home_kv_baku`(小牛 Lottie `baku-welcome`)、`gooeyCursor`、`circleCursor`(SCROLL DOWN・MORE DETAIL 圆形游标)

---

## 4. JunniHero MVP 2.0 重构规格（✅ 已按此实现）

> 这份规格已修正 Gemini 点评里的 3 个错误（翻转轴 / stagger / pin）。**第 4½ 节是据此落地的 as-built 记录**。

### 4.1 网格结构（6×6 = 36 格）
- 废弃 8 条横向 slices
- 每格 `width:16.66%; height:16.66%; overflow:hidden` 作为**裁切窗**

### 4.2 ★无素材切片（方案 B，核心）
项目**没有**原站那两张黑底白字 / 绿底黑字全景图，**禁止用 background-image 切图**。改用纯 DOM 负位移：
- 每格内部 front/back 各放一份满屏 `100vw×100vh` 的完整 Hero 画面
- 用 `transform: translate(-col*100%, -row*100%)`（相对格子）把整图拼回
- front：黑底白字 `JUNNI` + 日文主张
- back：荧光绿 `#CBEA41` 底 + 局部内容
- 好处：零素材依赖、可缩放、60fps

### 4.3 翻转机制（修正 Gemini 错误）
- 是 **`rotateY(180)` 卡片正反翻面** + `backface-visibility:hidden`
- **不是**转 90° 淡出露底（那是错误的百叶窗模型）

### 4.4 滚动驱动（修正 Gemini 错误）
- 沿用 `GunzeTransition` 的 **sticky + 手动 `apply(progress)`** 模型
- 每格延迟**自己按「到网格中心的距离」计算**，实现 from-center 扩散：
  ```
  dist = distance((col,row), center) / maxDist   // 0~1
  local = map(progress, start + dist*spread, end, 0, 1)
  rotateY = local * 180
  ```
- **不要用** GSAP `stagger:{grid:[6,6]}`——它基于时间，与 `scrub` 不兼容，会「翻转不跟手」
- pin **优先用 `position:sticky`**，不要 `pin:true`（与 Lenis 易冲突，需额外 scrollerProxy）

### 4.5 鼠标随动（加分项）
- 未滚动时绑定轻量 `onMouseMove`，给网格父层施加 ±5° 的 `rotateX/Y` 微随动
- 父层留 `translateZ(-20px)` 纵深（对应原站 `translate3d(0,0,-20px)`）

### 4.6 下一层衔接
- 翻完继续下滚进入 `home_about` 风格：荧光绿底 + 逐字日文文案 + `ABOUT JUNNI`
- **注意**：这是独立的下一区块，不是「翻转直接露出的底层」

### 4.7 性能 & 无障碍
- 36 格 ×(front+back) = 72 个满屏图层，配 `will-change: transform`，翻完后降级移除
- `prefers-reduced-motion: reduce` 时降级为简单淡入

---

## 4½. 实现纪要（as-built，本次对话产出）

> 这一节是规格落地后的**真实实现记录**：常量、DOM/CSS 结构、踩坑与决策、实测证据。改参数照这里调。

### A. DOM 层级（`JunniHero.tsx`）
```
section.junni-hero-stage            高 = JUNNI_STAGE_VH*100vh（滚动行程）
 └ div.junni-hero-scene             position:sticky; top:0; height:100vh; overflow:hidden
    └ div.junni-grid-perspective    perspective:1200px ★唯一共享透视（整体可 display:none）
       └ div.junni-grid             preserve-3d; translateZ(-20px) rotateX/Y(鼠标随动); flex-wrap
          └ 36× div.junni-cell      width/height: calc(100%/6); preserve-3d（无 overflow/无独立透视）
             └ div.junni-card       SCROLL 层：JS 写 rotateY(local*180deg); 无 transition; preserve-3d
                └ div.junni-card-flip  HOVER 层：.is-hovered→rotateY(180); transition .5s; preserve-3d
                   ├ .junni-face--front  clip-path:inset(0) + backface-visibility:hidden
                   │  └ .junni-face-fill 100vw×100vh + 负位移；内含 <HeroKV/>（黑底白字 KV）
                   └ .junni-face--back   rotateY(180deg) + clip-path:inset(0) + backface-visibility:hidden
                      └ .junni-face-fill 100vw×100vh 纯荧光绿实底（不放文案，见坑 1）
```
- `JunniAbout.tsx`：`section.junni-about`（绿底黑字 7 行日文 + `ABOUT JUNNI` 胶囊按钮），由 `JunniTop` 排在 `JunniHero` 之后，sticky 释放后自然滚入。

### B. 关键常量（`JunniHero.tsx` 顶部 / `junniData.ts`）
| 常量 | 值 | 作用 |
|---|---|---|
| `JUNNI_GRID_COLS/ROWS` | `6 / 6` | 网格规模 |
| `JUNNI_STAGE_VH` | `2.6` | 舞台总高（滚动行程 = (2.6−1)×100vh）|
| `FLIP_START` | `0.06` | 中心格起翻的 progress |
| `FLIP_END` | `0.82` | 最远格翻完的 progress；同时 sticky 底色切绿 |
| `FLIP_SPREAD` | `0.6` | 距离权重最大附加延迟（扩散快慢；调大→同心波浪更明显）|
| `TILT_MAX` | `5` | 鼠标随动封顶角度（°）|
| scrub | `0.4` | ScrollTrigger 跟手阻尼 |
| `--junni-gap`（css） | `2.76px` | 巧克力网格缝隙（原站值）|
| `--junni-radius`（css） | `9px` | 单格圆角（原站值）|
| `--junni-panel`（css） | `#111` | 卡片正面暗阶（原站 RGB 17,17,17）|

### C. 核心公式
```js
// 每格到中心的归一化欧几里得距离（cx=cy=2.5, maxDist=hypot(2.5,2.5)≈3.5355）
dist  = hypot(col-2.5, row-2.5) / 3.5355                 // 0(中心)~1(四角)
local = map(progress, FLIP_START + dist*FLIP_SPREAD, FLIP_END, 0, 1)
rotateY = local * 180                                     // 写到 .junni-card

// 鼠标随动（仅 progress<=FLIP_START 时生效，随后快速衰减）
damp = 1 - clamp(progress / FLIP_START, 0, 1)
rotateX = (-py*2) * TILT_MAX * damp                       // py,px 为指针在 scene 内的 -0.5~0.5
rotateY = ( px*2) * TILT_MAX * damp                       // 写到 .junni-grid 的 CSS 变量
```
- 驱动：`gsap.to(state,{progress:1,scrub:0.4, scrollTrigger:{trigger:stage,start:'top top',end:'bottom bottom'}})` + `lenis.on('scroll', ScrollTrigger.update)`，与 `GunzeTransition` 一致。
- 收尾：`progress>=FLIP_END` → `scene.background` 黑切绿；`progress>=0.999` → `.junni-grid-perspective.display='none'`（销毁 72 图层）。

### D. 踩坑与决策（重要，别推翻）
1. **背面必须纯色、不放文案**：`rotateY(180)` 会把背面内容逐格水平镜像，细节图会被打乱；纯荧光绿实底才能无缝拼回。契合规格「背面为荧光绿底」。
2. **亚像素绿缝 / 外框**：`translateZ(-20px)` 让网格略缩 + 高 DPI 下 1/6 非整数像素，会在黑底 KV 上露出绿色细缝和外框。**解法**：sticky 底色默认 `#0a0a0a`（与正面黑同色而隐形），到 `progress>=FLIP_END`（多数格已翻绿）再切 `#cbea41`，缝隙随之由黑转绿、并与 about 无缝衔接。
3. **负位移用 vw/vh，不是 %；含 gap 时步进 = (100vw+gap)/6**：CSS `transform` 百分比相对元素自身盒（face-fill=100vw），写 `translate(-col*100%)` 会错位。**且加入网格缝隙 `gap` 后**，单格屏幕步进 = `cellW + gap = (100vw + gap)/6`，故落地为 `translate(calc(var(--col)*(100vw+var(--junni-gap))/6*-1), …)`。这样整图按 1:1 铺满 6 格+5 缝，缝隙处画面被网格线遮住，字形不再错位穿帮。
4. **`cells` 用 `useMemo([])`**、effect 依赖保持稳定（`lenis` / `onInZoneChange` 均稳定）：避免滚动时 `onInZoneChange` 触发 App re-render 后反复 kill/重建 ScrollTrigger。
5. **Navbar 显隐**：改用 `.junni-root` 的 `getBoundingClientRect().bottom > innerHeight*0.6` 判定 `inJunniZone`（取代旧 sentinel 哨兵）。
6. **共享透视（取代旧的每格独立 `perspective:900px`）**：⚠️ 早期为绕过 `overflow:hidden` 截断 3D 继承，给每格 `.junni-cell` 各加 `perspective:900px`——**这是错误根因**：`overflow:hidden`（以及 `clip-path`、`filter`、`opacity<1` 等）都会创建**扁平化 / 独立 3D 上下文**，逼迫每格各成一个灭点。36 个独立灭点排开后，翻到接近 90° 时各自朝本格中心收窄，整行呈**手风琴 / 折叠门梯形穿帮**（不是 `transform-origin` 的锅，它本就是默认 `center`）。**正解（修正 B 路线1）**：① 透视只在最外层 `.junni-grid-perspective` 写一个（`perspective:1200px`）；② 从 `.junni-grid`→`.junni-cell`→`.junni-card`→`.junni-card-flip` **一路 `transform-style:preserve-3d`**，让全部卡片共用单一灭点、平行整齐翻转；③ 格内裁切下放到 `.junni-face` 的 `clip-path:inset(0)`（在叶子 face 层扁平化无害，仍能把 100vw/vh 负位移拼图限制在本格内）。`.junni-cell` 去掉 `overflow:hidden` 后翻面会有真实 3D 厚度感（卡片旋出格子边界是预期效果，不再被切平）。
7. **逐格 Hover 翻面用「双层」拆分（修正 A）**：scroll 翻转角由 JS 每帧覆写在 `.junni-card`（**无 transition**，保证 scrub 跟手）；Hover 的 180° 增量单独挂在内层 `.junni-card-flip` 上，靠 CSS `transition: transform 0.5s cubic-bezier(0.25,1,0.5,1)` 平滑。两层都 `preserve-3d`、同轴 `rotateY` 自然叠加，互不打架。仅 `progress<=FLIP_START`（首屏静止）时 `mouseenter` 加 `.is-hovered`；一旦滚动越过 `FLIP_START`，`apply()` 内 `clearHover()` 撤掉所有悬浮翻面。
   > **后续 WORKS/SERVICE 区块若也要做 3D 翻牌/卡片网格，务必遵循此真因**：需要 3D 的层级链上别用 `overflow:hidden`/`clip-path`/`filter`/`opacity<1`，裁切放到不需要再向下传 3D 的叶子层；透视尽量集中在一个父容器上，避免多灭点畸变。
8. **巧克力网格视觉高保真（对齐原站 `.home_kv_panel_item` computed）**：原站每格不是糊死的纯黑，而是 **`#111`（RGB 17,17,17）暗阶 + `border-radius:9px` 圆角 + 单元缝隙 `gap≈2.76px`**，缝隙露出更深的底色形成网格线，整体像“巧克力块”。落地：`.junni-grid` 改 **CSS Grid**（`repeat(6,1fr)`+`gap:var(--junni-gap)`，整除拼合不会因 flex 子像素累计错行）；`--junni-panel:#111` 给 front fill，scene 底 `#0a0a0a`（更深）透过缝隙当网格线；圆角用 `.junni-face { clip-path: inset(0 round var(--junni-radius)); border-radius:9px }`。**附带收益**：刻意的网格缝隙正好把负位移方案的亚像素接缝“做成”网格线，原本静止时 N/I 的锯齿断裂随之消失。
9. **首屏只放 Logo+手写标语，主张文案归绿底区**：原站黑底首屏**只有**居中巨型 `JUNNI` + 手写体 `自由に、ユニークに。`（`junniData.tagline`），克制留白。早期把 `manifesto`（わたしたち…）大段塞在黑底左下是错的——已移入 `JunniAbout` 绿底区作引导大字（`.junni-about__copy--lead`）。Logo 用 `font-size: clamp(4rem,14.5vw,44rem)` 随视口线性缩放（约占 48% 宽），**注意别用过小的 `max`（如旧的 15rem）**，否则宽屏/高 DPR 下被截断显小。布局：`.junni-kv__center` 绝对居中、MENU 右上、`SCROLL` 用 `writing-mode:vertical-rl` 竖排左侧。

### E. 实测证据（浏览器内验证通过）
- **from-center 扩散**：progress≈0.38 时角度网格呈同心梯度 `中心64° → 42° → 25° → 角0°`。
- **鼠标随动**：指针置右上角实测 `rotateX≈3.0° / rotateY≈3.5°`（封顶 5°）。
- **性能降级**：progress=1 时 `.junni-grid-perspective` 已 `display:none`。
- **下一层**：绿底 `JunniAbout` 7 行日文 + 按钮渲染正常。
- **构建**：`npm run build` 通过、无 lint 报错。
- 测试技巧：Lenis 惯性使程序化定位困难，实测靠 `dispatchEvent(new WheelEvent('wheel',{deltaY}))` 驱动 Lenis、逐帧逼近目标 `scrollY`。

### F. 已知残留
- `JunniAbout` 绿底 → 图一浅色 `FUYUN PRODUCT OS` 目前是直接衔接，缺过渡（见待办「junni → 图一 交界过渡」）。

---

## 5. 日文文案（已抓取，存于 junniData.ts，1:1 保留）

**主张（manifesto）**：
```
わたしたちジュニは
自由で、ユニークな発想で、
デジタルとリアルを融合した
"体験"を伴うクリエイティブを生み出す会社です。
```

**延伸（home_about）**：
```
創業以来、様々なブランドやコンテンツを、
広く世界に、ファンに届けるため、
WEBサイトやアプリ、動画配信サービスや、
デジタルサイネージを活用した体験コンテンツなど
多様なクリエイティブを作成してきました。
これからも様々なクリエイティブを、
つねに、"体験"の設計から考えていきます。
```

- Logo：`JUNNI`
- CTA：`ABOUT JUNNI`
- 圆形游标 / 跑马灯：`SCROLL DOWN・MORE DETAIL・`
- 荧光绿主色：`#CBEA41`（原站字符色 `rgb(204,234,78)`）

### 后续区块文案（补齐时用）
- **WORKS**（建议精选 4–5 + and more）：BaSICA / Alche, Inc / 2nd STAR PRODUCTION / ONE PIECE BASE / M@STER EXPO / and more...
- **SERVICE**（01–06）：Virtual Gallery / NFT (Non Fangible Token) / AR Experience / GPS Check in / Aceess Control System / Live Streaming Platform
- **AWARDS**（用文字标识即可，无需图）：Awwwards / The FWA / CSS Design Awards / The Webby Awards / CSS Winner / CSSREEL / DESIGN AWARDS ASIA
- **RECRUIT**：招募大段日文 + `JOIN US` 循环跑马灯 + `JUNNI IS...` / `RECRUIT` 按钮
- **CONTACT / Footer**：`CONTACT US` + TOP/ABOUT/WORKS/SERVICE/RECRUIT/CONTACT + 版权 `Copyright © JUNNI Co., Ltd.` + X/facebook/Instagram/note

---

## 6. 新对话快速启动指令（复制即用）

> 继续 junni.co.jp 首屏复刻。已读 `docs/junni-hero-复刻交接.md`。**JunniHero MVP 2.0（6×6 网格卡片翻面）+ JunniAbout 绿底区已完成并实测通过**（实现细节见第 4½ 节，参数照表调）。下一步请在 `src/components/junni/` 下新增 WORKS 区块（精选 4–5 + and more），沿用 `.junni-*` 命名空间与 sticky/scrub 范式；文案见第 5 节。若要先收尾 Hero，可做「junni → 图一交界过渡」消除绿/黑硬切到浅色 Product OS。

### 调参速查
- 翻面更快铺满 → 调小 `FLIP_SPREAD`（当前 0.6）或提早 `FLIP_END`（当前 0.82）；调大 `FLIP_SPREAD` 则同心波浪更分明
- 整段滚动更短/更长 → 改 `JUNNI_STAGE_VH`（当前 2.6）
- 跟手更紧 → 调小 scrub（当前 0.4）
- 鼠标悬浮更强 → 调大 `TILT_MAX`（当前 5）

---

## 7. 待办清单

- [x] **重构 JunniHero 为 6×6 网格**（MVP 2.0 已完成）
- [x] 鼠标随动 3D 浮动（±5° rotateX/Y + translateZ(-20px)）
- [x] **逐格 Hover 独立翻面**（首屏静止时 mouseenter→rotateY(180)，双层叠加见坑 7）
- [x] **共享透视消折叠门梯形**（单灭点 + 一路 preserve-3d + clip-path 裁切，见坑 6）
- [x] **巧克力网格视觉高保真**（#111 暗阶 + gap 2.76px + radius 9px，见坑 8）
- [x] **首屏布局对齐原站**（JUNNI 居中 + 手写标语，主张文案迁入绿底，见坑 9）
- [x] `home_about` 绿底逐字日文区（JunniAbout.tsx）
- [ ] 圆形游标 SCROLL DOWN / gooey cursor（氛围，可选）
- [ ] WORKS 区块（精选 4–5）
- [ ] SERVICE 区块（01–06）
- [ ] AWARDS（文字版）
- [ ] RECRUIT（JOIN US 跑马灯）
- [ ] CONTACT / Footer
- [ ] junni → 图一 交界过渡（避免绿/黑硬切到浅色 Product OS）
- [ ] 性能复核（72 图层 will-change / 降级）
