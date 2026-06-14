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
  // 白色幕布（含缠绕大图）在放大末段淡出，让临界点后成为纯蓝连续滚动。
  const veil = 1 - clamp01((grow - 0.62) / 0.38)

  return (
    <section ref={ref} className="neu-about" id="neu-about" data-neu-section="about" data-neu-dark>
      <div className="neu-about__pin">
        <div className="neu-about__veil" style={{ opacity: veil }} aria-hidden>
          <img src="/neu/neu-hero-swirl.png" alt="" />
        </div>
        <div
          className="neu-about__card"
          style={{ transform: `translateY(${drop}vh) scale(${scale})`, borderRadius: `${radius}px` }}
        >
          <div className="neu-wrap neu-about__inner">
            <span className="neu-eyebrow">( About Neu )</span>
            <h2 className="neu-about__title">“広告への愛”を、偉大な成果に。</h2>
            <p className="neu-about__body">
              Neu Inc.はSNS領域における映像コンテンツの広告運用を強みとした、成果報酬型広告運用チーム。メンバー全員が広告への愛を持ち、泥臭いPDCAの中で、論理だけでなく、直感的な言葉選び・テンポなどのニュアンスを徹底的に考察し、描いた絵図を攻略することを楽しむ。その純粋な”広告への愛”が、日々液体のように変化し続ける広告アルゴリズムに順応し成果出せる秘訣です。そうして偉大な成果に繋げていく、広告オタク集団ノイです。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
