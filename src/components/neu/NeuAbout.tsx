import { usePinProgress } from "./useNeuScroll"

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
// 放大行程：在钉住进度推进到此比例时，卡片恰好放大到满幅（图五临界值）。
// 之后钉住随即释放，进入「整段向上滚出 → 露出 Neu.Inc」的自然滚动。
const SCALE_END = 0.92

/**
 * About（蓝色卡片）—— 复刻 neu-ad.jp 的「钉住缩放」转场。
 *
 * 外层 section 高于视口，内部 sticky 满屏舞台钉住卡片：
 *   1) 放大阶段（progress 0 → SCALE_END）：白色 KV 幕布铺满，蓝色卡片以
 *      底边为锚点从视口下方「升起 + 放大」——下沉量随滚动归零、scale 0.9→1、
 *      圆角 44→0，与放大同步向上移动（即用户描述的「放大和位置移动同时进行」）。
 *      期间白色幕布在末段淡出，模拟卡片浮于白色 KV 之上、最终铺满。
 *   2) 临界点（图五）：卡片放大到满幅、钉在固定位置，尺寸不再变化。
 *   3) 之后（progress → 1，钉住释放）：尺寸锁定，整段随滚动继续向上移出视窗，
 *      自然露出下方的 Neu.Inc 像素区（图六、图七），衔接下一段视觉。
 */
export default function NeuAbout() {
  const { ref, progress } = usePinProgress<HTMLDivElement>()

  const grow = clamp01(progress / SCALE_END)
  // easeOutCubic：起步快、收尾稳，放大手感更接近原站。
  const eased = 1 - Math.pow(1 - grow, 3)

  // 放大与上移同步：底边锚点 + 下沉量随进度归零。
  // 起始把卡片压到视口下方露出白色 KV，但保留标题在下方可见（图二）。
  const drop = (1 - eased) * 34 // vh
  const scale = 0.9 + 0.1 * eased
  const radius = 44 * (1 - eased)

  return (
    <section ref={ref} className="neu-about" id="neu-about" data-neu-section="about" data-neu-dark>
      <div className="neu-about__pin">
        <div
          className="neu-about__card"
          style={{ transform: `translateY(${drop}vh) scale(${scale})`, borderRadius: `${radius}px` }}
        >
          <div className="neu-wrap neu-about__inner">
            <span className="neu-eyebrow">( About Neu )</span>
            <h2 className="neu-about__title">将“数据的虚像”，转化为港口的孪生。</h2>
            <p className="neu-about__body">
              成都四方伟业 · 盐田港数字孪生项目。在数字孪生与大模型的激流中，我们拒绝浮夸的视效，专注全域态势感知的硬核落地。在盐田国际集装箱码头的巨型坐标系下，我们通过三维重构与智能监管，重塑港口的生产力。绝不只是画面的复刻，而是将数据治理、智慧告警与危险品总览完美融合。在瞬息万变的数据流中，捕捉传统港口向精细化管理转型的每一次脉搏。
            </p>
            <div className="neu-about__cta">
              <a className="neu-pill" href="https://www.yict.com.cn/index.html?locale=zh_CN" target="_blank" rel="noopener noreferrer">了解盐田港</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
