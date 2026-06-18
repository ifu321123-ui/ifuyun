# JUNNI /recruit/ 採用页复刻 · 对话交接文档

> 用途：在新对话里继续 1:1 精调 [junni.co.jp/recruit/](https://junni.co.jp/recruit/) 复刻效果，并解决与 NEU 内嵌区块的共存问题。把本文件喂给新会话即可无缝接力。
>
> 来源：2026-06-18 多轮对话整理（需求确认 → 首版实现 → 访问故障排查 → NEU 缩放隔离修复）。
>
> 关联文档：[junni-works-page-复刻交接.md](./junni-works-page-复刻交接.md)、[junni-about-works-shift-交接.md](./junni-about-works-shift-交接.md)、[junni-hero-复刻交接.md](./junni-hero-复刻交接.md)

---

## 0. 一句话目标

在站内 **`#/experience`（实习经历）** 页面顶部，**完整插入** junni.co.jp 独立採用页 `/recruit/` 的视觉与内容；其下方保持原有 **NEU 复刻内嵌区块**（`NeuEmbed`）及全站 UI（右上 `JunniMenu`、右下 `QuickActions` / `IntroFlip`）**行为与缩放不变**。

**访问地址：** `http://localhost:5173/#/experience`  
**菜单入口：** MENU → **实习经历**

---

## 1. 极易混淆：本任务 vs 其他 Recruit 相关

| | **本任务：`/recruit/` 独立页内嵌** | **文档 `home_recruit`（首页区块）** |
|---|---|---|
| 原站 URL | `https://junni.co.jp/recruit/` | `https://junni.co.jp/` 滚动后段 |
| 原站类名 | `recruit_message`、`recruit_positions`… | `home_recruit`、pin + 3D 翻面主图 |
| 本站位置 | `Experience.tsx` 顶部 | `JunniTop.tsx` 预留注释，**未实现** |
| 驱动方式 | 首版：CSS + `useInView` + `data-pagehead` | 首页 ScrollTrigger pin（见 about-works-shift 文档） |

**新对话务必先确认：用户要改的是「experience 页顶部的独立 recruit 页」还是「首页 home_recruit 区块」。**

---

## 2. 对话时间线与决策记录

### 2.1 需求（Ask 模式）

- 用户希望 **1:1 复刻** `https://junni.co.jp/recruit/` 整页，插入到原 experience 页 **NEU Hero/About 等内容上方**（即整页最顶部先看到 Recruit，向下滚才到 NEU）。
- 允许抓取原站 HTML/CSS/图片 URL 作占位。
- 参考截图：原 experience 页为白底 + 滚动文字背景 + 左下荧光绿文案框（NEU Hero），或中部 About Neu 全宽绿卡片。

### 2.2 首版实现（Agent 模式）

1. 下载并解析 `https://junni.co.jp/recruit/` HTML（约 64KB 单行）。
2. 下载原站 CSS：`/assets/styles/recruit.BRU1zi4B.css`（约 22KB）。
3. 新建 `src/components/junni/recruit-page/` 三件套（数据 / 组件 / 样式，命名空间 `jrp`）。
4. 修改 `Experience.tsx` 在 `NeuEmbed` 上方挂载 `JunniRecruitPage`。
5. 图片/iframe 暂用原站 CDN：`https://junni.co.jp/assets/images/recruit/...`。

### 2.3 故障：localhost 访问不了

**现象：** 浏览器无法打开 `localhost:5173`。

**根因：** 抓取时写入项目根目录的 `tmp-recruit.html` 触发 Vite 文件监听 `EBUSY`，**dev server 进程崩溃**。

**修复：**

- 删除 `tmp-recruit.html` 等临时文件。
- `vite.config.ts` 增加忽略：`ignored: ["**/.tmp*", "**/*.tmp", "**/tmp-*"]`。
- 重新 `npm run dev`。

### 2.4 故障：NEU 区块两侧白边 / 布局被压坏

**现象：** 插入 Recruit 后，About Neu 绿色卡片两侧出现白边，全宽铺满效果丢失；用户要求 **「这些板块不能因为插入受到影响」**。

**根因：** Recruit 与 NEU 共用/改动了 **Neu 缩放链路**：

| 机制 | 作用 |
|------|------|
| `html:has(.neu-embed) { font-size: 62.5% }` | Neu 的 `rem` 基准 1rem=10px |
| `.neu-host-scale { zoom: 1.6 }` | 宿主内容视觉放大，抵消 62.5% 对非 Neu 区的影响 |
| `.neu-bleed { zoom: 0.625 }` | Neu 区块净缩放 1.6×0.625=1.0，实现 1:1 |

中间曾错误尝试：当存在 `.jrp` 时取消 `html` 62.5% 或取消 `neu-host-scale`，导致 NEU **出血全宽失效**。

**最终修复（当前生效结构）：**

```
App（experience 页）
├─ JunniMenu                    # 缩放层外，不受影响
├─ main
│  ├─ JunniRecruitPage          # ★ 独立，不参与 Neu 缩放
│  └─ .neu-host-scale
│     └─ .neu-bleed
│        └─ NeuEmbed            # ★ 与插入 Recruit 前相同链路
└─ .neu-host-scale（仅 experience）
   ├─ QuickActions              # 保持插入前 1.6x 视觉
   └─ IntroFlip
```

**关键代码位置：**

- `src/components/Experience.tsx` — Recruit 与 Neu 分块。
- `src/App.tsx` — **不再**对整个 experience 容器套 `neu-host-scale`；仅对 `QuickActions` + `IntroFlip` 套。
- `src/components/neu/neu.css` — 恢复 `html:has(.neu-embed)` 全局 62.5%，**无** `.jrp` 特殊分支。

---

## 3. 原站 `/recruit/` 页面结构（HTML 实锤）

原站 CSS 入口：`/assets/styles/recruit.BRU1zi4B.css`  
共享样式：`index.DF939C5c.css`（`pageHead`、`sectionTitle`、`flipBtn`、`flipLink` 等）

### 3.1 DOM 区块（自上而下）

```
body[data-namespace=recruit]
├─ .menu
├─ .pageHead                      # R E C R U I T 逐字动画
├─ .recruit_message               # 标语擦除 + 逐字正文
├─ .recruit_special               # SPECIAL / YouTube コラボ
├─ .recruit_positions             # 职种 flipLink + JOIN US + Speakerdeck + CONTACT
│  └─ .recruit_positions_shift    # 7 条 shift 层（区块过渡）
├─ .recruit_office                # 360° 全景 iframe + 办公室图跑马灯
│  └─ .recruit_office_shift
├─ .recruit_tvcm                  # TV CM YouTube
│  └─ .recruit_tvcm_shift
├─ .recruit_interview             # 4 张访谈卡 + Wantedly + CONTACT
├─ .copyright
├─ .footer                        # 站内导航 + logo + PAGE TOP
└─ .bottom                        # 底部 SNS 荧光绿条
```

### 3.2 设计 Token（原站 / 本项目 jrp）

```css
--jrp-dark:            #1c1d21;
--jrp-green:           #dcff46;
--jrp-green-accent:    #b8de16;
--jrp-green-highlight: #d0fe02;
--jrp-white:           #f7f7f7;
--jrp-muted:           #777777;
--jrp-ink:             #2f3032;   /* 正文灰（message 区） */
--jrp-panel:           #333333;   /* SPECIAL 内层深灰底 */
```

字体：原站 `ryo-gothic-plusn`（日文）、`Montserrat`（英文标题）、`Barlow Condensed`（职种标签）。  
本项目 fallback：`Noto Sans JP` + `Montserrat` + `Barlow Condensed`（CSS `@import`）。

### 3.3 外链与嵌入（已写入 data）

| 区块 | URL |
|------|-----|
| SPECIAL YouTube | `https://www.youtube.com/embed/kZx-uWnoWYk?si=...` |
| TV CM YouTube | `https://www.youtube.com/embed/EnyUkPlSATI?si=...&controls=0` |
| 360 Office | `https://tour.vachanavi.net/tour-afe7a08e723149209955f847e12cb0ab` |
| 採用ピッチ | `https://speakerdeck.com/player/926606fedafd4ec485919212581f1e34` |
| JOIN US | `https://herp.careers/v1/junni` |
| 职种 HERP | 见 `junniRecruitPageData.ts` → `RECRUIT_POSITIONS` |
| 访谈 Wantedly | 4 篇，见 `RECRUIT_INTERVIEWS` |
| 办公室图 | `https://junni.co.jp/assets/images/recruit/office/01.jpg` … `12.jpg` |
| 访谈图 | `.../interview/3.jpg`、`7.jpg`、`11.jpg`、`13.jpg` |

---

## 4. 本项目文件清单

| 文件 | 说明 |
|------|------|
| `src/components/junni/recruit-page/JunniRecruitPage.tsx` | 主组件，含 Hero / 各 section / FlipBtn / SectionTitle |
| `src/components/junni/recruit-page/JunniRecruitPage.css` | 样式命名空间 `.jrp` / `.jrp__*` |
| `src/components/junni/recruit-page/junniRecruitPageData.ts` | 文案、链接、图片 URL |
| `src/components/Experience.tsx` | 编排：Recruit 在上，Neu 在下 |
| `src/App.tsx` | experience 白底；QuickActions 单独 neu-host-scale |
| `src/components/neu/neu.css` | Neu 缩放规则（勿为 jrp 再加全局例外） |
| `vite.config.ts` | `server.watch.ignored` 含 `tmp-*` |

**未改动的 NEU 相关：**

- `src/components/neu/NeuEmbed.tsx` — 仍渲染 Hero / Transition / About / Pixel / Service / Team / Contact。
- `usePinProgress`（About 钉住缩放）— 逻辑未改；插入 Recruit 仅增加上方滚动行程。

---

## 5. 首版已实现 vs 未实现（精调 backlog）

### 5.1 已实现（结构 + 静态视觉）

- [x] `RECRUIT` 页头逐字入场（`data-pagehead` + CSS animation）
- [x] Message 标语高亮擦除（`theme-wipe` keyframes）
- [x] Message 正文逐字 span（未做逐字滚动变色，仅整体 opacity）
- [x] SPECIAL / POSITIONS / OFFICE / TVCM / INTERVIEW 各 section 骨架
- [x] 职种 5 列：字母卡片 + hover 3D flip（简化版，非原站 SVG 路径字标）
- [x] JOIN US / CONTACT / READ MORE 翻转按钮（简化 `flipBtn`）
- [x] YouTube / Speakerdeck / 360 iframe 嵌入
- [x] 办公室图双轨 CSS 跑马灯 `jrp-slider-x`
- [x] 访谈卡 # 描边数字 + hover 填色
- [x] Recruit 自带 footer / copyright / SNS 底栏（原站结构）
- [x] CONTACT 按钮 → 本站 `navigate("contact")`

### 5.2 未实现 / 待 1:1 精调（下一轮重点）

- [ ] **职种图标**：原站为复杂 SVG 字标路径，现为单字母 `P/W/D/E/B`
- [ ] **Gooey 光标** / **circleCursor**（SCROLL DOWN / MORE DETAIL）
- [ ] **区块 shift 过渡**：`recruit_positions_shift` 等 7 层 scroll-driven 擦除（原站 GSAP ScrollTrigger）
- [ ] **sectionTitle 逐字**：原站 `transition-delay` 与 scroll-anime 联动更精细
- [ ] **positions 入场**：原站 `rotateX(180deg)` 翻转链 + `is-scroll-anime` 时序
- [ ] **原站字体** `ryo-gothic-plusn`（需授权或相近替代）
- [ ] **CONTACT 浮层**：原站 Astro island `ContactComponents`，本站仅跳转 contact 页
- [ ] **Cookie 条**、**全局 canvas**（`#canvas` 背景粒子）
- [ ] **Recruit footer 与全站 MENU 重复**：是否隐藏 Recruit 内 footer/仅保留内容区（待产品决定）
- [ ] **图片本地化**：`junni.co.jp` CDN 在国内可能加载失败，可下载到 `public/junni/recruit/`
- [ ] **Lenis + ScrollTrigger 同步**：若上 shift 动效，参考 `JunniWorksPage.tsx` / `JunniHero.tsx` 模式

---

## 6. Neu 共存规则（后续改动必读）

> ⚠️ **禁止**为 Recruit 再去改 `html:has(.neu-embed)` 或全局 `neu-host-scale` 例外，除非同步验证 NEU About 全宽绿卡。

**正确做法：**

1. Recruit 样式全部收敛在 `.jrp` 命名空间内。
2. Neu 保持 `Experience.tsx` 内固定包裹：
   ```tsx
   <div className="neu-host-scale">
     <div className="neu-bleed relative left-1/2 w-screen -translate-x-1/2 overflow-x-clip">
       <NeuEmbed />
     </div>
   </div>
   ```
3. `App.tsx` 中 `QuickActions` / `IntroFlip` 在 experience 页单独 `neu-host-scale`。
4. Recruit 根节点 `.jrp` 设 `font-size: 16px`，避免 `html` 62.5% 影响 `em` 间距。

**验证 NEU 是否正常：**

- 滚到 About Neu「将数据的虚像…」段落。
- 绿卡应 **全宽铺满视口**（滚动放大过程中可能有圆角，满幅时无两侧白边）。
- 右下「查看项目作品 / 下载简历」尺寸与插入 Recruit 前一致。

---

## 7. 原站技术栈参考

| 技术 | 用途 |
|------|------|
| Astro | 页面框架 |
| Lenis | 平滑滚动（本站 `SmoothScroll.tsx`） |
| GSAP ScrollTrigger | shift / pin / scrub |
| Swup | 站内路由（本站为 hash 路由） |
| React islands | CONTACT 聊天等 |

Wantedly 制作者访谈：[7年ぶりサイトリニューアル](https://www.wantedly.com/companies/junni/post_articles/922994) — 总合格斗技式技术组合。

---

## 8. 本地开发与排错

```bash
npm run dev      # http://localhost:5173/#/experience
npm run build    # 已通过（2026-06-18）
```

| 现象 | 排查 |
|------|------|
| localhost 打不开 | 看终端是否 `EBUSY` 崩溃；删 `tmp-*`；重启 dev |
| Recruit 图/iframe 空白 | 网络能否访问 `junni.co.jp` / YouTube / vachanavi |
| NEU 两侧白边 | 检查是否误改 `neu.css` / `Experience.tsx` 缩放结构 |
| Recruit 字太小/太大 | 检查是否又把整页套了 `neu-host-scale` |

**抓取原站 HTML（PowerShell）：**

```powershell
Invoke-WebRequest -Uri "https://junni.co.jp/recruit/" -OutFile "tmp-recruit.html" -UseBasicParsing
```

⚠️ 抓取文件请放项目外或确保在 `vite.config.ts` ignore 列表中，**不要**留在根目录未忽略。

---

## 9. 新对话建议起手式

复制给 AI：

```
请阅读 docs/junni-recruit-page-复刻交接.md，继续精调 #/experience 顶部的 Junni Recruit 复刻。
当前优先：[填写，如「职种 SVG 字标」「shift 过渡」「对比原站截图调间距」]
注意：不得破坏 Experience 页下方 NeuEmbed 全宽布局与 QuickActions 缩放。
```

---

## 10. 测试清单（合并前自测）

- [ ] `/#/experience` 首屏为 `RECRUIT` 大标题（非 NEU）
- [ ] 向下滚动能顺序看到：Message → SPECIAL → POSITIONS → OFFICE → TVCM → INTERVIEW → Recruit Footer
- [ ] 继续下滚进入 NEU：Hero 背景字 → About Neu 绿卡全宽 → 后续 Service/Team/Contact
- [ ] 右上 MENU 可打开，「实习经历」高亮
- [ ] 右下 QuickActions 滚动后出现，样式正常
- [ ] 职种链接、JOIN US、访谈 READ MORE 可打开外链
- [ ] CONTACT 跳转 `/#/contact`
- [ ] `npm run build` 无报错

---

## 11. 版权提示

Junni 开源仓库声明：**图片、文案等内容禁止改変・再配布**。本站为个人作品集内嵌展示，素材暂链原站 CDN；若公开发布建议换自有素材或获授权。

---

*文档版本：2026-06-18 · 对应当前工作区 `Experience.tsx` + `recruit-page/*` 首版实现及 NEU 隔离修复后状态。*
