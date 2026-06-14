import { usePinProgress } from "./useNeuScroll"

/**
 * About（蓝色卡片）—— 复刻 neu-ad.jp 的「钉住缩放」转场。
 *
 * 外层 section 高于视口，内部 sticky 满屏舞台钉住卡片：
 *   1) 进入阶段：卡片从「窄卡片」(scale 0.8、圆角大) 随滚动放大到满幅；
 *      期间白色幕布 + 缠绕大图作为背景（呼应原站卡片浮于 KV 之上）。
 *   2) 放大到位后：卡片维持满幅（钉在固定位置）。
 *   3) 继续滚动：整段滚出视窗，露出后续蓝色内容（Neu.Inc 像素区）。
 */
export default function NeuAbout() {
  const { ref, progress } = usePinProgress<HTMLDivElement>()

  // 放大主要发生在前 72% 行程；之后维持满幅，再随 section 滚走。
  const grow = Math.min(1, progress / 0.72)
  const scale = 0.8 + 0.2 * grow
  const radius = 60 - 36 * grow
  // 白色幕布（含缠绕大图）随放大淡出，让满幅时背景与卡片同为纯蓝、无缝衔接下一段。
  const veil = 1 - Math.min(1, progress / 0.6)

  return (
    <section ref={ref} className="neu-about" id="neu-about" data-neu-section="about" data-neu-dark>
      <div className="neu-about__pin">
        <div className="neu-about__veil" style={{ opacity: veil }} aria-hidden>
          <img src="/neu/neu-hero-swirl.png" alt="" />
        </div>
        <div
          className="neu-about__card"
          style={{ transform: `scale(${scale})`, borderRadius: `${radius}px` }}
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
