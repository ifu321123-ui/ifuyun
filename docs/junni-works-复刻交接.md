# JUNNI home_works 复刻 · 对话交接文档

> 用途：在新对话里继续 1:1 复刻 [junni.co.jp](https://junni.co.jp/) 首页 **home_works**（3D 转鼓 WORKS 轮播 + 巨型层叠标题）。把本文件作为上下文喂给新会话即可无缝接力。
> 最后更新：2026-06-16（MVP 已落地并接入，`npm run build` 通过；已用浏览器 CDP 抓原站参数校准；标题/大图/半径仍需按第 6 节微调）。

---

## 0. 一句话目标

1:1 复刻 junni.co.jp 首页 `home_works` 区块：**双层 pin（巨型 WORKS 标题 + 3D 圆柱转鼓作品轮播）**，随滚动转鼓旋转、当前项放大高亮、描述逐字浮现，配深底 + 黄绿（`#dcff46`）配色与底部 shift 擦除条。先按原站文案/动效 1:1 复刻，素材后续替换。

参考截图：image 1（黄底"关于 Junni"按钮下方进入 home_works，巨型黄绿描边层叠"这项工作/WORKS"压满屏）；image 2（转鼓中央放大显示 Alche / 巴西卡 等作品名 + 日文副标题）。

---

## 1. 技术栈与现状（已确认）

- 框架：**React 19 + Vite 8 + TypeScript**，Tailwind v4，已装 `gsap` / `lenis`
- 转鼓旋转：**GSAP ScrollTrigger（scrub）** 驱动 sticky 进度 → 实时计算每项 3D transform
- 平滑滚动由 `src/components/SmoothScroll.tsx`（Lenis）在 `App` 外层统一包裹
- 配色/风格沿用既有 junni 组件，CSS 自包含（`.junni-works__*`，不依赖 `.junni-root` 变量）

---

## 2. 文件清单（已落地）

```
src/components/junni/
├─ JunniWorks.tsx     # ✅ 组件：双层 pin + 3D 转鼓 + repeatText 标题 + 逐字副标题 + shift 条
├─ JunniWorks.css     # ✅ 自包含样式（.junni-works__* 全套）
└─ junniData.ts       # ✅ 新增 junniWorks 数组（6 项原站文案 + slug + 占位图）+ JunniWork 类型
```

改动过的既有文件：
- `src/components/junni/junniData.ts`：文件末尾新增 `export type JunniWork` 和 `export const junniWorks`（basica / alche-studio / 2nd-star-production / opb_app / master-expo / and_more 六项，原站日文文案与链接 1:1，图片暂用 `/works/shiyuan/01–06.png` 占位）。
- `src/components/GunzeTransition.tsx`：
  - 顶部 `import JunniWorks from "./junni/JunniWorks"`
  - 在 `<JunniService />` **正下方**、`<MovieSection />` 之前插入 `<JunniWorks />`

> **插入位置（首页流）**：`Hero → BusinessIntro → GunzeTransition`（…message 区）→ `<JunniService />`（PERFORMANCE 手风琴，即截图"图三"）→ **`<JunniWorks />`** → `<MovieSection />` → `<CeoSection />`。
> `GunzeTransition` 被 `src/components/Hero.tsx` 使用。

构建状态：`npm run build` 通过（Windows PowerShell 不支持 `&&`，命令分开写或用 `;`）。dev：`npm run dev`（端口 5173，strictPort）。

---

## 3. DOM / 组件结构（`JunniWorks.tsx`）

```
section.junni-works[data-gooey-color="yellow"]              # 深底 #1c1d21；min-height ~320vh 提供滚动行程
 └ div.junni-works__pin                                     # position:sticky top:0 height:100vh
     ├ h2.junni-works__title.repeatText                     # 巨型层叠标题（绝对定位，转鼓后方背景）
     │   └ span.junni-works__title-wrap.text-repeat
     │       └ span.junni-works__title-echo × 7             # 6 残影(lower/upper) + 1 主字(main)
     ├ div.junni-works__wrap                                # perspective 容器（透视）
     │   └ div.junni-works__inner                           # transform-style: preserve-3d
     │       ├ div.junni-works__image                       # 背景图面板（含 N 张 crossfade 图 + label）
     │       └ div.junni-works__slider > ul.junni-works__list
     │           └ li.junni-works__item[data-item-active][data-item-visible][data-works] × 6
     │               └ a.junni-works__item-link
     │                   ├ span.junni-works__item-title[data-size]   # 作品名
     │                   └ span.junni-works__item-desc               # 逐字 span（--transition-delay 每字 +0.03s）
     └ div.junni-works__shift > span.junni-works__shift-layer × 4    # 底部黄绿擦除条（氛围）
```

数据来源：`junniWorks`（`{ slug, title, description, href, image, titleSize? }` × 6）。

滚动逻辑（伪代码）：
```ts
ScrollTrigger.create({ trigger: section, start:"top top", end:"bottom bottom", scrub:0.45,
  onUpdate: self => { setProgress(self.progress); setActiveIndex(round(1 + p*(n-2))) }})
const current = 1 + progress * (n - 2)             // 当前居中的浮点索引
// 每项：angle = (index - current) * 25°
```

---

## 4. 原站实测参数（浏览器 CDP，2026-06-16，视口 ~1114×898 / 容器 1099）

### 4.1 3D 转鼓几何（核心，已反推精确公式）
原站 `li.home_works_item` 的 transform = `translate3d(-50%, Y, Z) rotateX(α)`，`transform-origin:50% 50%`。
6 项 α 相差 **25°**。由实测两组数据反推为标准圆柱：

| 来源 | α | Y | Z |
|---|---|---|---|
| 初始态 basica | -80° | 381.121 | -319.798 |
| 初始态 master-expo | -180° | 0 | -774 |
| 居中态 opb_app(active) | -11.14° | 74.76 | -7.29 |

**精确公式（半径 R≈388px）**：
```
Y = -R * sin(α)
Z =  R * cos(α) - R
rotateX(α)            // active = α 最接近 0 的项
```
验证 α=-155°：Y=-388·sin(-155°)=163.5 ✓、Z=388·cos(-155°)-388=-737.7 ✓。
> R 建议响应式：`R ≈ 0.353 × 容器宽`（1099 → 388）。

### 4.2 巨型标题 repeatText（image 1 主视觉）
- `h2.home_works_title`：约 `width 791px / height 443px`（≈72vw），**超大**，pin 成 `position:fixed` 压满屏，在转鼓后方。
- 配色（实测 computed）：**所有 7 个副本**（含中间主字 `data-ty=0`）均为
  - `-webkit-text-fill-color: rgb(28,29,33)` = **#1c1d21（深填充）**
  - `-webkit-text-stroke-color: rgb(220,255,70)` = **#dcff46（黄绿描边）**
- 7 副本垂直偏移为**百分比**（基于字高），实测settled值：
  - lower：`+7.78%`(ty20) / `+13.94%`(ty40) / `+18.61%`(ty60)
  - upper：`-6.21%`(ty-20) / `-13.94%`(ty-40) / `-23.34%`(ty-60)
  - main：`0`
- `data-delay`：0 / 0.08 / 0.16（错峰），随滚动 spread→收拢 + opacity 0→1 进场。
- wrap 实测：`padding-bottom:52px; margin-top:26px`。

### 4.3 背景图面板
- `home_works_image` 实测在左侧（约 516×290），`background:none`（基本空/暗），**并非居中大亮图**。中央主视觉是"标题 + 作品名转鼓"，没有大缩略图。

### 4.4 其他
- 区块底色：`#1c1d21`。`data-gooey-color="yellow"`（复用全站 gooey 光标）。
- `data-size`：normal / small / middle 控制作品名字号。
- 副标题逐字 `--transition-delay` 每字 +0.03s。
- 原站还有 `home_works_shift > shift_layer × 4`（进场擦除氛围层）。

---

## 5. 已落地实现要点（当前版本）

- `JunniWorks.tsx`：用 `progress` 算 `current` 浮点索引，每项 `angle=(index-current)*25`，CSS 变量 `--junni-works-y/z/rx/opacity` 注入 transform；`activeIndex` 控制 `data-item-active`；描述逐字 span + `--transition-delay`。
- `JunniWorks.css`：深底 sticky 舞台、标题残影、3D 转鼓、active 放大、逐字浮现、底部黄绿 shift 条、`prefers-reduced-motion` 降级、`max-width:768px` 移动端适配。
- 已接入 `GunzeTransition` 并 `npm run build` 通过，浏览器实测 active 项随滚动从 Alche → M@STER EXPO → and more 正常切换。

---

## 6. 待调整项（下一步，按优先级）★ 关键

> 上一版"差别大"的根因：标题做成了白色实心 + 居中加了大亮图 + 半径偏小。以下为已确认的修正方向。

1. **【高】标题配色** —— 去掉主字（`data-rep-txt-item="main"`）的白色覆盖；**所有副本统一** `fill:#1c1d21 + stroke:#dcff46`。
2. **【高】标题尺寸** —— 放大到约 `clamp(7rem,16vw,15rem)`，占满宽度（≈72vw），作为转鼓后方大背景。
3. **【高】标题偏移改百分比** —— 用第 4.2 的 %（+7.8/+13.9/+18.6、-6.2/-13.9/-23.3、0），替换当前的固定 `60/40/20px`。
4. **【高】去掉/压暗中间大图** —— 原站没有居中高亮缩略图；将 `.junni-works__image` 删除或压成 `opacity:.18; filter:brightness(.45)`，背景保持纯 `#1c1d21`（去掉之前加的居中发光渐变）。
5. **【中】半径** —— `radius` 从 328 改 **388**（并做成 `min(388, vw*0.35)` 响应式）。
6. **【中】作品名** —— 浅色大字 `clamp(3.2rem,8vw,7.5rem)`，active 更亮（`#fff`）。
7. **【低】进场动画** —— 标题副本随滚动 spread→收拢 + opacity 0→1（data-delay 0/0.08/0.16）。
8. **【低】素材替换** —— 用户后续把 `junniData.ts` 的 `image` 换成自己项目图。
9. **【可选】gooey 黄绿光标** —— 原站全屏 WebGL canvas（`data-gooey-color`），可后补近似。

拟改的关键值（落地时参考）：
```css
.junni-works__title-echo{
  font-size: clamp(7rem,16vw,15rem);
  -webkit-text-stroke: 1.5px #dcff46;
  -webkit-text-fill-color: #1c1d21;   /* 主字不再做白色 */
  transform: translate3d(0, var(--ty-percent), 0);  /* 用 %，非 px */
}
/* 删除 .junni-works__title-echo[data-rep-txt-item="main"]{...白色...} */
.junni-works__image{ opacity:.18; filter:brightness(.45) saturate(.7); }
```
```ts
const radius = Math.min(388, vw * 0.35)
const y = -radius * Math.sin(rad)
const z =  radius * Math.cos(rad) - radius
// transform: translate3d(-50%, y, z) rotateX(angleDeg)
```

---

## 7. 原站 WORKS 数据（home_works，6 项，已写入 junniData.ts）

| slug | title | description（日文，1:1） | href | data-size |
|---|---|---|---|---|
| basica | BaSICA | 株式会社BaSICA コーポレートサイトリニューアル | /works/basica | normal |
| alche-studio | Alche, Inc | Alche株式会社 コーポレートサイトリニューアル | /works/alche-studio | normal |
| 2nd-star-production | 2nd STAR PRODUCTION | 「2nd STAR PRODUCTION」コーポレートサイト制作 | /works/2nd-star-production | small |
| opb_app | ONE PIECE BASE | ONE PIECE BASEアプリ開発／制作 | /works/opb_app | middle |
| master-expo | M@STER EXPO | THE IDOLM@STER M@STER EXPO 公式ブース出展 | /works/master-expo | middle |
| and_more | and more... | WORKS - 制作実績一覧ページ | /works | (default) |

> 转鼓副标题在原站是逐字 span（每字带 `--transition-delay` +0.03s）；中文标题（巴西卡/Alche公司/第二明星制作公司/一体式底座…）是浏览器翻译插件结果，复刻用原文 title 即可。

---

## 8. 浏览器实测/调试备忘（环境）

- 浏览器 MCP：`cursor-ide-browser`（`browser_navigate` / `browser_cdp` / `browser_lock` / `browser_take_screenshot`）。**仅 Agent 模式可用**。
- 抓参数方法：`browser_cdp` → `Runtime.evaluate`（`awaitPromise:true`），滚动后 `requestAnimationFrame + setTimeout(180ms)` 等动画稳定再读 `getComputedStyle(...).transform`。大响应会落盘到 `C:\Users\...\.cursor\browser-logs\`，用 Read/Grep 读关键行。
- 本地预览：`http://127.0.0.1:5173/`，首页向下滚到 PERFORMANCE 板块下方即 `.junni-works`。

---

## 9. 新对话快速启动指令（复制即用）

> 继续 junni.co.jp 首页 `home_works` 复刻。已读 `docs/junni-works-复刻交接.md`。组件 `src/components/junni/JunniWorks.{tsx,css}` + `junniData.ts` 的 `junniWorks` 已落地并接入 `GunzeTransition`（在 `<JunniService />` 正下方），`npm run build` 通过。3D 转鼓几何已按原站实测公式（R≈388、Y=-R·sin α、Z=R·cos α-R、rotateX α、步进 25°）实现。下一步按第 6 节"待调整项"优先级修正：①标题全部副本改 `#1c1d21 填充 + #dcff46 描边`（去掉主字白色）②标题放大到 ≈72vw ③副本偏移改百分比 ④去掉/压暗中间大图、背景纯 #1c1d21 ⑤半径改 388。改完用浏览器 CDP 抓本地截图与原站（image 1 / image 2）对照微调，并 `npm run build` 验证。
