/**
 * 兼容旧版 index.html 的 script 引用（?v= 仅用于 CDN 缓存刷新）。
 * 禁止任何 location.reload / replace —— 只做 touch-static 与清理残留 session。
 */
;(function () {
  var embedded = /MicroMessenger|QQ\//i.test(navigator.userAgent || "")
  var touch =
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    window.matchMedia("(max-width: 768px)").matches ||
    "ontouchstart" in window ||
    (embedded && "ontouchstart" in window)

  if (touch) document.documentElement.classList.add("touch-static")

  try {
    for (var i = sessionStorage.length - 1; i >= 0; i--) {
      var key = sessionStorage.key(i)
      if (key && key.indexOf("app:embedded") === 0) sessionStorage.removeItem(key)
    }
    sessionStorage.removeItem("app:bfcache-reload-guard")
  } catch (_e) {}
})()
