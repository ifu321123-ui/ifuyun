# 滚动驱动视频网站 · 实现方案

> 参考效果：电影感背景视频 + 滚动驱动播放（scrollytelling），文字分章节叠加淡入。
> 目标风格：黑底白字、极简、电影感（参考 `王十三 / Ethan Wang - Studio`）。

---

## 1. 效果定义

核心是 **Scroll-driven Video Scrubbing（滚动驱动视频）**：

- 视频不自动播放，**滚动条 = 视频进度条**。往下滚视频前进，往上滚视频倒退，停下定格。
- 背景视频全屏固定（`position: fixed`），始终铺满视口。
- 文字分章节叠加在视频上，随滚动 **淡入 / 上移 / pin（钉住）/ 淡出**。
- 整体一镜到底，没有传统"翻页"，而是一条连续的滚动叙事线。

---

## 2. 技术选型（基于现有项目）

现有依赖已齐全，**无需新增**：

| 库 | 作用 |
|---|---|
| `gsap` + `ScrollTrigger` | 驱动视频进度、pin 文字、章节动画时间线 |
| `lenis` | 平滑滚动（scrubbing 的前提，否则画面顿挫） |
| `react` 19 + `vite` | 组件化页面 + 开发构建 |
| `tailwindcss` 4 | 布局与样式 |
| `lucide-react` | 图标（箭头、播放键等） |
| `clsx` / `tailwind-merge` | 条件类名 |

### 视频驱动的两种方案

| 方案 | 原理 | 优点 | 缺点 | 建议 |
|---|---|---|---|---|
| **A. `<video>` + currentTime** | 滚动改 `video.currentTime` | 文件小、实现快 | 移动端/Safari 拖拽不够帧精确，可能卡 | 一期先用 |
| **B. 图片序列帧 + canvas** | 视频拆成 N 张 jpg，滚动画到 canvas | 帧精确、全平台丝滑（Apple 官方做法） | 素材大、需预加载 | 追求极致体验时升级 |

> 落地策略：**先用方案 A 跑通整套机制和章节叙事**，验证体验后，如需更丝滑（尤其移动端）再把背景层切换为方案 B（业务逻辑/章节代码不变，只换驱动层）。

---

## 3. 滚动 ↔ 视频 ↔ 章节 的映射模型

把整个页面想成一条 0% → 100% 的滚动进度轴：

```
滚动进度  0% ───────────────────────────────────────────── 100%
视频进度  0s ───────────────────────────────────────────── 末尾
章节      [Hero][理念][章节01][章节02][精选作品][结尾CTA]
文字状态   淡入   pin     pin      pin       pin       淡入
```

- **全局**：一个超高的滚动容器（如 `600vh`）作为"滚动跑道"。`ScrollTrigger` 把 `scroll 0→1` 线性映射到 `video.currentTime 0→duration`。`scrub: true` 让视频跟手。
- **每个章节**：各自一个 `ScrollTrigger`，在自己负责的滚动区间里 pin 住文字，并做 进入淡入 / 离开淡出。
- 章节区间和视频时间点要**对齐内容**（例如视频里"漂浮特写"出现时，正好显示作品介绍文字）。

---

## 4. 页面章节结构（按视频还原 + 可替换为你的内容）

> 文案为占位示例，正式上线请替换为你自己的内容。

### 00 · Hero（开场）
- 顶部导航：`Logo｜WORK｜STUDIO｜WRITING｜CONTACT｜[ENTER STUDIO]`
- 大标题 + 播放键图标（点击可全屏播放原片，可选）
- 进入提示（向下滚动指引）

### 01 · 理念 / Statement
- 主文案（示例）：`By day, I build AI agents.` / `By night, I make AI art.` / `Same machine. Different rules.`
- 右侧浮出 **名片卡**（头像 + 头衔 + `READ THE STORY →`）
- 右上角小字：`AI agent engineer. / AIGC artist. / A studio of one.`

### 02 · 章节页 A（经历 / About）
- 角标：`CHAPTER 03 / 05`、`OBJECT — WORK`
- 大字时间轴：`2018 — 2022`
- 巨型标题：`OXFORD`，副标题 `University of Oxford`
- 描述：`Where I learned to slow down.` + 一段小字

### 03 · 章节页 B（转向 / Translate）
- 章节号：`04`，`CHAPTER 04 / 05`
- 巨型标题：`TRANSLATE`，副标题 `From code to canvas`
- 描述：`Stopped chasing metrics. Started chasing taste.`

### 04 · 精选作品 / Featured Work
- 左侧作品封面卡（示例 `PROMPT EARTH` 海报）
- 右侧：标题 `Prompt Earth` + 一句话 `One line to save the Earth` + 分类标签
- 角标：`01 / 01`、年份

### 05 · 结尾 CTA / Footer
- 大标题：`Ready to look again?` + `[SCROLL BACK] [→]`
- 页脚多列导航：`WORK / WRITING / STUDIO / INDEX` 等
- 版权行 + 回到顶部

> 章节数量、文案、配图都可增减。建议正式内容控制在 **4–6 屏**，叙事清晰不冗长。

---

## 5. 组件结构规划

```
src/
├─ App.tsx                      # 组装所有章节 + 全局滚动容器
├─ index.css                    # 全局/Tailwind/字体
├─ hooks/
│  ├─ useLenis.ts               # 初始化 Lenis 平滑滚动，接入 GSAP ticker
│  └─ useScrollVideo.ts         # 核心：滚动进度 → video.currentTime
├─ components/
│  ├─ ScrollVideoBackground.tsx # 固定背景视频层（方案A；后续可换B）
│  ├─ Nav.tsx                   # 顶部导航
│  ├─ sections/
│  │  ├─ Hero.tsx
│  │  ├─ Statement.tsx          # 理念 + 名片卡
│  │  ├─ ChapterTimeline.tsx    # 通用章节页（OXFORD / TRANSLATE 复用，传 props）
│  │  ├─ FeaturedWork.tsx
│  │  └─ FooterCTA.tsx
│  └─ ui/                       # 角标、按钮、卡片等小组件
└─ data.ts                      # 章节文案/作品数据集中配置（便于替换）
```

要点：
- **章节页做成可配置组件**（`ChapterTimeline`），靠 `data.ts` 传入年份/标题/描述，避免重复代码。
- **所有文案/图片走 `data.ts`**，你替换内容时不碰逻辑。

---

## 6. 关键实现要点

1. **平滑滚动接管**：用 Lenis，并把 Lenis 的 `raf` 接到 GSAP `ticker`，关闭 `lerp` 抖动，保证视频 scrubbing 跟手不顿挫。
2. **视频解码就绪**：监听 `loadedmetadata` 拿到 `duration`；首帧 `video.pause()` 后手动 `currentTime` 控制。iOS 需要 `muted`、`playsInline`、`preload="auto"`。
3. **scrub 平滑**：`ScrollTrigger` 用 `scrub: 1`（带一点缓冲）让视频追赶滚动，更顺。
4. **章节 pin 与淡入**：每个 section 用独立 `ScrollTrigger`，`pin: true` + timeline 控制透明度/位移。注意 pin 会改变文档流，需用 `pinSpacing` 或统一在一个固定层里绝对定位文字。
5. **层级**：背景视频 `z-0 fixed`，文字层 `z-10`，导航 `z-20`。
6. **响应式**：移动端视频用 `object-fit: cover`，文字尺寸用 `clamp()`；考虑给移动端降级（见第 8 节）。
7. **清理**：React 19 严格模式下，`useEffect` 里创建的 ScrollTrigger / Lenis 必须在 cleanup 里 `kill()`，防止重复绑定。

---

## 7. 素材规格清单（你需要准备）

**必须：**
- [ ] **背景视频原片**：横屏 `1920×1080`，时长 `10–40s`，`H.264 mp4`，画面偏暗、主体居中留出压字空间。
      - 来源：自拍/自剪，或 AI 生成（Runway / Kling / Sora 等）。
- [ ] **各章节文案**：每屏的标题 / 副标题 / 描述（替换第 4 节占位文案）。

**建议：**
- [ ] 名片卡素材：头像图 + 头衔文字 + 跳转链接。
- [ ] 精选作品配图：封面图（如海报）+ 标题 + 一句话简介 + 分类标签。
- [ ] 品牌信息：站名 / Logo / 导航项 / 主色（默认纯黑底白字）。

**可选：**
- [ ] 字体偏好（默认走极简无衬线，如 Inter / Helvetica）。
- [ ] 若上方案 B：可由我用 ffmpeg 把视频拆成序列帧（已具备工具）。

---

## 8. 性能与降级

- **视频体积**：方案 A 建议 mp4 控制在 ~10MB 内（参考片约 12MB / 38s）。过大用 `preload` + loading 态。
- **方案 B 预加载**：序列帧需在进入前预加载，配进度条/骨架屏，避免白屏。
- **移动端降级**：低端机或 `prefers-reduced-motion` 时，可退化为"自动播放循环视频 + 普通滚动文字"，不做 scrubbing。
- **首屏**：视频未就绪前显示首帧静态图或纯黑占位，避免 layout shift。
- **可访问性**：尊重 `prefers-reduced-motion`；关键文案不仅存在于视频里，确保可被读取。

---

## 9. 实施阶段建议

1. **阶段一 · 机制验证**：Lenis + GSAP + 占位视频，跑通"滚动驱动视频 + 一段文字 pin 淡入"。
2. **阶段二 · 章节搭建**：按第 4 节做出全部章节骨架，文案走 `data.ts` 占位。
3. **阶段三 · 内容替换**：换入你的真视频、文案、作品图。
4. **阶段四 · 打磨**：响应式、过渡曲线、性能、移动端降级。
5. **阶段五（可选）· 升级方案 B**：背景层换成序列帧 canvas，提升丝滑度。

---

## 10. 待你确认的决策点

- 视频素材你自己提供，还是先用占位片开发？
- 章节数量与文案，按视频还原，还是给我你的真实内容？
- 是否需要支持移动端 scrubbing（影响是否上方案 B）？
- 配色/字体是否沿用极简黑白，还是有品牌色？
