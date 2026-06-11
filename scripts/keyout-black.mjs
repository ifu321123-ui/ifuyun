import { Jimp } from "jimp"

// 把黑底红色线稿抠成透明 PNG：按亮度把接近黑色的像素设为透明，并对中间调羽化。
const JOBS = [
  { in: "public/deco-bear.jpg", out: "public/deco-bear.png" },
  { in: "public/deco-plant.jpg", out: "public/deco-plant.png" },
]

const LOW = 38 // 低于此亮度 -> 完全透明
const HIGH = 95 // 高于此亮度 -> 完全不透明，区间内线性羽化

for (const job of JOBS) {
  const img = await Jimp.read(job.in)
  const { data, width, height } = img.bitmap
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const lum = Math.max(r, g, b)
    let alpha
    if (lum <= LOW) alpha = 0
    else if (lum >= HIGH) alpha = 255
    else alpha = Math.round(((lum - LOW) / (HIGH - LOW)) * 255)
    data[i + 3] = alpha
  }
  await img.write(job.out)
  console.log(`✓ ${job.out} (${width}x${height})`)
}
