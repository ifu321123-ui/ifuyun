# JUNNI /works/ 作品集页复刻 · 对话交接文档

> 用途：在新对话里继续 1:1 复刻 [junni.co.jp/works/](https://junni.co.jp/works/) **独立作品集列表页**，并精调视觉效果与动效。把本文件喂给新会话即可无缝接力。
>
> 来源：2026-06-17 多轮对话整理（原站 HTML 实锤、截图对比、首版实现、结构纠偏、CSS/路由修复）。
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
| 驱动方式 | 滚轮切换 Drumroll + Toggle 切 List | ScrollTrigger pin + scrub 滚动 |
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

---

## 4. 本站当前实现（2026-06-17 结构纠偏后）

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
│     └─ nav.jwp__pagination           # 仅 list 模式
├─ div.jwp__toggle[data-visible]       # checkbox 切 drumroll ↔ list
├─ aside.jwp__copyright
└─ footer.jwp__footer                  # menu + IFUYUN + pageTop
```

### 4.4 JunniWorksDrumroll 要点

| 项 | 实现 |
|----|------|
| 几何常量 | 与首页 `JunniWorks.tsx` 同源：`STEP_DEG=25`、`PERSPECTIVE=500`、`PANEL_DEG=51.1` 等 |
| 可见性裁剪 | `VISIBLE_THETA_DEG=52`；项外范围 `opacity:0`、`visibility:hidden`、`data-visible="false"` |
| 滚轮驱动 | drumroll 区域 `wheel` 切换 `activeIndex`（280ms 节流） |
| PREV/NEXT | 列表末尾 `jwp__drumroll-item--nav`，按 `page`/`totalPages` 条件渲染 |
| 链接 | 作品项用 `<a href="#work/{slug}">` |
| WebGL | canvas 曲面贴图；`IntersectionObserver` 进入视口才 `requestAnimationFrame` |

### 4.5 数据与素材现状

- 介绍文案：原站日文 `WORKS_PAGE_ABOUT_TEXT`（数组 10 行）；当前 TSX 用 `join("")` 合并为连续文本，**未保留 `<br>` 换行**
- About 图：16 张 PNG 在 `public/works/junni/about/`
- 页 1 前 5 项：使用 `public/works/junni/*` 真实缩略图
- 页 1 第 6–12 项：暂用 `work01~05.png`、`shiyuan/*` **占位**
- 页 2、3：`junniWorksPageData.ts` 中由页 1 衍生（标题加 II/III），**非真实分页内容**

### 4.6 构建与访问

```bash
npm run dev      # http://localhost:5173/#/portfolio
npm run build    # 已通过（2026-06-17 结构纠偏后）
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
- [ ] **Drumroll 驱动手感**：原站需 DevTools 实测是滚轮、拖拽还是 Lenis 区间驱动；本站目前仅 wheel
- [ ] **Toggle 图标**：原站用 PNG（`list.png` / `drumroll.png`），本站为内联 SVG
- [ ] **List 缩略图**：第 6–12 项及页 2/3 需换真实图或自己的作品素材
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

1. **浏览器对照**：`#/portfolio` vs `junni.co.jp/works/`，截图列剩余差异清单
2. **Drumroll 手感**：实测原站滚动行为，对齐 wheel / 拖拽 / 惯性
3. **About 文案换行** + slider `data-media` 断点精细对照
4. **Toggle + 分页** 视觉 1:1（PNG 图标、间距、hover）
5. **List 网格** 三列间距、标题字号、hover 色
6. **Footer** noise 纹理 + 社交区 + SVG Logo
7. **右上角 MENU**（或确认继续沿用隐藏 Navbar 的简化方案）
8. **替换作品数据与图片**
9. **（可选）** 抽取 `useJunniDrumroll` 与首页共用

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
| 文档整理 | 本文件更新，供后续对话接力 |

---

## 11. 新对话快速启动指令（复制即用）

> 继续 junni.co.jp **`/works/` 作品集页**复刻（非首页 home_works）。已读 `docs/junni-works-page-复刻交接.md`。
>
> **现状**：`#/portfolio` → `JunniWorksPage`。DOM 已按原站嵌套（`works-list` 内含 `list-inner` + `drumroll` + `pagination`）。About 白字逐字 + 桌面 3 列跑马灯。Drumroll 有可见性裁剪 + PREV/NEXT。Footer 正常文档流。portfolio 页已隐藏 Navbar / QuickActions。`npm run build` 通过。
>
> **请先**对照原站截图，从【用户指定的差异点】开始精调。注意区分本页与 `JunniWorks.tsx`（首页椒4.0）。待办见本文档第 6 节。

---

*文档结束。新对话请 @ 本文件并说明要从哪一步开始（例如：「先对齐 Drumroll 滚动手感」或「补原站右上角 MENU」）。*
