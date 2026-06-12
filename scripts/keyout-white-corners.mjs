import { copyFile } from "node:fs/promises"

// 用户新提供的底页两角装饰（柔和珊瑚红手绘，已自带透明通道）。
// 源 PNG 已经是干净的透明线稿，直接复制覆盖即可，无需再抠图。
const JOBS = [
  {
    in: "C:\\Users\\ifu.云\\.cursor\\projects\\d-vibecoding-cursor-vibecoding-web\\assets\\c__Users_ifu.__AppData_Roaming_Cursor_User_workspaceStorage_6f6a39075212d8c661879acf81187b24_images_BUQeUkXwalGo0ETntC1tuR9TM-f2f99677-2e27-455f-88a9-e1d0a6acf5ff.png",
    out: "public/notebook/stump.png",
  },
  {
    in: "C:\\Users\\ifu.云\\.cursor\\projects\\d-vibecoding-cursor-vibecoding-web\\assets\\c__Users_ifu.__AppData_Roaming_Cursor_User_workspaceStorage_6f6a39075212d8c661879acf81187b24_images_rRKteDbgGPSRnYv0ydZFYq7DfI-871c8445-8652-4e37-b080-374a04165780.png",
    out: "public/notebook/plant.png",
  },
]

for (const job of JOBS) {
  await copyFile(job.in, job.out)
  console.log(`OK ${job.out}`)
}
