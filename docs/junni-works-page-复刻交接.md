# JUNNI /works/ 作品集页复刻 · 对话交接文档

> 用途：在新对话里继续 1:1 复刻 [junni.co.jp/works/](https://junni.co.jp/works/) **独立作品集列表页**，并精调视觉效果与动效。把本文件喂给新会话即可无缝接力。
>
> 来源：2026-06-17 多轮对话整理（原站 HTML 实锤、截图对比、首版实现、结构纠偏、CSS/路由修复、**§17 Drumroll 间隙/滚筒**、**§18 圆筒尺寸 1:1 对齐**）。
>
> 关联文档：[junni-works-复刻交接.md](./junni-works-复刻交接.md)（首页 `home_works`，**不是本页**）、[junni-about-works-shift-交接.md](./junni-about-works-shift-交接.md)、[junni-hero-复刻交接.md](./junni-hero-复刻交接.md)

---

## 0. 一句话目标

1:1 复刻 junni.co.jp **`/works/` 作品集列表页**（非首页 `home_works`）：`OUR WORKS` 页头 → 介绍区（两侧无限滚动装饰图）→ **Drumroll / List 双视图** → 分页 → 荧光绿 Footer；接入本站导航 **「作品集」**，路由 `#/portfolio`。

---

## 1. 极易混淆：本页 vs 首页 home_works

| | **本任务：`/works/` 列表页** | **另一文档：`home_works` 首页区块** |
|---|---|---|
| 原站 URL | `https://junni.co.jp/works/` | `https://junni.co.jp/` 滚动中段 |
| 原站类名 | `works_about`、`works_drumroll`、`works_list` | `home_works`、`home_works_wrap` |
| 本站组件 | `src/components/junni/works-page/*` | `JunniWorks.tsx`（椒4.0） |
| 驱动方式 | **§17：连续滚轮 `activeFloat`** + sticky；Toggle 切 List | ScrollTrigger pin + scrub 滚动 |
| 作品数量 | 12 项/页 × 3 页 | 6 项 + and_more |

**新对话务必先确认用户要改的是「作品集导航页」还是「首页 WORKS 轮播」。**

---

## 2. 原站页面结构（用户粘贴 HTML 实锤 · 2026-06-17）

> 早期分析曾把 `works_drumroll` 与 `works_list` 当成 `main` 下并列兄弟节点，**这是错的**。用户后续粘贴了原站真实 HTML，以下结构为准。

### 2.1 正确 DOM 区块（自上而下）

```
body[data-namespace=works]
├─ .menu                          # 右上 MENU（全屏导航，非 sticky 大 Logo）
├─ .pageHead                      # 「OUR WORKS」逐字动画
├─ .works_container
│  ├─ .works_about                # 介绍文案 + 两侧 .works_about_slider
│  └─ .works_list                 # ★ 单一父容器，data-type=drumroll|list
│     ├─ .works_list_inner       # 网格列表（list 模式）
│     ├─ .works_drumroll         # ★ 嵌套在 works_list 内，非兄弟节点
│     │   ├─ .works_drumroll_image   # WebGL 中央曲面图（全局 canvas 模式）
│     │   └─ .works_drumroll_list    # DOM 3D 标题（perspective:500px）
│     └─ .works_pagination       # 1 2 3 + 箭头（仅 list 模式）
├─ .toggle[data-visible=false]    # 底部固定；滚入 works 区域后才显示
├─ .copyright                     # 右侧竖排版权
└─ .footer                        # 正常文档流；menu + logo + pageTop，非 sticky 巨型文字
```

### 2.2 双视图切换机制

- 父容器 `.works_list` 上 `data-type="drumroll"`（默认）或 `data-type="list"`
- `[data-type=drumroll]` → 显示 `.works_drumroll`，隐藏 `.works_list_inner` + `.works_pagination`
- `[data-type=list]` → 显示 `.works_list_inner` + `.works_pagination`，隐藏 `.works_drumroll`
- `.toggle_checkbox` 控制 `data-type`；荧光绿滑块 `::before` 左右滑动
- `.toggle` 初始 `data-visible="false"`，IntersectionObserver 滚入 works 区域后变为 `true`

### 2.3 原站技术栈

| 技术 | 用途 |
|------|------|
| Astro | 页面框架 |
| Lenis | 平滑滚动 |
| GSAP | 部分动效（页头、过渡） |
| Three.js | `works_drumroll_image` 曲面图 |
| Swup | 站内路由过渡（`data-transition=works` fade） |
| 字体 | `junni.ttf`（页头/分页）、`Montserrat`（标题）、`ryo-gothic-plusn`（日文正文） |

### 2.4 设计 Token（原站实测）

```css
--bg-dark:      #1c1d21;   /* body / pageHead */
--bg-about:     #111111;   /* works_about */
--accent-green: #dcff46;   /* 分页激活 / toggle / footer */
--text-white:   #f7f7f7;   /* 页头、list 标题、about 逐字正文 */
--text-muted:   #777777;   /* list 描述 */
--text-ghost:   #262626;   /* drumroll 非当前项标题 */
```

> **注意**：早期 CSS 抓取里 about 正文曾标为 `#2f3032`，但用户粘贴的原站 HTML 中 about 文案是**逐字 span**，computed color 为 `rgb(247,247,247)`（`#f7f7f7`），与页头白字一致。本站已按 `#f7f7f7` 实现。

### 2.5 关键动画与交互

| 区块 | 实现 |
|------|------|
| `pageHead_title_char` | `@keyframes page-title-anime`：translateY(70px) scale(.6,1.4) → 正常，1s，stagger 30ms |
| `works_about_slider` | `rotate(15deg)` + `@keyframes slider` 20s linear infinite（左右反向）；桌面 **3 列** `slider_list`，移动端 `data-media` 切换为单列 |
| `works_drumroll` | 25° 间隔、`perspective:500px`、WebGL 曲面；非当前项 `data-item-visible="false"` + 激进 opacity/visibility 隐藏 |
| `works_drumroll_nav` | 滚筒列表内额外一项：PREV / NEXT 翻页按钮 |
| 副标题 | `works_*_desc_char` + `--transition-delay` 递增 0.03s |
| Footer | 左上大圆角 `border-radius: 100px 0 0`；**非** sticky 巨型 Logo 挡在页面中段 |

### 2.6 z-index 层级（原站）

- `.works_about`：`z-index: 3`（文案在上）
- about 两侧 slider：在文案下方（`z-index: 0` 级）
- `.works_drumroll` / `.works_list`：`z-index: 1~2`

### 2.7 第 1 页 12 个作品 slug（原站）

`basica` · `alche-studio` · `2nd-star-production` · `opb_app` · `master-expo` · `pokeca-event` · `hugs_breed` · `tensura-nazuke` · `playyte` · `honey` · `reml` · `nko-jishaku2023`

装饰图：`/assets/images/works/about/works-image01.png` ~ `16.png`

---

## 3. 对话中发现的主要问题（首版 vs 原站）

用户提供了**实现截图 vs 原站截图**对比，并粘贴原站 HTML，归纳出以下核心偏差：

| # | 问题 | 原因 | 状态 |
|---|------|------|------|
| 1 | Drumroll 与 List 是兄弟节点 | DOM 嵌套错误 | ✅ 已改为 `works-list` 父容器内嵌套 |
| 2 | About 文案偏灰、不清晰 | 误用 `#2f3032` | ✅ 已改为 `#f7f7f7` 逐字 span |
| 3 | About 两侧跑马灯太单薄 | 仅左右各 1 列 | ✅ 桌面 3 列 + 移动 1 列 |
| 4 | Drumroll 12 项全可读、杂乱 | 缺少 visibility 裁剪 | ✅ `VISIBLE_THETA_DEG=52` + `data-visible` |
| 5 | 缺少 PREV/NEXT | 未实现 nav 项 | ✅ `jwp__drumroll-item--nav` |
| 6 | 页面中段出现绿色大块 | Footer `position:sticky` + 巨型 IFUYUN | ✅ 改为正常流 + 合理 logo 尺寸 |
| 7 | 顶部双导航（Navbar + 原站 MENU） | 全局 Navbar 未隐藏 | ✅ portfolio 页隐藏 Navbar / QuickActions |
| 8 | Toggle 一直显示 | 未做 IntersectionObserver | ✅ `data-visible` 联动 |
| 9 | Drumroll 圆筒与图片整体偏小 | §17 `PANEL_DEG=19°` 缩面换缝；缺原站 16:9 视窗 | ✅ §18：`PANEL_DEG=51.1` + `computeDrumRadius` + viewport |
| 10 | 圆筒各图大小不齐 | 按原图比例动态 `axial` | ✅ §16 cover；§18 统一 `16/9` 视窗 |

---

## 4. 本站当前实现（2026-06-17 §18 圆筒尺寸对齐后）

### 4.1 路由与导航

| 项 | 值 |
|----|-----|
| 路由 | `#/portfolio` |
| `PageId` | `"portfolio"`（`src/hooks/useRoute.ts`） |
| 导航文案 | **作品集**（`src/data.ts` → `notebookNav`） |
| 渲染入口 | `App.tsx` → `case "portfolio": return <JunniWorksPage />` |
| 页面背景 | `bg-[#1c1d21]` |
| 全局 UI | `Navbar hidden={... \|\| isPortfolio}`；`QuickActions` / `IntroFlip` 在 portfolio 不渲染 |

### 4.2 文件清单

```
src/components/junni/works-page/
├─ JunniWorksPage.tsx        # 页面编排（已按原站嵌套结构重写）
├─ JunniWorksPage.css        # 样式前缀 jwp__（已按新 DOM 重写）
├─ JunniWorksDrumroll.tsx    # WebGL 曲面 + DOM 3D 文字 + PREV/NEXT
└─ junniWorksPageData.ts     # 介绍文案、about 图路径、12×3 页作品数据

public/works/junni/about/
└─ works-image01.png ~ works-image16.png   # 已从原站下载

src/hooks/useRoute.ts        # portfolio 路由
src/data.ts                  # notebookNav「作品集」
src/components/Navbar.tsx    # portfolio 路由映射
src/App.tsx                  # 挂载 JunniWorksPage + 隐藏全局 UI
index.html                   # Noto Sans JP 字体
vite.config.ts               # server.watch.ignored: .tmp*（防 Windows EBUSY 崩服）
.gitignore                   # .tmp*
```

### 4.3 本站 DOM 架构（对齐原站嵌套）

```
div.jwp[data-view=drumroll|list][data-transitioned][data-pagehead]
├─ header.jwp__head                    # OUR WORKS 逐字弹入
├─ div.jwp__works-container
│  ├─ section.jwp__about               # 日文介绍 + 左右 AboutSlider
│  │   ├─ AboutSliderDesktop (3列×左右)
│  │   ├─ AboutSliderMobile (1列×左右)
│  │   └─ p.jwp__about-text > span.jwp__about-char（逐字白字）
│  └─ div.jwp__works-list[data-type]   # ★ 对应原站 .works_list
│     ├─ div.jwp__list-inner           # 2/3 列 grid（list 模式）
│     ├─ section.jwp__drumroll         # ★ 嵌套在内
│     │   └─ JunniWorksDrumroll
│     │       ├─ .jwp__drumroll-wrap（sticky · min(50vw,100vh)）
│     │       ├─ .jwp__drumroll-viewport（min(90vw,900px) · 16:9 · overflow:hidden）
│     │       ├─ canvas.jwp__drumroll-canvas
│     │       └─ .jwp__drumroll-slider > .jwp__drumroll-list（DOM 3D 标题）
│     └─ nav.jwp__pagination           # 仅 list 模式
├─ div.jwp__toggle[data-visible]       # button[data-type] 切 drumroll ↔ list
├─ aside.jwp__copyright
└─ footer.jwp__footer                  # menu + IFUYUN + pageTop
```

### 4.4 JunniWorksDrumroll 要点（**§18 已更新尺寸体系**）

| 项 | 实现 |
|----|------|
| 几何常量 | **`STEP_DEG=25`**、`PERSPECTIVE=500`、**`PANEL_DEG=51.1`**（与首页 `JunniWorks.tsx` 同量级；§17 曾临时改为 `19°` 已回退，见 §18） |
| **面板视窗** | 对齐原站 `.works_drumroll_image`：**`min(90vw, 900px)` × `aspect-ratio: 16/9`**；`computePanelBox()` / `computeDrumRadius()` 反推圆筒半径 |
| **面板比例** | **`PANEL_ASPECT = 16/9`** + `fitTextureCover()` 居中 cover 裁切（§16 曾用 `2.65`，§18 改为原站 16:9） |
| **面板间隙** | §18 恢复 `PANEL_DEG=51.1 > STEP_DEG` → 几何重叠（与首页一致）；原站缝隙主要来自**纹理内多图拼条**，非缩小 `PANEL_DEG` |
| 可见性裁剪 | `VISIBLE_THETA_DEG=58`；`PANEL_FADE_DEG=18`、`PANEL_VISIBLE_DEG=58`（对齐首页椒4.0） |
| 滚轮驱动 | **§17：连续 `activeFloat`**（`sensitivity=0.0032`）+ sticky 区间 + 首尾橡皮筋；见 §15 / §17 |
| 运动平滑 | `targetActiveRef` / `smoothActiveRef` 自适应阻尼；渲染时 `target` clamp 到 `[0, n−1]` |
| PREV/NEXT | 列表末尾 `jwp__drumroll-item--nav`，按 `page`/`totalPages` 条件渲染 |
| 链接 | 作品项用 `<a href="#work/{slug}">` |
| WebGL | canvas 置于 `.jwp__drumroll-viewport` 内裁剪；`setClearColor(0,0)` 透明；`IntersectionObserver` 进入视口才 `requestAnimationFrame` |

### 4.5 数据与素材现状

- 介绍文案：原站日文 `WORKS_PAGE_ABOUT_TEXT`（数组 10 行）；当前 TSX 用 `join("")` 合并为连续文本，**未保留 `<br>` 换行**
- About 图：16 张 PNG 在 `public/works/junni/about/`
- **页 1（12 项）**：`image` 已全部替换为原站 `microcms-assets.io` 真实 URL（见 §15.4）
- **页 2（12 项）**：文案 / slug / **缩略图均已对齐**（§17 从各详情页抓取 `microcms` URL）
- **页 3（2 项）**：文案 / slug / **缩略图均已对齐**（§17）
- **slug 备注**：`vi-ta` 原站详情页路径为 `/works/vita/`（slug 字段仍用 `vi-ta`）；`at-aroma` 原站详情页 `/works/aroma/` 不存在直链 `at-aroma`，缩略图用 `aroma02.png`

### 4.6 构建与访问

```bash
npm run dev      # http://localhost:5173/#/portfolio
npm run build    # 已通过（2026-06-17 §18 圆筒尺寸对齐后）
```

**PowerShell 不支持 `&&`，命令用 `;` 或分开执行。**

---

## 5. 已知问题与已修复

### 5.1 Dev server 崩溃

- **现象**：访问 `http://localhost:5173/#/portfolio` 无法连接
- **原因**：抓取原站 HTML 时留下 `.tmp-works.html`，Windows 上 Vite watch 报 `EBUSY`，进程退出
- **修复**：删除 `.tmp*`；`vite.config.ts` 增加 `server.watch.ignored`；`.gitignore` 加 `.tmp*`

### 5.2 Tailwind v4 CSS 构建失败

- **现象**：`npm run build` 报 `CssSyntaxError: Invalid declaration`
- **原因**：`JunniWorksPage.css` 中 `transition` 写法为原站风格（`0.3s opacity`），Tailwind v4 解析器不接受
- **修复**：改为标准语法，例如 `transition: opacity 0.3s, visibility 0.3s`

### 5.3 首屏可能偏暗

- 各区块依赖 `data-transitioned="true"` 才 `opacity:1`
- 已用 `requestAnimationFrame` 尽快设 `ready` / `pageHead`
- 若仍觉偏暗，可减少入场 opacity 依赖或缩短 delay

### 5.4 TypeScript：`FOOTER_LINKS` 的 `active` 字段

- 仅 `portfolio` 项有 `active: true`，已显式类型 `{ active?: boolean }[]`

---

## 6. 与原站差距（待新对话精调）★

按优先级排列；已完成项已标注 ✅。

### P0 — 视觉 / 交互核心

- [x] DOM 嵌套：`works_drumroll` 在 `works_list` 内
- [x] About 文案白色逐字
- [x] Drumroll 项可见性裁剪
- [x] Drumroll PREV/NEXT 导航项
- [x] Footer 去掉 sticky 巨型 Logo
- [x] portfolio 页隐藏本站 Navbar / QuickActions
- [x] **Drumroll 驱动手感**：§17 已改为连续 `activeFloat` 滚轮驱动 + 阻尼；仍待对照原站录屏微调 `sensitivity` / 边界橡皮筋
- [x] **Toggle 图标**：已切到 PNG；本地路径 `public/assets/images/works/toggle/list.png`、`public/assets/images/works/toggle/drumroll.png`
- [x] **Drumroll 圆筒图片统一尺寸**：`PANEL_ASPECT=16/9` + `fitTextureCover`（§18）；各图 cover 进统一 16:9 视窗
- [x] **Drumroll 圆筒整体尺寸 1:1**：§18 恢复原站 `min(90vw,900px)` 容器 + `PANEL_DEG=51.1`；本地 viewport 实测 **900×506px @ 1440×900**
- [x] **Drumroll 面板间隙 + 滚筒离散感**：§17 曾用 `PANEL_GAP_DEG=6` / `PANEL_DEG=19` 换缝隙，§18 为尺寸回退重叠方案；**缝隙感待精调**（见 §18.6）
- [x] **List / Drumroll 缩略图**：三页均已用原站 `microcms` URL（§17）
- [ ] **Drumroll 缝隙 vs 尺寸平衡**：§18 优先尺寸后角向缝变弱；可选纹理拼条或小幅减 `PANEL_DEG`
- [ ] **Drumroll scrim / 亮度**：`mat.color.setScalar(b)`、`.jwp__drumroll-scrim` 待并排截图
- [ ] **页头字体**：原站 `junni.ttf`，本站用 Montserrat 800 替代

### P1 — 布局 / 细节

- [x] About 两侧 slider 桌面 3 列 + 移动 1 列（简化版，未完全复刻原站 `data-media` 断点矩阵）
- [ ] **About 文案换行**：原站按行 / `data-media` 控制 `<br>`；本站 `join("")` 成一段
- [ ] **右上角 MENU**：原站 `.menu` 全屏导航；本站仅隐藏 Navbar，**未做原站 MENU**
- [ ] **Footer 完整版**：原站 noise 纹理 + 社交链接（X/Facebook/Instagram/note）+ SVG Logo
- [ ] **Copyright 文案**：本站为本地化 `IFU.YUN · Inspired by JUNNI`
- [ ] **分页路由**：原站 `/works/page/2` 真实 URL；本站为组件内 `useState(page)`
- [ ] **List 图 `background-size`**：已改 `cover`，需对照原站 hover / 圆角细节

### P2 — 高级 / 可选

- [ ] **Gooey 金属光标**（`circleCursor` + 全站 WebGL canvas）
- [ ] **Swup 页面过渡**（`data-transition=works` fade）
- [ ] **全局 canvas WebGL**：原站 `works_drumroll_image` 可能与首页共用顶层 canvas
- [ ] **抽取共享 drumroll hook**：与 `JunniWorks.tsx` 合并，避免两套 Three.js 逻辑分叉
- [ ] **`React.lazy` 代码分割**：降低首屏 bundle（three.js 使 chunk >500kB）
- [ ] **移动端断点**：原站 `<950px` / `<769px` 多处 media query 需逐段对照
- [ ] **Lenis 与 drumroll wheel 冲突**：portfolio 页滚轮在 drumroll 内被 `preventDefault`，需验证页面其余区域滚动是否正常

### P3 — 内容本地化（产品决策）

- [ ] 介绍文案改中文或保留日文
- [ ] 作品数据改为用户自己的项目（替换 `junniWorksPageData.ts`）
- [ ] Footer 品牌保持 IFUYUN 还是改回 JUNNI 致敬风格

---

## 7. 1:1 可行性结论（对话共识）

- **结构 / 布局**：纠偏后可达 **90–95%**（嵌套、z-index、双视图切换已对齐）
- **动效**：可达 **85–90%**（Drumroll 几何可复用椒4.0；驱动方式、惯性、全局 canvas 待补）
- **字体 / 素材**：`ryo-gothic-plusn` → `Noto Sans JP`；`junni.ttf` 需下载或近似替代
- **全局 chrome**：原站仅 `.menu`；本站已隐藏 Navbar，但尚未实现原站 MENU 交互

---

## 8. 推荐新对话执行顺序

1. **浏览器对照**：`#/portfolio` vs `junni.co.jp/works/`，截图列剩余差异清单（**主线：§18 尺寸验收 → 缝隙 / 滚筒手感 / scrim**，见 §18.6）
2. **Drumroll 缝隙精调**：在保持 §18 尺寸前提下，评估纹理拼条 vs 小幅 `PANEL_DEG` 缩减（勿回到 `19°`）
3. **Drumroll 手感**：`sensitivity`、阻尼系数、首尾橡皮筋 vs 原站录屏
4. **圆筒亮度 / scrim**：`PANEL_FADE_DEG`、`mat.color.setScalar(b)`、`.jwp__drumroll-scrim`
5. **About 文案换行** + slider `data-media` 断点精细对照
6. **Toggle + 分页** 视觉 1:1（PNG 图标、间距、hover）
7. **List 网格** 三列间距、标题字号、hover 色
8. **Footer** noise 纹理 + 社交区 + SVG Logo
9. **右上角 MENU**（或确认继续沿用隐藏 Navbar 的简化方案）
10. **替换作品数据与图片**（若改为用户自有项目）
11. **（可选）** 抽取 `useJunniDrumroll` 与首页共用（§18 后本页与首页 `PANEL_DEG` 均为 `51.1°`，可评估共用；本页另有 `computeDrumRadius` + viewport 裁剪）

---

## 9. 调试备忘

| 项 | 值 |
|----|-----|
| 本地 | `http://localhost:5173/#/portfolio` |
| 原站 | `https://junni.co.jp/works/` |
| 原站 CSS | `/assets/styles/works.BaiBovEG.css`、`about.D9JEN3nr.css` |
| MCP | `cursor-ide-browser`（截图 / CDP 对照） |
| CSS 注意 | 本项目 Tailwind v4 会解析所有 import 的 CSS，`transition` 必须用标准 `property duration` 顺序 |
| Windows | **勿在项目根目录留 `.tmp-*` 文件**，否则 Vite 可能 EBUSY 崩溃 |

### 关键选择器对照（原站 → 本站）

| 原站 | 本站 |
|------|------|
| `.works_list[data-type]` | `.jwp__works-list[data-type]` + `.jwp[data-view]` |
| `.works_list_inner` | `.jwp__list-inner` |
| `.works_drumroll` | `.jwp__drumroll` |
| `.works_about_slider` | `.jwp__about-slider` |
| `.toggle[data-visible]` | `.jwp__toggle[data-visible]` |
| `.works_drumroll_nav` | `.jwp__drumroll-nav` |

---

## 10. 对话时间线摘要

| 阶段 | 内容 |
|------|------|
| 首版搭建 | 路由 `#/portfolio`、`JunniWorksPage` 四文件、about 图下载、`npm run build` 通过 |
| 视觉对比 | 用户提供截图；发现 DOM 嵌套、颜色、Footer、Navbar 等多处偏差 |
| HTML 实锤 | 用户粘贴原站 HTML；确认 `works_drumroll` 嵌套在 `works_list` 内；about 文字为 `#f7f7f7` |
| 结构纠偏 | 重写 `JunniWorksPage.tsx`、`JunniWorksDrumroll.tsx`；重写 `JunniWorksPage.css`；`App.tsx` 隐藏全局 UI |
| 构建修复 | 修正 CSS `transition` 语法；`npm run build` 再次通过 |
| Toggle 对齐 | 按用户提供原站片段改为 `button.toggle_checkbox + data-type`，并将 `list.png/drumroll.png` 下载到本地路径 |
| 访问排查 | 用户反馈无法访问页面；确认并重启 dev server，当前地址 `http://localhost:5173/#/portfolio` 可用 |
| 文档整理 | 本文件更新，供后续对话接力 |
| 圆筒图片尺寸 | 用户截图对比发现 Drumroll 图片大小不齐；固定面板比例 + cover 裁切（§16） |
| 分页数据 | 页 2/3 文案与 slug 对齐原站；缩略图抓取未完成 |
| Drumroll 间隙/滚筒 | 用户截图对比：原站有面板缝+连续滚动感，本站像连续曲面；§17 落地 `PANEL_GAP_DEG`、连续滚轮、页 2/3 缩略图 |
| **圆筒整体尺寸偏小** | 用户截图：原站 &honey 等大圆筒 vs 本站明显缩小；§18 抓取原站 CSS/CDP，`PANEL_DEG` 回 51.1°、16:9 viewport、`computeDrumRadius` |

---

## 11. 新对话快速启动指令（复制即用）

> 继续 junni.co.jp **`/works/` 作品集页**复刻（非首页 home_works）。已读 `docs/junni-works-page-复刻交接.md` **§18**（尺寸）+ **§17**（滚筒/滚轮）。
>
> **现状**：`#/portfolio` → `JunniWorksPage`。Drumroll：**§18 圆筒尺寸对齐原站**（`min(90vw,900px)` 16:9 viewport、`PANEL_DEG=51.1`、`computeDrumRadius`）；§17 连续滚轮 `activeFloat` + 页 1/2/3 原站 `microcms` 缩略图。`npm run build` 通过。
>
> **请先**对照原站 `junni.co.jp/works/` 并排截图，从【用户指定差异点】继续精调。主线建议：① §18 尺寸验收；② 缝隙感（纹理拼条 / 小幅减 `PANEL_DEG`）；③ 滚轮 `sensitivity` / 阻尼；④ scrim / 亮度。待办见第 6 节与 §18.6。

---

## 12. 本轮新增（2026-06-17 下午）

### 12.1 用户反馈与结论（Toggle）

- 用户明确指出：目标效果是 **Toggle 在可见区间内持续 fixed 悬浮**（滚轮滚动时位置不变）。
- 用户提供了原站 Toggle HTML/CSS 片段，关键点：
  - `button.toggle_checkbox`（不是 input checkbox）
  - `data-type="list|drumroll"` 驱动状态
  - 图标为 PNG（`list.png`、`drumroll.png`）
  - 固定定位参数：`left:50%`、`bottom:100px`、`width:160px`、`z-index:4`、`transition:.25s`

### 12.2 代码已落地的调整

- `src/components/junni/works-page/JunniWorksPage.tsx`
  - Toggle 结构由 `input[type=checkbox]` 改为 `button.jwp__toggle-checkbox`。
  - 使用 `data-type={view}` 表达当前视图，点击按钮切换 `list/drumroll`。
  - Toggle 图标从内联 SVG 改为 `<img>`：
    - `/assets/images/works/toggle/list.png`
    - `/assets/images/works/toggle/drumroll.png`
- `src/components/junni/works-page/JunniWorksPage.css`
  - 对齐原站关键参数：`position: fixed`、`left:50%`、`bottom:100px`、`width:160px`、`z-index:4`、`font-size:160px`、`transition:.25s`。
  - 滑块位移由 `:checked` 改为 `[data-type="list"]` 驱动。

### 12.3 新增资源

- 已从原站下载到本地：
  - `public/assets/images/works/toggle/list.png`
  - `public/assets/images/works/toggle/drumroll.png`

### 12.4 本地运行状态（最新）

- 先前出现“无法访问网页”反馈，排查后为 dev server 状态异常/未稳定监听。
- 已重启后恢复可访问：
  - `http://localhost:5173/#/portfolio`

### 12.5 下一轮建议优先项

1. 用原站截图逐帧核对 Toggle 的显示区间（何时出现/何时消失），避免“固定 vs 区间隐藏”理解偏差。
2. 继续对齐 Toggle 细节：黑底胶囊高度、圆点大小、两图标间距、hover/active 反馈。
3. 回到主线：Drumroll 手感与 List/分页的原站过渡节奏。

---

## 13. 本轮新增（2026-06-17 16:30，围绕 Toggle 位置持续修复）

> 本节补齐“你根本没改 / 位置还不对 / 你查呀”这几轮之后的真实结论与代码落地状态，供后续会话直接续接。

### 13.1 用户最新明确诉求

- 不接受“看起来差不多”，要求 **严格按原站位置与行为**。
- 重点是 Toggle：
  - 出现在 works 区域时固定悬浮；
  - 不能压在荧光绿 footer 上；
  - list 模式下视觉上应在分页（`1 2 3 + 箭头`）下方。

### 13.2 这几轮踩坑与纠偏（按时间顺序）

1) **只改 `bottom` 无效**
- 曾把 `bottom` 调回 `100/50`，但用户仍反馈位置不对。
- 结论：问题不只在 CSS 数值。

2) **仅靠 IO 判定 footer 进入即隐藏，不稳定**
- Lenis 平滑滚动下，单纯 `window scroll` 或简单 IO 判断会出现“看不见/忽隐忽现”。
- 期间出现过：
  - Toggle 长时间 `data-visible=false`；
  - 或者 footer 已进入还没及时隐藏。

3) **关键根因定位（最重要）**
- `App.tsx` 中 `main` 使用 `animate-fade-up`；
- 该动画结束后仍保留 `transform: translateY(0)`；
- 当祖先存在 transform 时，后代 `position: fixed` 会相对该祖先而非 viewport 定位；
- 导致 Toggle“看似 fixed 实则跟着内容走”，滚到 footer 区域时压在绿底上。

### 13.3 最终修复方案（已落地）

#### A. 结构：Toggle 改为 Portal 到 `document.body`

- 文件：`src/components/junni/works-page/JunniWorksPage.tsx`
- 调整：
  - 引入 `createPortal`；
  - 将 Toggle 节点抽为 `toggleNode`；
  - 用 `createPortal(toggleNode, document.body)` 挂载到 body；
  - 增加 `toggleMounted`，仅客户端挂载后渲染，避免 SSR/hydration 风险。

**结果**：Toggle 彻底脱离 `main` 的 transform 影响，`position: fixed` 恢复为相对视口定位（与原站一致）。

#### B. 显隐：Lenis 回调 + scroll/resize 双保险

- 文件：`src/components/junni/works-page/JunniWorksPage.tsx`
- 调整：
  - `useCallback(updateToggleVisibility)` 统一计算；
  - `const lenis = useLenis(updateToggleVisibility)` 让 Lenis 滚动时持续更新；
  - 同时监听 `window scroll`（passive）与 `resize`，兜底同步；
  - `worksInView && !footerCoversToggle` 控制 `toggleVisible`。

#### C. 布局参数保持原站

- 文件：`src/components/junni/works-page/JunniWorksPage.css`
- 维持：
  - `.jwp__toggle { position: fixed; left:50%; bottom:100px; width:160px; z-index:4; }`
  - 移动端：`bottom:50px; width:100px`
  - 滑块方向：`data-type="drumroll"` 在右侧（56.25%）
  - `:active` 果冻拉伸反馈已保留。

### 13.4 浏览器对照验证结论（本轮）

- 在 `#/portfolio`：
  - Drumroll 区域：Toggle 固定在视口底部中间；
  - List 区域：分页可见时，Toggle 在其下方悬浮；
  - Footer 抬升进入 Toggle 区域时：Toggle 隐藏，不再压在荧光绿 footer 上。
- 同时确认：
  - Toggle 挂载父级为 `BODY`；
  - `position: fixed` 与 `bottom: 100px` 生效。

### 13.5 当前文件状态（与 Toggle 相关）

- `src/components/junni/works-page/JunniWorksPage.tsx`
  - 新增：`createPortal`、`toggleMounted`、`toggleNode`；
  - 显隐逻辑改为 `updateToggleVisibility` + `useLenis` 回调驱动；
  - Footer 仍通过 `footerRef` 参与遮挡判断。

- `src/components/junni/works-page/JunniWorksPage.css`
  - Toggle 尺寸/位置参数与原站一致；
  - 保留 pagination 的底部留白规则；
  - footer `margin-top` 维持常规值（未用“硬加大 margin-top”这种偏离原站的办法）。

### 13.6 后续新对话建议（直接按此执行）

1. **先做 3 段位点截图对照**：drumroll 中段 / list 分页处 / footer 临界处，逐一比原站。
2. 若仍有“位置不对”，优先检查：
   - 是否出现新的祖先 `transform`（影响 fixed）；
   - `toggleVisible` 临界阈值是否过早隐藏（`footerCoversToggle`）。
3. 再做动效微调：滑块缓动曲线、显示/隐藏过渡时机（而不是再改极端 `bottom` 值）。

---

## 14. 本轮新增（2026-06-17 17:10，围绕 Footer 1:1 比例复刻）

> 本节记录“用户明确要求 1:1（宽高比例必须一致）”后的纠偏，避免后续会话再次退回“只要看起来像”。

### 14.1 用户最新明确要求（关键）

- 用户明确指出：复刻目标是 **1:1**，不仅是风格接近，**连宽/高/间距比例都要一致**。
- 用户不接受“更像了”式调整，要求按原站参数级对齐。

### 14.2 本轮问题复盘

- 之前 Footer 调整存在“视觉接近但比例体系不一致”的问题：
  - 大量使用主观 `clamp(...)`；
  - 菜单区、品牌区、回顶区相对宽度与位移未按原站比例；
  - 导致在用户截图对照中，仍能明显看出“块面关系不对”。

### 14.3 本轮执行方式（已落地）

- 直接抓取并对照原站实际样式来源，而不是继续凭截图肉眼估：
  - `https://junni.co.jp/assets/styles/works.BaiBovEG.css`
  - `https://junni.co.jp/assets/styles/about.BCtYlxuM.css`
- 根据原站 Footer 真实规则，将作品页 Footer 改为“比例映射”方案：
  - 圆角：`border-radius: 100px 0 0`
  - 内层 padding：`min(40px, 2.5%) 0 min(44px, 2.75%)`
  - 菜单区宽度：`min(437px, 27.3125%)`
  - 品牌区宽度：`min(890px, 55.625%)`
  - 回顶区外边距：`min(58px, 3.625%) min(110px, 6.875%) 0 auto`
  - 菜单字号：`min(24px, 1.5vw)`
  - Logo 字号：`min(150px, 9.375vw)`（以 IFUYUN 文案宽度做就近映射）
- 移动端同步映射原站比例规则，不再仅做“等比缩小”。

### 14.4 本轮修改文件

- `src/components/junni/works-page/JunniWorksPage.css`
  - Footer 区域比例系统由“主观微调”改为“原站参数映射”。
- `src/components/junni/works-page/JunniWorksPage.tsx`
  - 保持当前菜单文案结构（4 项），配合新比例样式呈现。

### 14.5 当前状态与下一步建议

- 当前已从“像”提升到“按比例规则对齐”的阶段，但仍建议继续做三点位精调：
  1. `IFUYUN` 在荧光绿区域内的最终占高比；
  2. 左侧菜单区与中间品牌区的水平关系（特别是右侧留白）；
  3. `PAGE TOP` 按钮在不同高度视口下的垂直落点。
- 下一轮请继续按“**参数对齐 > 主观观感**”原则推进，避免回退到泛化 `clamp` 调样式。

---

## 15. 本轮新增（2026-06-17 17:20~18:03，围绕 Drumroll 手感与素材占位）

> 本节记录“圆筒在未到原站对应区间时仍随页面整体滚动”的连续修复过程。后续新对话请直接基于本节继续调手感。

### 15.1 用户反馈与目标

- 用户明确反馈：当前圆筒尚未到原站图二那种位置时，圆筒整体仍在随页面滚动，手感不对。
- 用户同意优先修交互，并允许直接从原站抓更准确的数据/图片素材先占位。

### 15.2 本轮关键结论（根因）

- 之前实现主要依赖 `JunniWorksDrumroll` 内局部 `wheel` 监听；鼠标离开该局部区域时，页面滚动接管，导致“圆筒跟文档流位移”观感明显。
- 缺少接近原站的“drumroll 粘滞区间（pin/sticky phase）”与统一滚轮接管策略。

### 15.3 本轮已落地改动（代码）

#### A. 滚轮接管从局部改为页面级（drumroll 视图内）

- 文件：`src/components/junni/works-page/JunniWorksPage.tsx`
- 调整：
  - 新增窗口级 `wheel` 监听（capture + passive:false），只在 `view === "drumroll"` 且位于 drumroll 区域时生效。
  - 非首尾项时优先拦截并驱动 `drumrollActive`；首尾继续向外滚动时释放页面滚动。
- 目的：避免“只有鼠标悬停在局部元素上才生效”的不稳定体验。

#### B. 移除子组件重复 wheel 监听

- 文件：`src/components/junni/works-page/JunniWorksDrumroll.tsx`
- 调整：
  - 删除 `wrap.addEventListener("wheel", ...)` 局部监听逻辑。
- 目的：避免窗口级接管与局部接管叠加，出现一次滚动跳两项/双触发。

#### C. 增加 drumroll sticky 区间（接近原站 pin 段）

- 文件：`src/components/junni/works-page/JunniWorksPage.css`
- 调整：
  - `.jwp__drumroll` 最小高度改为较长滚动区：桌面 `220vh`，移动端 `180vh`。
  - `.jwp__drumroll-wrap` 改为 `position: sticky; top: 0; height: 100vh; min-height: 100vh;`。
- 目的：滚动时形成“内容区滚过、圆筒阶段定住”的基础节奏，而非整块提前漂移。

#### D. 滚轮输入调优（触控板/鼠标统一）

- 文件：`src/components/junni/works-page/JunniWorksPage.tsx`
- 调整：
  - 增加 `wheelDeltaAccRef` 累计增量，达到阈值再触发切项（去抖）。
  - `deltaMode` 归一化（行模式转像素）。
  - 动态冷却：大滚轮更长冷却，小滚轮更短冷却。
  - 大幅滚动可跨两项（后续在边界附近禁用）。
- 目的：提升“跟手但不抖”的滚动质感。

#### E. 圆筒运动从固定阻尼升级为自适应阻尼

- 文件：`src/components/junni/works-page/JunniWorksDrumroll.tsx`
- 调整：
  - 引入 `targetActiveRef` / `smoothActiveRef`，渲染基于平滑值追踪目标值。
  - 阻尼由固定系数改为随 `diff` 动态变化（差距大时快、接近时慢）。
- 目的：消除“硬跳项”观感，更接近原站惯性滑入/收敛。

#### F. 首尾橡皮筋阻尼（边界手感）

- 文件：`src/components/junni/works-page/JunniWorksPage.tsx`、`JunniWorksDrumroll.tsx`
- 调整：
  - 接近首尾时提高触发阈值（更“重”），并禁用一次跨两项。
  - 接近首尾时降低平滑推进速度（edge drag）。
- 目的：边界不再“轻飘越界感”，更接近原站首尾阻尼。

### 15.4 本轮素材占位升级（真实 URL）

- 文件：`src/components/junni/works-page/junniWorksPageData.ts`
- 调整：
  - 第 1 页 12 个作品 `image` 已替换为原站详情页抓取到的 `microcms-assets` 真实图片 URL（不再用 `work01~05` / `shiyuan` 占位）。
- 说明：
  - 先前尝试批量抓 `og:image` 的命令曾失败/卡住，后改为稳定方式逐个抓取详情页首图并完成替换。

### 15.5 本轮验证

- `ReadLints`：相关文件无新增报错。
- `npm run build`：多轮改动后均通过。

### 15.6 当前状态（给下个会话）

- 已从“局部 wheel + 硬切项”升级到“窗口接管 + sticky 区间 + 累计阈值 + 自适应阻尼 + 边界阻尼”。
- 圆筒仍是离散索引驱动（以项为单位），但视觉过渡已平滑。
- 若继续追 1:1，下一优先建议：
  1. ~~评估是否改为「滚动进度连续映射 activeFloat」~~ → **§17 已改为滚轮连续 phase**（scroll-scrub 因与滚轮冲突未采用）；
  2. 用原站对照录屏做 **`sensitivity` / 阻尼** 微调（§17.7）；
  3. 对齐 list/drumroll 切换瞬间的过渡节奏（淡入淡出时长与延迟）。

---

## 16. 本轮新增（2026-06-17 18:15~18:20，圆筒图片尺寸统一 + 分页数据对齐）

> 本节记录用户通过**原站 vs 本站截图对比**发现的 Drumroll 图片大小不一致问题，以及随后的代码修复与数据补全。后续新对话请**优先围绕圆筒视觉 1:1**继续精调。

### 16.1 用户反馈（核心视觉问题）

- 用户提供两组对比截图：
  - **图 1 / 图 2（原站）**：`junni.co.jp/works/` Drumroll 圆筒中，Alche、M@STER EXPO 等项目封面在圆筒上**视觉尺寸与比例一致**，呈统一宽矩形窗口。
  - **图 3 / 图 4（本站）**：同一 Drumroll 效果下，各项目图片**大小参差不齐**，有的显大、有的显小。
- 用户判断：**原站应固定了图片显示尺寸**（统一容器 + 裁切），而非按每张原图比例直接撑开。

### 16.2 根因定位

**A. WebGL 几何按原图比例动态变化（主因）**

修改前 `JunniWorksDrumroll.tsx` 逻辑：

```ts
const aspect = img.naturalWidth / img.naturalHeight
const axial = aspect * PANEL_RAD   // ← 每张图面板高度不同
const geo = new THREE.CylinderGeometry(1, 1, axial, ...)
```

- 横图 → `axial` 更大 → 圆筒上显更大
- 竖图 / 方图 → `axial` 更小 → 圆筒上显更小
- 这与原站「统一窗口 + 内容 cover」策略相反

**B. 数据源本身为混合比例**

- `junniWorksPageData.ts` 页 1 的 12 张 `microcms-assets` 封面本身宽高比不一（如 `idolmaster-expo_01.png` 与 `works-basica_3_v2.jpg`）。
- 在未做统一裁切时，差异会被几何公式放大。

### 16.3 已落地修复（代码）

#### A. 固定面板比例 + 贴图 cover 裁切

- 文件：`src/components/junni/works-page/JunniWorksDrumroll.tsx`
- 新增常量：`PANEL_ASPECT = 2.65`
- 新增函数：`fitTextureCover(tex, sourceAspect, targetAspect)`
  - 贴图已设 `tex.rotation = TEX_ROTATION`（`-π/2`），裁切计算使用旋转后的 `displayedAspect = 1 / sourceAspect`
  - 通过 `tex.repeat` / `tex.offset` 实现 CSS `object-fit: cover` 等效居中裁切
- 几何统一为：

```ts
fitTextureCover(tex, aspect, PANEL_ASPECT)
const axial = PANEL_ASPECT * PANEL_RAD   // 所有面板同高
```

- **预期效果**：圆筒上每一张图的「可视窗口」尺寸一致，仅内容裁切不同，接近原站。

#### B. 第 2 / 3 页分页数据对齐原站

- 文件：`src/components/junni/works-page/junniWorksPageData.ts`
- 数据来源：`https://junni.co.jp/works/page/2/`、`https://junni.co.jp/works/page/3/`
- 已删除原先 `PAGE_1.map(... II/III)` 假数据

**页 2（12 项，顺序与原站一致）**

| # | title | slug | description（摘要） |
|---|-------|------|-------------------|
| 1 | Fluffy HUGS | `fluffy_hugs` | NFT「Fluffy HUGs」スペシャルサイト |
| 2 | Innofes DJ Booth | `innofes` | 現地とオンラインをインタラクティブにつなぐインスタレーション |
| 3 | Junni is... | `junni_is` | 株式会社Junni採用特設サイト |
| 4 | Tensura Virtual Gallery | `virtualgallery` | 「転スラバーチャルギャラリー」企画・開発 |
| 5 | RWBY | `rwby` | アニメ『RWBY 氷雪帝国』プロモーション＋公式サイト |
| 6 | You0DECO TV | `you0deco` | アニメ『ユーレイデコ』公式サイト制作 |
| 7 | TENSURA MOVIE | `tensura-movie2022` | 劇場版転スラ 紅蓮の絆編 公式サイト |
| 8 | vi-ta | `vi-ta` | [vi-ta hair design] WEBサイトリニューアル |
| 9 | TOKOSHIE×BULLET | `tokoshie` | 「永久×バレット」ティザーサイト制作 |
| 10 | BURN THE WITCH | `burnthewitch` | アニメ「BURN THE WITCH」公式サイト |
| 11 | DENONBU | `denonbu` | 「電音部」オフィシャルサイト制作 |
| 12 | TENSURA PORTAL | `tensura-portal` | 転スラ公式ポータルサイト制作 |

**页 3（2 项）**

| # | title | slug | description |
|---|-------|------|-------------|
| 1 | OBSOLETE | `obsolete-official` | アニメ「OBSOLETE」オフィシャルサイト制作 |
| 2 | @aroma | `at-aroma` | @aroma online store renewal |

#### C. slug 对齐原站详情页路径（已确认部分）

原站详情页 URL 模式：`https://junni.co.jp/works/{slug}/`

本轮已将多处 slug 从自创命名改为原站路径，例如：

- `fluffy-hugs-special` → `fluffy_hugs`
- `innofes-dj-booth` → `innofes`
- `junni-is` → `junni_is`
- `tensura-virtual-gallery` → `virtualgallery`
- `you0deco-tv` → `you0deco`
- `tensura-movie` → `tensura-movie2022`
- `tokoshie-bullet` → `tokoshie`
- `burn-the-witch` → `burnthewitch`
- `obsolete` → `obsolete-official`

**待核实**：`vi-ta`、`at-aroma` 的原站确切 slug（搜索未拿到详情页直链）。

### 16.4 素材抓取进展与阻塞

| 分页 | 文案 / slug | 缩略图 `image` |
|------|-------------|----------------|
| 页 1 | ✅ 对齐 | ✅ `microcms-assets.io` 真实 URL |
| 页 2 | ✅ 对齐 | ✅ §17 已从详情页回填 |
| 页 3 | ✅ 对齐 | ✅ §17 已从详情页回填 |

> §16 当时页 2/3 缩略图未完成；已在 **§17** 通过 `curl` 抓各 `/works/{slug}/` 详情页 HTML 提取 `microcms` URL 解决。

### 16.5 验证

- `ReadLints`：相关文件无报错
- `npm run build`：通过（§16 改动后）

### 16.6 下一轮优先（圆筒视觉 1:1 主线）

> **多数项已在 §17 完成或迁移**。下轮请直接看 **§17.6 / §17.8**。

### 16.7 新对话复制指令（圆筒专项）

> **已被 §17 取代**。请使用 **§11** 或 **§17.9** 的快速启动指令。

---

## 17. 本轮新增（2026-06-17 晚间，Drumroll 面板间隙 + 连续滚筒 + 页 2/3 缩略图）★

> **本节整合同一会话的全部对话**：用户指出原站 Drumroll「图与图之间有缝、可一直滚的圆柱感」，本站图 4 像一整块连续曲面；分析根因后落地代码修复。**后续新对话请优先围绕 §17 继续精调 Drumroll 效果。**

### 17.1 用户反馈（截图对比 · 核心差异）

用户提供原站截图（图 1–3）vs 本站截图（图 4），归纳：

| 原站（图 1–3） | 本站修复前（图 4） |
|---|---|
| 每条作品带是**独立弧面卡片**，带与带之间有**深色空隙** | 像**一整块连续弯曲贴图**，无明显缝隙 |
| 一条带内常可见**多张缩略图并排**（纹理内留白） | 单张 cover 图铺满整段弧面 |
| 滚动感像**滚筒一直转**（相位连续变化） | 滚一下**跳一项**，手感离散 |
| 多项并存、**不糊叠**成一张 | `PANEL_DEG(51.1°) > STEP_DEG(25°)` → 几何重叠 |

用户直觉：**动态逻辑与 About 区类似**——离散元素 + 可见间隙 + 可持续滚动（About 用 CSS `gap:15px` 跑马灯；Drumroll 应在 WebGL 圆筒上实现同等「卡片感」）。

### 17.2 根因分析（修复前）

**A. 几何重叠消灭缝隙**

- §16 沿用首页 `PANEL_DEG=51.1`、`STEP_DEG=25`。
- 弧宽 > 间距 → 相邻面板在圆筒角向上大幅重叠，z-buffer 叠成连续曲面，**底色 `#1c1d21` 无法露出**。
- 要出现角向 / 纵向可见缝：需 **`PANEL_DEG < STEP_DEG`**（或纹理内留白）。

**B. 单图 cover 铺满**

- 每作品仅一张 hero 图 + `fitTextureCover` → 带内视觉连续；原站不少 Drumroll 纹理为**横向多图拼条**。

**C. 离散步进驱动**

- §15 滚轮：`wheelDeltaAcc` 达阈值 → `drumrollActive ±1`（可跳 2）。
- 首页 `JunniWorks.tsx` 为 `active = progress × (N−1)` **连续小数**；作品集页此前为整数索引 + 阻尼插值。

**D. 与 About 的类比（设计语义，非同一实现）**

| | About 跑马灯 | Drumroll（目标语义） |
|---|---|---|
| 离散 | `<img>` + `gap:15px` | WebGL 开放弧面卡片 |
| 底色缝 | CSS gap | `PANEL_DEG < STEP_DEG` + 透明 canvas |
| 连续滚 | CSS `jwp-slider` infinite | 连续 `activeFloat` 滚轮 |

### 17.3 已落地修复（代码）

#### A. 面板角向间隙（`JunniWorksDrumroll.tsx`）

```ts
const PANEL_GAP_DEG = 6
const PANEL_DEG = STEP_DEG - PANEL_GAP_DEG   // = 19°
const PANEL_FADE_DEG = 14                    // 由 18 收紧（面板变小后）
const PANEL_VISIBLE_DEG = 52                 // 由 58 收紧
```

- 保留 `PANEL_ASPECT=2.65` + `fitTextureCover()`（§16）。
- `renderer.setClearColor(0x000000, 0)`，canvas 透明。
- 渲染帧内 `target = clamp(targetActiveRef.current, 0, n−1)`，允许父级传入略超界的橡皮筋值，显示仍收敛。

#### B. 背景露出缝隙（`JunniWorksPage.css`）

```css
.jwp__drumroll-wrap {
  background-color: #1c1d21;
}
```

#### C. 连续滚筒滚轮（`JunniWorksPage.tsx`）

- 删除：`wheelLockRef`、`wheelDeltaAccRef`、离散步进阈值 / `lockMs`。
- 新增：`drumrollActiveRef` + `setDrumrollPhase(next)` **不硬 clamp**（首尾橡皮筋在 wheel 内处理）。
- 滚轮逻辑（drumroll 视图 + sticky 区间内）：

```ts
const sensitivity = 0.0032
let next = current + normalizedDelta * sensitivity
// 首尾：current≤0.02 或 ≥max−0.02 时释放页面滚动，不 preventDefault
// 中间：preventDefault；next<0 或 >max 时 ×0.22 橡皮筋
```

- `JunniWorksDrumroll`：`onActiveChange` 改名为可选 `onActiveIndexChange`（仅整数索引变化时回调）。

#### D. 页 2 / 3 原站缩略图（`junniWorksPageData.ts`）

从 `https://junni.co.jp/works/{slug}/` 详情页 HTML 提取 `microcms-assets` URL（`curl.exe` + Python 正则；PowerShell 内联 Python 易引号报错，宜写 `.py` 文件执行）。

**页 2 缩略图（已写入）**

| slug | image（microcms 文件名） |
|------|--------------------------|
| `fluffy_hugs` | `.../fluffyhugs01.jpg` |
| `innofes` | `.../innofes01.png` |
| `junni_is` | `.../junniis01.png` |
| `virtualgallery` | `.../virtualgallery01.png` |
| `rwby` | `.../works-rwby01.png` |
| `you0deco` | `.../you0deco.png` |
| `tensura-movie2022` | `.../tensura-guren.png` |
| `vi-ta` | `.../vita01.png`（详情页 URL 为 `/works/vita/`） |
| `tokoshie` | `.../tokoshie01.png` |
| `burnthewitch` | `.../btw01.png` |
| `denonbu` | `.../denonbu01.png` |
| `tensura-portal` | `.../tensura_thum01.jpg` |

**页 3 缩略图**

| slug | image |
|------|-------|
| `obsolete-official` | `.../obsolete01.png` |
| `at-aroma` | `.../aroma02.png`（详情页 `/works/aroma/`） |

### 17.4 尝试过但未保留的方案

**滚动进度映射 `activeFloat`（sticky 220vh → `progress × (n−1)`）**

- 曾与滚轮连续驱动**冲突**：滚轮改 phase 但 scroll 位置不变 → 一旦页面滚动会跳相位。
- **当前仅保留滚轮连续驱动**；若要做首页式 scrub，需同步 Lenis 滚动位置或二选一。

### 17.5 修改文件清单

| 文件 | 变更 |
|------|------|
| `src/components/junni/works-page/JunniWorksDrumroll.tsx` | `PANEL_GAP_DEG` / `PANEL_DEG=19`；透明 clearColor；阻尼 / fade 参数；`onActiveIndexChange` |
| `src/components/junni/works-page/JunniWorksPage.tsx` | 连续滚轮 `activeFloat`；`setDrumrollPhase`；删除离散步进 |
| `src/components/junni/works-page/JunniWorksPage.css` | `.jwp__drumroll-wrap` 背景色 |
| `src/components/junni/works-page/junniWorksPageData.ts` | 页 2/3 全部 `image` 回填 |

### 17.6 验证与已知剩余差距

> **注意**：§17 落地后用户反馈圆筒/图片**整体偏小**；§18 已重写尺寸体系。下表「面板视觉尺寸」项已由 §18 处理，其余仍有效。

**验证（2026-06-17）**

- `npm run build`：通过。
- 本地 `#/portfolio` 滚入 Drumroll：面板间可见**深色缝隙**；滚轮可**连续**切换作品（非一格一跳）。
- 抓取用的 `.tmp-*` 文件已删除，避免 Vite `EBUSY`（见 §5.1）。

**与原站仍可能存在的差距（下轮精调 · 见 §18.6）**

| 项 | 说明 |
|----|------|
| ~~面板视觉尺寸~~ | ~~§17 `PANEL_DEG=19°` 偏小~~ → **§18 已修复** |
| 角向面板缝隙 | §18 恢复 `PANEL_DEG=51.1` 后重叠；原站缝隙多来自纹理拼条 |
| 带内多图拼条 | 原站纹理常含多张缩略图+竖向留白；本站仍单图 cover |
| 滚轮灵敏度 | `sensitivity=0.0032` 待录屏对照 |
| scrim / 亮度 | `PANEL_FADE_DEG=18`、`mat.color.setScalar(b)` 待并排截图 |
| sticky 区高度 | §18 已改 `min(50vw,100vh)`；与原站 `.works_drumroll_inner` 对齐，待截图验收 |

### 17.7 调参速查（`JunniWorksDrumroll.tsx` · 历史 / §17 方案）

> **当前生效常量以 §18.5 为准。** 下表保留 §17 记录，便于理解为何曾缩小面板。

| 常量 | §17 值 | §18 当前值 | 作用 |
|------|--------|------------|------|
| `STEP_DEG` | 25 | 25 | 作品角间距 |
| `PANEL_GAP_DEG` | 6 | **（已移除）** | §17 角向空隙；§18 不再用缩面换缝 |
| `PANEL_DEG` | 19 | **51.1** | 弧面张角 |
| `PANEL_ASPECT` | 2.65 | **16/9** | 视窗宽高比 + cover |
| `PANEL_FADE_DEG` | 14 | **18** | 相邻图暗化 |
| `PANEL_VISIBLE_DEG` | 52 | **58** | WebGL mesh 可见阈值 |
| `VISIBLE_THETA_DEG` | 52 | **58** | DOM 标题可见阈值 |

`JunniWorksPage.tsx` 滚轮：

| 常量 | 当前值 | 作用 |
|------|--------|------|
| `sensitivity` | 0.0032 | 滚轮增量 → phase 倍率 |
| 橡皮筋系数 | 0.22 | 越界时 phase 衰减 |
| 边界释放 | `≤0.02` / `≥max−0.02` | 允许页面继续滚动 |

### 17.8 下一轮建议（Drumroll 效果精调主线）

> 尺寸主线已转至 **§18**。本节滚轮/手感建议仍有效。

1. 原站 vs 本站**同视口并排截图**（Basica / &honey / Playyte 等典型项）— 先验收 §18 尺寸。
2. 在保持 §18 尺寸下评估 **纹理拼条** 或小幅减 `PANEL_DEG`（勿回到 `19°`）恢复缝隙感。
3. 对照原站录屏调 **`sensitivity`**、阻尼 `damping`、首尾橡皮筋。
4. 评估是否需 **横向多图拼条纹理**（更接近原站带内竖缝）。
5. scrim 渐变与 `mat.color` 亮度曲线。
6. **不要**在未改 `PANEL_DEG` 前提下仅放大 `PANEL_ASPECT` 指望出现缝隙（§17 教训）。

### 17.9 新对话复制指令（Drumroll 间隙 / 滚筒专项 · 历史）

> 见 **§18.9** 最新复制指令。本节保留 §17 上下文。

---

## 18. 本轮新增（2026-06-17 晚间，Drumroll 圆筒尺寸 1:1 对齐）★

> **本节整合同一会话全部对话**：用户截图对比发现本站圆筒与封面图**明显小于**原站；分析 §17「缩面换缝」根因后，抓取 `junni.co.jp/works/` 实测数据并落地代码修复。**后续新对话请优先围绕 §18 验收尺寸，再精调缝隙 / 手感 / scrim。**

### 18.1 用户反馈（截图对比 · 核心差异）

用户提供原站截图（`&honey` / `REML` 等典型帧）vs 本站 `#/portfolio` 实现，指出：

| 原站 | 本站（§18 修复前） |
|------|-------------------|
| 中央圆筒曲面占视口约 **60–70% 宽、40–50% 高**，是绝对视觉主角 | 圆筒与图片**整体偏小**，周围深色空隙偏多 |
| 单块弧面宽大，呈统一 **16:9 宽矩形** 窗口 | 单块弧面窄，像「小滚筒」嵌在大画布里 |
| 标题叠在曲面上比例协调 | 标题相对圆筒显得过大或画面发空 |

用户判断：**不是轨道半径算错，而是单块 WebGL 弧面被 §17 大幅缩小。**

### 18.2 根因分析（修复前）

**A. §17 为换缝隙缩小 `PANEL_DEG`（主因）**

| 参数 | 原站 / 首页实测 | §17 本站 |
|------|----------------|----------|
| `PANEL_DEG` | **≈ 51.1°**（首页 `573×626` 视口 CDP 反推） | **19°**（`25° − 6°` 间隙） |
| 单块弧宽（粗算，R=520） | ≈ **451px** | ≈ **171px**（约 **38%**） |

§17 用 `PANEL_GAP_DEG=6` + `PANEL_DEG=19` 在几何上露出 `#1c1d21` 底色缝，但牺牲了原站级面板尺寸。交接文档 §17.6 已预警：「缝隙清晰但单块可能偏小」——与用户观察一致。

**B. `PANEL_ASPECT=2.65` 与容器比例不符**

§16 用 `2.65` 统一各图 cover 窗口，但原站 CSS 明确为 **`aspect-ratio: 16/9`（≈1.778）**。

**C. 缺少原站图片裁剪容器**

原站 `.works_drumroll_image` 是 **`min(90vw, 900px)` × 16:9** 的 overflow 裁剪框；本站 canvas 铺满 `100vh` sticky 区，未对齐该视窗。

**D. 圆筒轨道半径并非主因**

`computeRadius(h) = clamp(h×0.52, 220, 520)` 与首页 `JunniWorks.tsx` 相同；偏小主要来自 **弧面张角 + 视窗未对齐**，而非 `R` 公式错误。

**E. 原站缝隙的真实来源**

原站更可能是 **`PANEL_DEG ≈ 51°` 大块重叠** + **纹理内多图拼条/竖向留白** 形成「卡片缝」，而非把 `PANEL_DEG` 压到 `< STEP_DEG(25°)`。

### 18.3 原站实测数据（2026-06-17 · `junni.co.jp/works/`）

抓取方式：浏览器 CDP + 下载 `works.BaiBovEG.css` + 本地 `#/portfolio` 对照。

#### A. 原站 CSS 关键规则（`assets/styles/works.BaiBovEG.css`）

```css
.works_drumroll_inner {
  height: min(50vw, 100vh);
}
.works_drumroll_slider {
  height: min(50vw, 100vh);
}
.works_drumroll_image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90vw;
  max-width: 900px;
  aspect-ratio: 16/9;
  transform: translate(-50%, -50%);
  overflow: hidden;
}
.works_drumroll_list {
  perspective: 500px;
  font-size: min(150px, 9.375vw);
}
```

移动端（`max-width` 断点）：`.works_drumroll_inner` / `_slider` 高度改为 **`50vh`**。

#### B. CDP 量测（桌面 **1440×900** 视口，滚入 Drumroll sticky 区）

| 元素 | 尺寸 / 样式 |
|------|-------------|
| `.works_drumroll_image` | **900 × 506.25 px**（= `min(90vw,900)` + 16:9） |
| `.works_drumroll_inner` | 高 **720px**（= `min(50vw,100vh)`） |
| 全局 `#canvas` | **1440 × 900**（原站 WebGL 全屏 canvas，由 image 框裁剪视觉） |
| `.works_drumroll_list` | `perspective: 500px` |

#### C. 反推公式（与首页椒4.0 文档一致）

首页文档：`PANEL_DEG ≈ 51.1°` 由 `.home_works_image ≈ 516×290 @ 626vh` 反推。

作品集页在 **1440×900** 下目标面板盒：**900×506**；令正面板高 ≈ `PANEL_RAD × drumRadius`，得：

```ts
targetW = min(vw * 0.9, 900)
targetH = targetW * (9 / 16)
drumRadius = targetH / PANEL_RAD   // PANEL_RAD = 51.1° in rad
```

代入：`targetH=506.25`，`PANEL_RAD≈0.892` → `drumRadius≈567`（大于 `vh×0.52` 的 468，需按视窗盒放大而非仅用 `R=vh×0.52`）。

### 18.4 已落地修复（代码 · 2026-06-17）

#### A. 几何常量回退并对齐原站（`JunniWorksDrumroll.tsx`）

```ts
const PANEL_DEG = 51.1
const PANEL_ASPECT = 16 / 9
const PANEL_FADE_DEG = 18
const PANEL_VISIBLE_DEG = 58
const VISIBLE_THETA_DEG = 58
const PANEL_MAX_WIDTH = 900
// 移除 PANEL_GAP_DEG / PANEL_DEG=19
```

新增：

```ts
function computePanelBox(vw: number) {
  const width = Math.min(vw * 0.9, PANEL_MAX_WIDTH)
  const height = width * (9 / 16)
  return { width, height }
}

function computeDrumRadius(vw: number) {
  const { height } = computePanelBox(vw)
  return height / PANEL_RAD
}
```

- `resize()` / DOM 轨道：`radiusRef` / `drum.scale` / `drum.position.z` 均用 `computeDrumRadius(vw)`。
- DOM 标题淡出曲线改回首页：`clamp(1 - (absTheta - 46) / 14, 0, 1)`。
- 保留 §16 `fitTextureCover()` + §17 连续滚轮 `activeFloat`（`JunniWorksPage.tsx` 未改）。

#### B. 视窗裁剪容器（`JunniWorksDrumroll.tsx` + `JunniWorksPage.css`）

DOM 结构：

```
.jwp__drumroll-wrap          sticky · min(50vw,100vh) · 居中
  .jwp__drumroll-viewport    min(90vw,900px) · aspect-ratio 16/9 · overflow:hidden
    canvas.jwp__drumroll-canvas
  .jwp__drumroll-scrim
  .jwp__drumroll-slider      height: min(50vw,100vh)
    ul.jwp__drumroll-list    width: min(90vw,900px)
```

移除占位 `.jwp__drumroll-image`（改为 viewport 承担原站 `.works_drumroll_image` 角色）。

#### C. 素材

页 1/2/3 已使用原站 `microcms-assets.io` URL（§15 / §17），本轮**未改数据**，仅几何时序与 CSS 裁剪。

### 18.5 修改文件清单

| 文件 | 变更 |
|------|------|
| `src/components/junni/works-page/JunniWorksDrumroll.tsx` | `PANEL_DEG=51.1`、`PANEL_ASPECT=16/9`；`computePanelBox` / `computeDrumRadius`；viewport 包裹 canvas；fade 参数 18/58 |
| `src/components/junni/works-page/JunniWorksPage.css` | `.jwp__drumroll-wrap` 高度 `min(50vw,100vh)`；新增 `.jwp__drumroll-viewport`；list/slider 宽度对齐；移动 `50vh` |

### 18.6 验证与已知剩余差距

**验证（2026-06-17）**

- `npm run build`：通过。
- 本地 `#/portfolio` CDP：`.jwp__drumroll-viewport` ≈ **900×506px**（1440 宽视口），与原站 `.works_drumroll_image` 一致。
- Dev server：`http://localhost:5173/#/portfolio`。

**与原站仍可能存在的差距（下轮精调）**

| 项 | 说明 |
|----|------|
| **尺寸并排验收** | 请在用户真实显示器分辨率下与原站并排截图（&honey / BaSICA / Playyte） |
| **角向面板缝隙** | §18 恢复重叠后，几何缝弱于 §17；可考虑纹理拼条或 `PANEL_DEG` 微调到 45–50°（**勿回到 19°**） |
| **带内多图拼条** | 原站弧带内常有多张缩略图 + 竖缝；本站仍单图 cover |
| **滚轮手感** | `sensitivity=0.0032`、阻尼、橡皮筋待录屏对照（§17） |
| **scrim / 亮度** | `.jwp__drumroll-scrim` 已略减；`mat.color.setScalar(b)` 待微调 |
| **全局 canvas** | 原站 `#canvas` 全屏；本站 per-page canvas + viewport 裁剪——视觉应接近，架构不同 |
| **标题字号** | 原站 list `font-size: min(150px,9.375vw)`；本站用 `clamp`，可继续微调 |

### 18.7 调参速查（**当前生效** · `JunniWorksDrumroll.tsx`）

| 常量 / 函数 | 当前值 | 作用 |
|-------------|--------|------|
| `STEP_DEG` | 25 | 作品角间距（DOM 标题一致） |
| `PANEL_DEG` | 51.1 | 弧面张角（与首页同量级） |
| `PANEL_ASPECT` | 16/9 | 贴图 cover 目标比例 |
| `PANEL_MAX_WIDTH` | 900 | 对齐原站 `max-width:900px` |
| `computePanelBox(vw)` | — | 返回 `{ width, height }` = `min(90vw,900)` × 16:9 |
| `computeDrumRadius(vw)` | — | `targetH / PANEL_RAD`；驱动 WebGL scale 与 DOM 轨道 |
| `PANEL_FADE_DEG` | 18 | 相邻图暗化 |
| `PANEL_VISIBLE_DEG` | 58 | WebGL mesh 可见阈值 |
| `VISIBLE_THETA_DEG` | 58 | DOM 标题可见阈值 |

`JunniWorksPage.css` 关键：

| 选择器 | 规则 |
|--------|------|
| `.jwp__drumroll-wrap` | `height/min-height: min(50vw, 100vh)`；`place-items: center` |
| `.jwp__drumroll-viewport` | `width: min(90vw, 900px)`；`aspect-ratio: 16/9`；`overflow: hidden` |
| `@media (max-width:949px)` | wrap/slider/list → `50vh` |

### 18.8 下一轮建议（Drumroll 复刻主线）

1. **尺寸验收**：同分辨率并排截图原站 vs `#/portfolio`（优先 &honey、BaSICA）。
2. **缝隙**：在**不回到 `PANEL_DEG=19`** 前提下，试纹理拼条或 `PANEL_DEG` 45–50° + 纹理留白。
3. **滚轮**：录屏对照 `sensitivity` / 阻尼 / 首尾橡皮筋。
4. **scrim / 亮度**：微调 `mat.color` 与 `.jwp__drumroll-scrim` 渐变。
5. **标题比例**：对照原站 `font-size: min(150px,9.375vw)` 微调 `clamp`。
6. **勿踩坑**：仅放大 `PANEL_ASPECT` 不出缝隙；仅缩小 `PANEL_DEG` 换缝会再次缩小圆筒（§17 教训）。

### 18.9 新对话复制指令（Drumroll 尺寸 / 效果精调 · 最新）

> 继续 junni.co.jp `/works/` **Drumroll 圆筒效果 1:1 精调**。已读 `docs/junni-works-page-复刻交接.md` **§18**（尺寸）+ **§17**（滚筒/滚轮）。
>
> **已完成（§18）**：原站实测 `min(90vw,900px)` 16:9 viewport；`PANEL_DEG=51.1`；`computeDrumRadius`；sticky 区 `min(50vw,100vh)`；本地 viewport 约 **900×506 @ 1440×900**。§17 连续滚轮 + 三页 `microcms` 图。`npm run build` 通过。
>
> **待做**：① 用户环境并排截图验收尺寸；② 缝隙感（纹理拼条 / 微调 `PANEL_DEG`）；③ `sensitivity`/阻尼；④ scrim/亮度；⑤ 标题字号。
>
> 请从用户指定的差异点继续。访问：`http://localhost:5173/#/portfolio` vs `https://junni.co.jp/works/`。

---

*文档结束。新对话请 @ 本文件并说明要从哪一步开始（建议：「§18 尺寸并排验收」或「在保持尺寸下恢复缝隙感」或「录屏对齐滚轮 sensitivity」）。*
