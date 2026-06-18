const JUNNI = "https://junni.co.jp"

export const RECRUIT_PAGE_TITLE = "RECRUIT"

export const RECRUIT_THEME_MOBILE = "楽しむ心で生みだす最高のクリエイティブ"
export const RECRUIT_THEME_DESKTOP = ["楽しむ心で生みだす", "最高のクリエイティブ"] as const

export const RECRUIT_MESSAGE_CHARS =
  "ジュニでは、アソビゴコロを持ち、最先端のテクノロジーに興味があるメンバーを常時募集しています。自由な発想と挑戦する気持ちで、最高のクリエイティブを生み出す。楽しみながら、真剣に、挑戦し続ける毎日が待っています。ジュニの仲間と共に、世界を驚かせる\"体験\"を一緒に作りましょう。"

export const RECRUIT_SPECIAL = {
  title: "ヴイアラ公式×JUNNIコラボ配信\nアーカイブ公開中",
  youtube: "https://www.youtube.com/embed/kZx-uWnoWYk?si=1nSAZx8m1aMTRqmu",
  text: "ジュニがモノづくりに対してどれだけ熱量高く、クライアントとワンチームで取り組んでいるか、実例と合わせて社長の想いもお届けしています。",
} as const

export const RECRUIT_POSITIONS = [
  {
    label: "Planner",
    href: "https://herp.careers/v1/junni/requisition-groups/817c6f85-7c0e-4b37-bb02-fd9989fffe76",
    letter: "P",
  },
  {
    label: "Web Director",
    href: "https://herp.careers/v1/junni/requisition-groups/6c0a48b2-97f0-49b9-9957-a2f209bfa5e8",
    letter: "W",
  },
  {
    label: "Designer",
    href: "https://herp.careers/v1/junni/requisition-groups/3b39d6ab-a712-40de-aa58-6c03733c028a",
    letter: "D",
  },
  {
    label: "Engineer",
    href: "https://herp.careers/v1/junni/requisition-groups/83f08bdc-85a2-4461-a153-067f2af759fe",
    letter: "E",
  },
  {
    label: "Back Office",
    href: "https://herp.careers/v1/junni/requisition-groups/bffcc04c-4a2e-45e3-939d-1c9cbb34cd18",
    letter: "B",
  },
] as const

export const RECRUIT_JOIN_US = "https://herp.careers/v1/junni"

export const RECRUIT_PITCH = {
  iframe: "https://speakerdeck.com/player/926606fedafd4ec485919212581f1e34",
  text: "ジュニの理念や価値基準などジュニの情報を簡潔にまとめた採用ピッチ資料です。ジュニに興味をお持ちの方は是非一度ご覧ください。",
} as const

export const RECRUIT_OFFICE = {
  tour: "https://tour.vachanavi.net/tour-afe7a08e723149209955f847e12cb0ab",
  text: "エントランスや執務エリア、休憩エリアなど、画面上でGoogleMAPのようにオフィス内を移動したり、360度全てご覧いただけます。",
  images: Array.from({ length: 12 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0")
    return `${JUNNI}/assets/images/recruit/office/${n}.jpg`
  }),
} as const

export const RECRUIT_TVCM = {
  youtube: "https://www.youtube.com/embed/EnyUkPlSATI?si=2k15RQgcUx_amOXh&controls=0",
} as const

export const RECRUIT_INTERVIEWS = [
  {
    member: "Designer / Fukasawa",
    num: "#3",
    image: `${JUNNI}/assets/images/recruit/interview/3.jpg`,
    href: "https://www.wantedly.com/companies/junni/post_articles/290039",
    heading: "ジュニの中の人インタビュー #3",
    title: "「こんなに楽しい仕事って他にない」",
  },
  {
    member: "Frontend Engineer / Nakamura",
    num: "#7",
    image: `${JUNNI}/assets/images/recruit/interview/7.jpg`,
    href: "https://www.wantedly.com/companies/junni/post_articles/313627",
    heading: "ジュニの中の人インタビュー #7",
    title: "「思いを知ることがモチベーションになる。」",
  },
  {
    member: "Backend Engineer / Hashimoto",
    num: "#11",
    image: `${JUNNI}/assets/images/recruit/interview/11.jpg`,
    href: "https://www.wantedly.com/companies/junni/post_articles/340145",
    heading: "ジュニの中の人インタビュー #11",
    title: "「宮崎⇆東京でエンジニアと神主、どちらも本業として妥協しない働き方」",
    titleHtml: true,
  },
  {
    member: "Web Director / Takahashi",
    num: "#13",
    image: `${JUNNI}/assets/images/recruit/interview/13.jpg`,
    href: "https://www.wantedly.com/companies/junni/post_articles/546103",
    heading: "ジュニの中の人インタビュー #13",
    title: "「クライアントの熱い想いを受け止め、期待を超え続けたい」",
  },
] as const

export const RECRUIT_WANTEDLY = "https://www.wantedly.com/companies/junni"
export const RECRUIT_WANTEDLY_LOGO_FRONT = `${JUNNI}/assets/images/recruit/wantedly_front.svg`
export const RECRUIT_WANTEDLY_LOGO_BACK = `${JUNNI}/assets/images/recruit/wantedly_back.svg`
export const RECRUIT_FOOTER_LOGO = `${JUNNI}/assets/images/footer_logo.svg`

export const RECRUIT_FOOTER_NAV = [
  { label: "TOP", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "WORKS", href: "/works" },
  { label: "SERVICE", href: "/service" },
  { label: "RECRUIT", href: "/recruit" },
  { label: "CONTACT", href: null },
] as const

export const RECRUIT_SNS = [
  { label: "X", href: "https://twitter.com/junni_jp" },
  { label: "facebook", href: "https://www.facebook.com/junni.jp" },
  { label: "Instagram", href: "https://www.instagram.com/junni_jp/?hl=ja" },
  { label: "note", href: "https://note.com/junni_jp" },
] as const
