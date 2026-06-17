# JUNNI About→Works Shift 过渡 · 对话交接文档

> 用途：在新对话里继续实现 junni.co.jp 首页 **home_about → home_works** 的「百叶窗/切片」区块过渡。把本文件喂给新会话即可无缝接力。
> 来源：2026-06-17 对话整理（含原站 HTML 实锤、Gemini 方案核对、本项目差距分析）。
> 关联文档：[junni-hero-复刻交接.md](./junni-hero-复刻交接.md)、[junni-works-复刻交接.md](./junni-works-复刻交接.md)、[junni-service-复刻交接.md](./junni-service-复刻交接.md)

---

## 0. 一句话目标

复刻 junni.co.jp 首页从 **荧光绿 About 区** 滚入 **深色 Works 区** 时的过渡效果：4 条深色横带以交错延迟（stagger）从 `scaleY(0)` 展开到 `scaleY(1)`，像百叶窗一样盖住绿底，同时露出下方已就位的 Works（巨型描边 WORKS 标题 + 3D 轮播）。**当前项目最缺的一环是 `home_about_shift` 滚动驱动桥接**；`JunniWorks` 组件已存在但未接入 `JunniTop`。

---

## 1. 这个效果叫什么？

| 名称 | 说明 |
|------|------|
| **Shift / Shift Layer** | 原站源码类名（`.shift`、`.shift_layer`） |
| **Staggered Wipe** | 多条带交错擦除 |
| **Venetian Blind Transition** | 百叶窗式过渡（行业俗称） |
| **DOM Slice Reveal** | DOM 切片场景切换 |
| **Scroll-scrubbed Section Transition** | GSAP 社区技术向说法 |

**不是**传统意义的 page flip / 整页翻页；也**不是** Swup 路由切换（Swup 只管站内链接跳转）。

---

## 2. 原站技术栈（用户粘贴 HTML 实锤）

| 技术 | 证据 |
|------|------|
| **Astro** | `astro-island`、`/assets/scripts/entry-*.js` |
| **Lenis** | `<html class="... lenis lenis-scrolling">` |
| **GSAP ScrollTrigger** | 多处 `pin-spacer pin-spacer-*`（pin 时自动生成） |
| **Swup** | `swup-enabled`、`#swup` —— **仅站内路由**，不参与滚动场景切换 |
| **Three.js** | 顶层 `<canvas id="canvas" data-engine="three.js r162">` |
| **Lottie** | `data-lottie="baku-welcome"` 等 |

**核心结论**：About→Works 的百叶窗过渡 = **DOM `.shift_layer` + GSAP ScrollTrigger（pin + scrub）+ Lenis**；Three.js 只负责 Works 曲面图片，**不参与** shift 擦除。

---

## 3. 原站 `.shift` 用法（全站模式）

原站把 `.shift` 作为**每个大 section 底部的标准过渡组件**：

```
home_about   → .home_about_shift    （4 条，scaleY 0→1，盖住绿底）
home_works   → .home_works_shift    （4 条，Works 区块底部）
home_service → .home_service_shift  （4 条，进场擦除）
```

### About 末尾真实 DOM（用户粘贴）

```html
<div class="home_about" data-gooey-color="black">
  <div class="home_about_inner">…逐字 span 文案…</div>
  <div class="shift home_about_shift">
    <div class="shift_layer home_about_shift_layer"
         style="transform: scale(1, 0);"></div>
    <!-- ×4，初始全是 scale(1, 0) = scaleY(0) -->
  </div>
</div>
```

### Works 紧跟其后（兄弟 section）

```html
<div class="home_works" data-gooey-color="yellow">
  <div class="pin-spacer pin-spacer-home_works_title">…repeatText WORKS…</div>
  <div class="pin-spacer pin-spacer-home_works_wrap" style="padding-bottom: 2745px">
    <div class="home_works_wrap is-fixed" style="position: fixed">
      <div class="home_works_inner is-visible">
        <div class="home_works_image"></div>
        <div class="home_works_slider">…3D 文字列表…</div>
      </div>
    </div>
  </div>
  <div class="shift home_works_shift">…4 layers…</div>
</div>
```

### 同一 `.shift` 的不同方向

| 位置 | 动画方向 | 作用 |
|------|----------|------|
| `home_about_shift` | `scaleY(0) → 1` | **盖住** 绿底，切入 Works |
| `home_service` 进场 | `scaleY(1) → 0` | **揭开** Service 区块（与 About 相反） |

本项目 `JunniService` 已实现 Service 进场反向擦除（IntersectionObserver + CSS transition），但用的是 **7 条竖向分栏**；原站 `home_service_shift` 实际是 **4 条**（与 about/works 一致）。

---

## 4. 过渡动画机制（原理）

1. `.shift` 容器：`position: absolute; inset: 0`，铺满父 section
2. `display: flex; flex-direction: column` → 切成 **4 条水平色带**
3. 每条 `.shift_layer` 初始 `scaleY(0)`（`transform: scale(1, 0)`）
4. 滚动时 GSAP stagger 到 `scaleY(1)`，背景色 `#1c1d21`（下一屏深色）
5. `transform-origin: top`，从上往下展开
6. ScrollTrigger：`pin: true` + `scrub: true`（原站有 `scrub: 0.4` 量级惯性）
7. Lenis：`lenis.on('scroll', ScrollTrigger.update)`

### WORKS 描边字 trick

原站 `home_works_title` 使用 `repeatText` 叠 7 层 WORKS，运行时内联：

```html
style="-webkit-text-stroke-color: rgb(255, 255, 255);
       -webkit-text-fill-color: rgb(255, 255, 255);"
```

过渡时 JS 按滚动进度改描边/填充色（绿底上可见绿描边空心字，深色条扫过后对比成立）。**不是**主要靠 `mix-blend-mode`，而是 **`-webkit-text-stroke` + `-webkit-text-fill-color` 动态切换**。

本项目 `JunniWorks.css` 已有类似实现：

```css
.junni-works__title-echo {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--works-green);
  -webkit-text-fill-color: var(--works-dark);
}
```

---

## 5. 为什么「翻页」不影响其他板块？

**区块隔离 + 多个独立 ScrollTrigger**，不是整页全局遮罩。

1. **每个 section 自带 `.shift`**，挂在父级内部，`pointer-events: none`，只服务该段过渡
2. **`pin-spacer` 只钉对应元素**（互不影响）：
   - `pin-spacer-home_kv` — Hero 翻面
   - `pin-spacer-home_works_title` — Works 标题
   - `pin-spacer-home_works_wrap` — Works 轮播（`padding-bottom: 2745px` 提供滚动行程）
   - `pin-spacer-home_recruit_main_image` — Recruit 主图
3. **Works 内容在 DOM 里已位于 About 下方**，shift 只是擦除幕布，不是跳转新页面
4. **`visibility: hidden`**：滚过的区块（如快照中的 `home_kv`、`home_about`）由 JS 隐藏，避免与 fixed/pinned 层叠冲突
5. **Swup 与滚动过渡分离**：点击导航走 Swup；同页滚动走 ScrollTrigger

---

## 6. Gemini 方案核对（纠正点）

| Gemini 说法 | 真实 HTML / 实测结论 |
|-------------|---------------------|
| `.shift_layer` + `scale(1,0)→scale(1,1)` | ✅ 正确 |
| GSAP ScrollTrigger + pin + scrub | ✅ 正确（`pin-spacer` 为证） |
| Lenis 平滑滚动 | ✅ 正确 |
| Service 用 7 条 shift | ❌ 原站 `home_service_shift` 也是 **4 条** |
| Three.js 做 shift 过渡 | ❌ shift 是纯 DOM；Three.js 只用于 Works 图 |
| 整页 pin 一个 wrapper | ❌ **多个独立 pin** |
| Works 底部 shift = About→Works 场景切换 | ⚠️ `home_works_shift` 更可能是 **Works→Service** 或氛围；本项目 `JunniWorks` 底部 4 条是 CSS `@keyframes` 无限循环装饰，**不是**滚动驱动场景切换 |

---

## 7. 首页滚动动效全景（DOM 顺序）

```
home_kv          → 6×6 rotateX 网格翻面 + pin-spacer-home_kv
home_about       → 逐字变色 + home_about_shift（绿→深）  ← 本次重点
home_works       → 双 pin（标题 + 轮播）+ WebGL + home_works_shift
home_service     → repeatText 标题 + 列表 + home_service_shift
home_awards      → …
home_recruit     → pin + 3D 翻面主图 + …
```

每种过渡技术不同；`.shift` 只是其中一种「区块擦除」手段。

---

## 8. 本项目现状对照

| 区块 | 原站 | 本项目 | 文件 |
|------|------|--------|------|
| Hero | 6×6 `rotateX` + pin | ✅ 已实现 | `JunniHero.tsx`、`junni.css` |
| About | 绿底 + 逐字变色 | ✅ 已实现（**无 shift**） | `JunniAbout.tsx` |
| **About→Works** | **4 条 scroll-driven shift** | ❌ **缺失** | 待新建或扩展现有组件 |
| Works | 双 pin + WebGL + 描边标题 | ✅ 已实现（**未接入 Top**） | `JunniWorks.tsx`、`JunniWorks.css` |
| Works 底部 shift | 4 条（过渡/氛围） | ⚠️ 装饰用 CSS 动画，非场景切换 | `JunniWorks.css` `@keyframes junniWorksShift` |
| Service 进场 | 4 条 shift 反向擦除 | ✅ 7 条 + IO（方向对，数量不同） | `JunniService.tsx` |

### 编排器现状

`src/components/junni/JunniTop.tsx`：

```tsx
<JunniHero onInZoneChange={onInZoneChange} />
<JunniAbout />
{/* 预留：JunniWorks / JunniService / … */}
```

`GunzeTransition.tsx` 已单独 import `JunniWorks`，但与 `JunniTop` 主链路分离。

### 已有可复用模式

- **Lenis + ScrollTrigger 同步**：`GunzeTransition.tsx`、`JunniHero.tsx`、`JunniAbout.tsx`、`JunniWorks.tsx`
- **SmoothScroll**：`src/components/SmoothScroll.tsx`
- **Gunze 问号过渡**：另一种 sticky + scrub 范例（非 shift）

---

## 9. 推荐实现方案（待新对话执行）

### 9.1 HTML 结构

在 `JunniAbout` **内部末尾**（与 `home_about_inner` 同级）：

```html
<section class="junni-about">
  <div class="junni-about__inner">…</div>
  <div class="junni-about__shift shift" aria-hidden="true">
    <span class="junni-about__shift-layer shift-layer"></span>
    <!-- ×4 -->
  </div>
</section>

<section class="junni-works">…</section>
```

`JunniTop.tsx` 接上：`<JunniAbout />` → `<JunniWorks />`。

### 9.2 CSS 要点

```css
.junni-about {
  position: relative;
  background: var(--junni-green); /* #cbea41 */
  /* 需为 pin 消耗预留额外滚动高度，见 ScrollTrigger end */
}

.junni-about__shift {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column; /* 水平色带 */
  pointer-events: none;
}

.junni-about__shift-layer {
  flex: 1;
  background: #1c1d21; /* 下一屏 Works 深色 */
  transform: scaleY(0);
  transform-origin: top top;
  will-change: transform;
}
```

### 9.3 JS（对齐现有 Lenis 集成）

```typescript
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"

gsap.registerPlugin(ScrollTrigger)

// 与 JunniHero / GunzeTransition 相同
lenis?.on("scroll", () => ScrollTrigger.update())

gsap.timeline({
  scrollTrigger: {
    trigger: ".junni-about",      // 或包装器，需实测 start/end
    start: "bottom bottom",       // 对照原站微调
    end: "+=100%",                // 过渡消耗的滚动距离
    pin: true,
    scrub: 0.4,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  },
}).to(".junni-about__shift-layer", {
  scaleY: 1,
  stagger: 0.08,
  ease: "none",
})
```

### 9.4 实现时注意

1. **pin 目标**：可能 pin 整个 `junni-about`，或 about+works 交界包装器——需对照原站滚动距离与 DevTools 中 `pin-spacer` 位置微调
2. **与 `JunniAbout` 逐字变色** 的 ScrollTrigger 不要冲突（不同 trigger 区间）
3. **Works 需提前在 DOM 中就位**，深色背景、`repeatText` 标题在过渡中途即可见
4. **`prefers-reduced-motion`**：shift 直接终态或跳过 pin
5. **命名空间**：延续 `.junni-*`，避免污染全局
6. **不要**把 `JunniWorks` 底部装饰性 `@keyframes` shift 误当成 About→Works 桥接

### 9.5 可选：独立组件

可新建 `JunniAboutWorksBridge.tsx`（或扩写 `JunniAbout.tsx`），职责：

- 渲染 4 条 `.shift-layer`
- 注册 About→Works 的 ScrollTrigger timeline
- cleanup 时 kill trigger

---

## 10. 视觉参考（对话截图）

过渡中途状态：

- 上方：荧光绿 About 背景 + 黑色日文文案
- 中间：4 条深色横带以不同进度 `scaleY` 展开（stagger 百叶窗）
- 后方：巨型空心描边「WORKS」字样（绿描边 on 绿底，深色条扫过后对比增强）
- 右侧：竖排 `© JUNNI Co., Ltd.` 版权

截图资产路径（工作区内）：`assets/c__Users_ifu.__AppData_Roaming_Cursor_User_workspaceStorage_.../image-bf4934c0-....png`

---

## 11. 新对话建议执行顺序

1. **接入编排**：`JunniTop.tsx` 增加 `<JunniWorks />`（及后续 Service 等按需）
2. **实现 `home_about_shift`**：About 末尾 4 条 + ScrollTrigger pin/scrub
3. **联调 About 文案 + Works 标题**：过渡中途描边字、z-index、绿/深底色衔接
4. **实测 pin 距离**：`start`/`end`、是否需 wrapper、与 Hero/About 滚动总高度
5. **降级**：`prefers-reduced-motion`
6. **（可选）** 将 `JunniService` shift 从 7 条改为 4 条以对齐原站
7. **（可选）** 区分 `JunniWorks` 底部 shift：保留装饰 vs 改为 Works→Service 滚动过渡

---

## 12. 关键文件索引

```
src/components/junni/
├─ JunniTop.tsx          # 编排器 — 待接 JunniWorks + About shift
├─ JunniHero.tsx         # ✅ home_kv 6×6 翻面
├─ JunniAbout.tsx        # ✅ 逐字显色 — 待加 shift 层 + ScrollTrigger
├─ JunniWorks.tsx        # ✅ home_works — 待接入 Top
├─ JunniWorks.css        # 描边标题 + 装饰 shift 条
├─ JunniService.tsx      # ✅ Service 进场擦除（7 条，IO 触发）
├─ junni.css             # Hero + About 样式
└─ junniData.ts          # 文案与常量

src/components/
├─ SmoothScroll.tsx      # Lenis 全局
└─ GunzeTransition.tsx   # 另一套 scrub 过渡 + 已挂 JunniWorks

docs/
├─ junni-hero-复刻交接.md
├─ junni-works-复刻交接.md
├─ junni-service-复刻交接.md
└─ junni-about-works-shift-交接.md   # 本文件
```

---

## 13. 构建与调试

- 构建：`npm run build`（Windows PowerShell 避免 `&&`，用 `;` 或分开执行）
- Lenis 样式：`src/index.css` 内 `.lenis` 相关规则
- 对照原站：DevTools 搜 `pin-spacer`、`shift_layer`、`scale(1, 0)`
- 原站 URL：https://junni.co.jp/

---

## 14. 对话中未决 / 待实测项

- [ ] About shift 的精确 `scrollTrigger.start` / `end`（原站 JS 在打包文件 `entry-hoisted.*.js` 内）
- [ ] pin 的是 `.home_about` 还是 about+works 包装器
- [ ] 过渡期间 `home_about` 的 `visibility: hidden` 触发时机
- [ ] `home_works_shift` 是否参与 Works→Service（与 About shift 是否同一套 scrub 时间轴）
- [ ] 顶层 `canvas#canvas` 与 `home_works_image` 的精确挂载关系（Works 文档椒4.0 已部分覆盖）

---

*文档结束。新对话请 @ 本文件并说明要从哪一步开始（例如：「先实现 JunniAbout shift + 接入 JunniTop」）。*
