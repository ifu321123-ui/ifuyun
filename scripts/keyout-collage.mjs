import { Jimp } from "jimp"
import { mkdir } from "node:fs/promises"

// 拼贴素材白底/浅灰底抠透明：按与白色的距离 + 低饱和度判断。
const OUT = "public/notebook"

const JOBS = [
  { file: "collage-lined.png", low: 6, high: 28 },
  { file: "collage-clip.png", low: 4, high: 24 },
  { file: "collage-star.png", low: 4, high: 22, gray: true },
]

function alphaFromBackground(r, g, b, { low, high, gray }) {
  const distWhite = Math.hypot(255 - r, 255 - g, 255 - b)
  const maxC = Math.max(r, g, b)
  const minC = Math.min(r, g, b)
  const sat = maxC - minC
  const lum = 0.299 * r + 0.587 * g + 0.114 * b

  let bgScore = distWhite

  // 浅灰底（星星图）与近白底统一按「高亮 + 低饱和」处理
  if (lum > 165 && sat < 35) {
    bgScore = Math.min(bgScore, (255 - lum) * 0.7 + sat * 0.6)
  }
  if (gray && lum > 150 && sat < 40) {
    bgScore = Math.min(bgScore, (255 - lum) * 0.85)
  }

  if (bgScore <= low) return 0
  if (bgScore >= high) return 255
  return Math.round(((bgScore - low) / (high - low)) * 255)
}

await mkdir(OUT, { recursive: true })

for (const job of JOBS) {
  const path = `${OUT}/${job.file}`
  const img = await Jimp.read(path)
  const { data, width, height } = img.bitmap

  for (let i = 0; i < data.length; i += 4) {
    const alpha = alphaFromBackground(data[i], data[i + 1], data[i + 2], job)
    data[i + 3] = alpha
  }

  await img.write(path)
  console.log(`OK ${path} (${width}x${height})`)
}
