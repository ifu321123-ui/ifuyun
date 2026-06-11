import { Jimp } from "jimp"
import { mkdir } from "node:fs/promises"

// 把 Framer 黑底线稿（红色 / 奶油色手绘）抠成透明 PNG，输出到 public/notebook/。
// 思路：按像素最大通道亮度判断——接近黑色 -> 透明，亮线 -> 不透明，中间调线性羽化。
const SRC = "image"
const OUT = "public/notebook"

const JOBS = [
  { in: "zreYWHKtYVvdYwuZm8gBYAa3IiA.jpg", out: "hero.png" }, // 顶页主插画（电脑 + 植物 + 人）
  { in: "rRKteDbgGPSRnYv0ydZFYq7DfI.jpg", out: "plant.png" }, // 底页植物
  { in: "BUQeUkXwalGo0ETntC1tuR9TM.jpg", out: "stump.png" }, // 底页树桩 + 草丛
  { in: "a5uPbmT6PvUwjD3MFRKJ8andRk.jpg", out: "bud.png" }, // 飘带旁红色花苞
  { in: "uNzaxXZLk1aHsF3AXi7f4aGR0g.jpg", out: "juicebox.png" }, // 画布装饰：果汁盒
  { in: "DUDVhZzaglA4vXZTKvTA6gePrU.jpg", out: "godzilla.png" }, // 画布装饰：恐龙
  { in: "qe4YBLLmBViMAbL2fiphUNfdxA.jpg", out: "noodle.png" }, // 画布装饰：拉面
  // 导航 hover 时弹出的手绘小涂鸦（About / Work）
  { in: "nXkHodrIJijHtkJK9tj0meJSo.jpg", out: "navie1.png" }, // 四角星
  { in: "Js58O0WeXiEecnME3wucn8P1Lg.jpg", out: "navie2.png" }, // 笔触
  { in: "so1wZgMvJhjB3P40EWwFAbrMls.jpg", out: "navie3.png" }, // 卷曲笔画
  { in: "5kwx3ViaHeW5I6KliMS9bsYa0U.jpg", out: "navie4.png" }, // 记事本
  { in: "klvZtuhjeLBrHRuCnpOubsPLgI.jpg", out: "navie5.png" }, // 小标记
  // 底页三张便利贴底图
  { in: "rhT0iPheLHJdGQAZ04lGqNb0I.jpg", out: "note-lined.png" },
  { in: "0aKOwaR29QHg04I7MHlsi9j1g4.jpg", out: "note-grid.png" },
  { in: "m0nSd9OmKrRp1nvRHVH89tLs0mg.jpg", out: "note-sticky.png" },
]

const LOW = 32 // 低于此亮度 -> 完全透明
const HIGH = 80 // 高于此亮度 -> 完全不透明，区间内线性羽化

await mkdir(OUT, { recursive: true })

for (const job of JOBS) {
  const img = await Jimp.read(`${SRC}/${job.in}`)
  const { data, width, height } = img.bitmap
  for (let i = 0; i < data.length; i += 4) {
    const lum = Math.max(data[i], data[i + 1], data[i + 2])
    let alpha
    if (lum <= LOW) alpha = 0
    else if (lum >= HIGH) alpha = 255
    else alpha = Math.round(((lum - LOW) / (HIGH - LOW)) * 255)
    data[i + 3] = alpha
  }
  await img.write(`${OUT}/${job.out}`)
  console.log(`OK ${OUT}/${job.out} (${width}x${height})`)
}
