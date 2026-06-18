import * as THREE from "three"

/** Shared drumroll geometry — junni.co.jp home_works + /works/ drumroll (CDP 实测). */
export const STEP_DEG = 25
export const FRONT_DEG = 0
export const DEG2RAD = Math.PI / 180
export const STEP_RAD = STEP_DEG * DEG2RAD
export const PERSPECTIVE = 500
/** `.home_works_image` / `.works_drumroll_image` @ 573×626 / 1440×900 CDP. */
export const PANEL_DEG = 51.1
export const PANEL_RAD = PANEL_DEG * DEG2RAD
export const PANEL_ASPECT = 16 / 9
export const PANEL_FADE_DEG = 18
export const PANEL_VISIBLE_DEG = 58
export const VISIBLE_THETA_DEG = 58
export const PANEL_MAX_WIDTH = 900
export const SPIN_SIGN = 1
export const TEX_ROTATION = -Math.PI / 2

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function workDrumrollSrc(work: { drumrollImage?: string; image: string }) {
  return work.drumrollImage ?? work.image
}

export function splitDrumrollText(text: string) {
  return Array.from(text).map((char) => (char === " " ? "\u00A0" : char))
}

/** Texture is rotated 90° on the drum panel — use displayed aspect after rotation. */
export function fitTextureCover(tex: THREE.Texture, sourceAspect: number, targetAspect: number) {
  const displayedAspect = sourceAspect > 0 ? 1 / sourceAspect : 1
  let repeatX = 1
  let repeatY = 1
  let offsetX = 0
  let offsetY = 0

  if (displayedAspect > targetAspect) {
    repeatX = targetAspect / displayedAspect
    offsetX = (1 - repeatX) * 0.5
  } else {
    repeatY = displayedAspect / targetAspect
    offsetY = (1 - repeatY) * 0.5
  }

  tex.repeat.set(repeatX, repeatY)
  tex.offset.set(offsetX, offsetY)
}

/** Mirrors `.home_works_image` / `.works_drumroll_image { width:min(90vw,900px); aspect-ratio:16/9 }`. */
export function computePanelBox(vw: number) {
  const width = Math.min(vw * 0.9, PANEL_MAX_WIDTH)
  const height = width * (9 / 16)
  return { width, height }
}

/** Cylinder orbit radius so front panel height matches the 16:9 viewport box. */
export function computeDrumRadius(vw: number) {
  const { height } = computePanelBox(vw)
  return height / PANEL_RAD
}

/** home_works only — CDP: R ≈ vh×0.52 (327@626、387@744). Portfolio drumroll uses computeDrumRadius. */
export function computeHomeWorksRadius(vh: number) {
  return clamp(vh * 0.52, 220, 520)
}

/** DOM item opacity from angular distance (shared home_works + drumroll). */
export function drumrollItemOpacity(absTheta: number, titleFade = 1) {
  if (absTheta >= VISIBLE_THETA_DEG || titleFade <= 0.02) return 0
  return clamp(1 - (absTheta - 46) / 14, 0, 1) * titleFade
}

export function drumrollItemVisible(absTheta: number, titleFade = 1) {
  return absTheta < VISIBLE_THETA_DEG && titleFade > 0.02
}

/** WebGL panel brightness from angular distance. */
export function drumrollPanelBrightness(absEffDeg: number, canvasFade = 0) {
  const t = clamp(1 - absEffDeg / PANEL_FADE_DEG, 0, 1)
  const b = 0.1 + t * t * 0.9
  return b * (1 - canvasFade)
}
