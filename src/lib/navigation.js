/* ==========================================
   器韵 QiCraft — Navigation helpers
   页面间跳转 · URL 参数 · Lucide 图标初始化
   ========================================== */

/** 读取 URL 查询参数 */
export function getQueryParam(name, fallback = '') {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || fallback;
}

/** 跳转到器物详情 */
export function goToDetail(id) {
  if (!id) return;
  window.location.href = `artifact-detail.html?id=${encodeURIComponent(id)}`;
}

/** 跳转到窑口志 */
export function goToKiln(kiln) {
  window.location.href = `kiln-chronicle.html?kiln=${encodeURIComponent(kiln || '汝瓷')}`;
}

/** 返回首页（可携带当前窑口筛选） */
export function goToHome(kiln) {
  const q = kiln && kiln !== '全部' ? `?kiln=${encodeURIComponent(kiln)}` : '';
  window.location.href = `index.html${q}`;
}

/** 安全返回：有历史则 history.back()，否则回首页 */
export function backOrHome() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    goToHome();
  }
}

/** 初始化 Lucide 图标（CDN 全局对象） */
export function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}
