import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"

const base = "https://www.gunze.co.jp/130th/assets/images/"
const outRoot = "public/gunze"

const assets = [
  "mv-txt.gif",
  "mv-question-body.svg",
  "mv-looptxt01.svg",
  "mv-looptxt02.svg",
  "mv-looptxt03.svg",
  "mv-looptxt04.svg",
  "eye-base-border.svg",
  "eye-mabataki.svg",
  "eye-shirome.svg",
  "eye-base-circle.svg",
  "eye-star.svg",
  "movie-comingsoon.jpg",
  "movie-main01.jpg",
  "movie-main02.jpg",
  "movie-main03.jpg",
  "movie-main04.jpg",
  "movie-main05.jpg",
  "movie-main06.jpg",
  "movie-main07.jpg",
  "movie-main08.jpg",
  "movie-main09.jpg",
  "movie-main10.jpg",
  "movie-main11.jpg",
  "movie-main12.jpg",
  "movie-webcm01.jpg",
  "movie-webcm02.jpg",
  "movie-line-border-right-pc.png",
  "movie-line-border-right-sp.png",
  "movie-line-border-left-pc.png",
  "movie-line-border-left-sp.png",
  "ceo-img.jpg",
  "ceo-img-sp.jpg",
  "ceo-img-mouseon.jpg",
  "illust/history01-body.png",
  "illust/history01-book.png",
  "illust/history01-page.png",
  "illust/history01-face.png",
  "illust/history01-hand-l.png",
  "illust/history01-hand-r.png",
  "illust/history02-body.png",
  "illust/history02-face.png",
  "illust/history02-arm-l.png",
  "illust/history02-arm-r.png",
  "illust/history02-ito.png",
  "illust/history02-item.png",
  "illust/history02-hand-l.png",
  "illust/history02-hand-r.png",
  "illust/history03-body.png",
  "illust/history03-face.png",
  "illust/history03-cloth.png",
  "illust/history03-machine.png",
  "illust/history03-hand-l.png",
  "illust/history03-hand-r.png",
  "illust/med01-body.png",
  "illust/med01-face.png",
  "illust/med01-item.png",
  "illust/med01-hand-l.png",
  "illust/med01-hand-r.png",
  "illust/apparel-body.png",
  "illust/apparel-face.png",
  "illust/apparel-cloth.png",
  "illust/apparel-machine.png",
  "illust/apparel-hand-l.png",
  "illust/apparel-hand-r.png",
  "illust/life01.png",
  "illust/life02.png",
  "illust/life03-machine.png",
  "illust/life03-hand-l.png",
  "illust/life03-foot-l.png",
  "illust/life03-foot-r.png",
  "illust/life03-body.png",
  "illust/life03-hand-r.png",
  "illust/life03-face.png",
  "illust/life04.png",
  "illust/sol01-hand-l.png",
  "illust/sol01-body.png",
  "illust/sol01-hand-r.png",
  "illust/sol01-face.png",
  "illust/sol02.png",
  "illust/factory01.png",
]

async function download(path) {
  const url = new URL(path, base)
  const output = join(outRoot, path)
  const response = await fetch(url)

  if (!response.ok) {
    console.warn(`skip ${path}: ${response.status}`)
    return false
  }

  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, Buffer.from(await response.arrayBuffer()))
  console.log(`saved ${path}`)
  return true
}

let ok = 0
for (const asset of assets) {
  if (await download(asset)) ok += 1
}

console.log(`done: ${ok}/${assets.length}`)
