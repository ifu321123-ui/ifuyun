# JUNNI SERVICE / PERFORMANCE 复刻 · 对话交接文档

> 用途：在新对话里继续调整 junni.co.jp `/service` 页 **PERFORMANCE 手风琴板块**（含 gooey 液态悬停 + 圆角方块光标）的复刻效果。把本文件作为上下文喂给新会话即可无缝接力。
> 最后更新：2026-06-16（手风琴 + 全屏出血暗面板 + 标题逐字描边 + 双层黑色 overlay 悬停 + 自定义圆角方块光标 均已落地，`npm run build` 通过）。

---

## 0. 一句话目标

1:1 复刻 [junni.co.jp/service](https://junni.co.jp/service/) 的 **PERFORMANCE** 区块：标题逐字描边入场 + 6 项服务手风琴（点击 `+` 展开深色面板、`+`→`×`、编号变黄绿），并还原 JUNNI 招牌的 **双层 overlay 悬停切换**（浅色层与黑色层重合，黑色层裁切展开）+ **圆角方块自定义光标**。

参考截图：默认态（浅灰底、描边 PERFORMANCE 标题、列表带 `+`）；展开态（整屏出血深炭灰面板、编号黄绿、`×`、左长文 + 右图）。

---

## 1. 技术栈与现状（已确认）

- 框架：**React 19 + Vite 8 + TypeScript**，Tailwind v4，已装 `gsap` / `lenis`
- 本板块**未用** GSAP，纯 React + 原生 CSS（自包含样式，不依赖 `.junni-root` 变量）
- 平滑滚动由 `src/components/SmoothScroll.tsx`（Lenis）在 `App` 外层统一包裹

---

## 2. 文件清单（已落地）

```
src/components/junni/
├─ JunniService.tsx     # ✅ 板块组件：标题逐字描边 + 手风琴 + 双层 overlay 行悬停 + 自定义光标
├─ JunniService.css     # ✅ 自包含样式（.junni-service__* 全套；不依赖 junni-root 变量）
└─ junniData.ts         # ✅ 新增 junniSolutions(01–06) + junniServiceTitle/Sub
```

改动过的既有文件：
- `src/components/junni/junniData.ts`：新增 `junniSolutions` 数组（01–06 中文文案 1:1）、`junniServiceTitle = "PERFORMANCE"`、`junniServiceSub = "我们的服务交付记录简介"`
- `src/components/GunzeTransition.tsx`：
  - 顶部 `import JunniService from "./junni/JunniService"`
  - 在 `<ProfileSwitcher />`（在校经历）**正上方**插入 `<JunniService />`

> **插入位置**：首页流 `Hero → BusinessIntro → GunzeTransition`（…message 区）→ **`<JunniService />`** → `<ProfileSwitcher />`（在校经历）→ `MovieSection` → `CeoSection`。
> 即 PERFORMANCE 板块就在「在校经历」板块的上方。`GunzeTransition` 被 `src/components/Hero.tsx` 使用。

构建状态：`npm run build` 通过（Windows PowerShell 不支持 `&&`，命令分开写或用 `;`）。

---

## 3. DOM / 组件结构（`JunniService.tsx`）

```
section.junni-service[data-cursor="custom"]        # 浅灰底；进入后 IntersectionObserver 加 .is-in
 ├ svg.junni-service__goo-defs > filter#junniGoo    # gooey 滤镜定义（隐藏）
 ├ div.junni-service__cursor[data-visible][data-hover]  # 自定义圆角方块光标（position:fixed）
 ├ div.junni-service__head
 │   ├ h2.junni-service__title > span.junni-service__title-char × N（描边 + transition-delay 入场）
 │   └ p.junni-service__sub
 ├ ul.junni-service__list                           # width: min(92vw, 1180px) 居中
 │   └ li.junni-service__item[data-open]            # isolation:isolate；::before 做全屏出血暗背景
 │       ├ button.junni-service__row                # grid: [num] [block] [toggle]；overflow:hidden
│       │   ├ span.junni-service__row-layer[data-hover="before"] > __row-inner
│       │   │   └ num + block(name/detail) + toggle  # 默认浅色层
│       │   └ span.junni-service__row-layer[data-hover="after"] > __row-inner
│       │       └ num + block(name/detail) + toggle  # 绝对定位黑色层，clip-path 展开
 │       └ div.junni-service__panel > __panel-inner  # grid-rows 0fr→1fr 平滑展开
 │             ├ p.junni-service__text               # 长文（左缘对齐 name）
 │             └ div.junni-service__image > img      # 右侧居中横图（4/3，留白）
 └ div.junni-service__shift > span.__shift-layer × 7 # 进场竖向擦除（scaleY 1→0）
```

数据来源：`junniSolutions`（`{ num, name, detail, text, image, alt }` × 6）。

---

## 4. 三大机制原理（原站拆解 + 本站实现）

原站这块叠了三套独立机制，本站对应实现如下：

### 4.1 手风琴（核心，可见的 `+` → `×`）
- 每个 `<li data-open>`：头部行（编号 + 名称 + 短描述 + 切换钮）+ 隐藏的 `.junni-service__panel`（长文 + 图）。
- React `useState<Set<number>>` 记录展开项，**逐项独立展开**（对齐原站每个 `<li>` 各自的 `data-open`）。
  - 若要改成「同时只开一项」：把 `toggle` 换成 `setOpen(new Set(prev.has(i) ? [] : [i]))`。
- 平滑高度：`.junni-service__panel { grid-template-rows: 0fr }` → open 时 `1fr`（现代 CSS 高度过渡，无需测量 JS）。
- `+`→`×`：`.junni-service__toggle` 两条伪元素线，open 时整体 `transform: rotate(45deg)` + 变绿。
- 展开视觉：整行变深色 + 编号变 `--svc-green` + 文字白 + 长文/图显现。

### 4.2 暗面板「整屏左右出血」（曾踩坑，已修）
- ❌ 初版：深色背景画在 `.junni-service__item` 上，只到列表容器宽（92vw），两侧有留白，**与原站不符**。
- ✅ 修正：用 `.junni-service__item::before { position:absolute; left:50%; width:100vw; margin-left:-50vw; z-index:-1 }` + `.junni-service__item { isolation:isolate }`，展开时 `opacity:0→1`，深色背景**整屏 edge-to-edge**；而**内容/分隔线仍居中对齐容器**（列表 `min(92vw,1180px)` 居中，item 中心 = 视口中心，故 `100vw` 恰为满屏）。
- section 有 `overflow:hidden`，`100vw` 含滚动条造成的微溢出被裁掉，无横向滚动。

### 4.3 双层 overlay 悬停 + 圆角方块光标（JUNNI 招牌）
- **双层结构**：每个 button 内有两套完全重合的 `.junni-service__row-layer`。`data-hover="before"` 是默认浅色层；`data-hover="after"` 是绝对定位黑色层，内部内容同构，编号和 `+` 使用黄绿色。
- **覆盖层展开**：`after` 层用 `position:absolute; left:50%; width:100vw; margin-left:-50vw` 做整屏出血，默认 `clip-path: inset(100% 0 0 0)` 隐藏，悬停或展开时切到 `clip-path: inset(0)`。这样背景、编号、标题、说明和 `+` 是作为一整层一起切换，而不是单独给底色染色。
- **goo 滤镜**：内联 `<filter id="junniGoo">` 先保留，但当前不再作用到文字所在层；若继续追原站的粘性边沿，应只把滤镜挂在独立 mask/blob 图层上，避免文字被模糊。
- **自定义光标**：`.junni-service__cursor`（`position:fixed`），`requestAnimationFrame` + **lerp(0.2)** 缓动跟随。
  - 静止态 = 圆角方块**描边**（对应截图标题旁那个方块）。
  - 悬停行（`data-hover="true"`）= 放大成**实心黄圆角块** + `mix-blend-mode:multiply`。
  - 仅 `hover:hover && pointer:fine && !prefers-reduced-motion` 启用；启用时 section 内 `cursor:none` 隐藏原生光标。`data-visible` 控制进入/离开淡入淡出。

### 4.4 进场（标题 + 列表 + 擦除层）
- `IntersectionObserver`（阈值 0.2）给 section 加 `.is-in`。
- 标题 `.junni-service__title-char`：初始 `opacity:0 + translateY(.4em) + 描边`，`.is-in` 后逐字（内联 `transition-delay: i*0.03s`）浮现。
- 列表项：`.is-in` 后逐项（内联 `transition-delay: 0.06*i`）淡入上移。
- `.junni-service__shift`：7 条竖条 `scaleY(1)→scaleY(0)`（错峰），做擦除揭示（氛围层，可删）。

---

## 5. 关键样式度量（`JunniService.css` 顶部变量）

| 变量 | 值 | 作用 |
|---|---|---|
| `--svc-bg` | `#f7f7f7` | 板块浅灰底 |
| `--svc-ink` | `#111111` | 默认墨黑文字 / 描边 |
| `--svc-dark` | `#212121` | 展开暗面板底色 |
| `--svc-green` | `#cbea41` | 编号高亮 / 液体 / 光标黄绿 |
| `--svc-line` | `rgba(17,17,17,.14)` | 行分隔线 |
| `--svc-ease` | `cubic-bezier(0.16,1,0.3,1)` | 统一缓动 |
| `--svc-pad` | `clamp(1rem,3vw,2.5rem)` | 行左右内边距 |
| `--svc-num-w` | `clamp(3rem,7vw,5.25rem)` | 编号列宽 |
| `--svc-col-gap` | `clamp(1rem,3vw,2.5rem)` | 列间距 |

> **正文对齐 name 的公式**：`.junni-service__panel-inner` 左 padding = `calc(--svc-pad + --svc-num-w + --svc-col-gap)`，让长文左缘精确落在「名称」下方（不顶到编号）。

---

## 6. 图片接法（当前 = 占位，待替换）

- 当前接 repo 现成的 `public/works/shiyuan/01.png ~ 06.png`（**竖版海报**），在 `.junni-service__image` 的 `aspect-ratio:4/3` 框里 `object-fit:cover` 会被裁切。
- 原站是横向画廊照。换图只改 `junniData.ts` 里每项的 `image` 路径即可（建议放 `public/assets/images/service/solution/0X.png` 或任意横版图），布局已按原站比例（居中横图 + 留白）摆好。

---

## 7. 调参速查

- **液体黏稠度** → `<filter id="junniGoo">` 的 `stdDeviation`（现 9，越大越黏）与 `feColorMatrix` 末行 `20 -10`（对比/缩边）。
- **流入速度/方向** → `.junni-service__fill i:nth-child(n)` 的 `transition-delay`（现 0→0.18s）与 `scale(2.4)`、`transition` 时长（现 0.5s）。
- **光标缓动/拖尾** → 组件内 lerp 系数 `0.2`（越小越"懒"、拖尾越长）。
- **光标尺寸/圆角** → `.junni-service__cursor` 的 `width/height/border-radius`；悬停态在 `[data-hover="true"]`。
- **展开速度** → `.junni-service__panel { transition: grid-template-rows .55s }`。
- **整屏出血范围** → `.junni-service__item::before` 的 `width:100vw`（如有外层 padding 偏移再校正）。

---

## 8. 已知残留 / 待办

- [ ] **图片换原站横版图**（现为竖版 shiyuan 占位，4/3 裁切）。
- [ ] **名称字体**：原站「Virtual Gallery」是偏重的几何无衬线，本站用 Inter Bold，字形略有差异；如需极致可引入更接近的字体。
- [ ] （可选）**overlay 边缘 gooey 化**：当前已改为双层黑色 overlay，goo 滤镜尚未接到覆盖层边缘。若要 1:1，应新增独立 mask/blob 图层承载黑色边沿，文字保持在干净图层。
- [ ] （可选）FAQ / BUSINESS FIELD 等 `/service` 页其余区块。

---

## 9. 新对话快速启动指令（复制即用）

> 继续 junni.co.jp `/service` 页 PERFORMANCE 板块复刻。已读 `docs/junni-service-复刻交接.md`。板块（标题逐字描边 + 手风琴 + 全屏出血暗面板 + gooey 液态悬停 + 圆角方块光标）已落地并 `npm run build` 通过，文件见第 2 节、结构见第 3 节、机制见第 4 节、调参见第 7 节。下一步请处理第 8 节待办（优先换原站横版图 / 字体微调）。改动后务必 `npm run build` 验证。
