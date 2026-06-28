/* ==========================================
   器韵 QiCraft — Swipe / Drag helper
   触摸滑动 + 鼠标拖拽 + 键盘左右键
   适用于图片轮播与器物翻页
   ========================================== */

/**
 * 绑定横向滑动手势。
 * @param {HTMLElement} el 监听元素
 * @param {Object} handlers { onLeft, onRight, threshold }
 *   - onLeft:  向左滑（下一项）
 *   - onRight: 向右滑（上一项）
 */
export function attachSwipe(el, { onLeft, onRight, threshold = 50 } = {}) {
  if (!el) return;
  let startX = 0;
  let startY = 0;
  let active = false;

  const down = (x, y) => {
    startX = x;
    startY = y;
    active = true;
  };

  const up = (x, y) => {
    if (!active) return;
    active = false;
    const dx = x - startX;
    const dy = y - startY;
    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) onLeft && onLeft();
      else onRight && onRight();
    }
  };

  // 触摸
  el.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    down(t.clientX, t.clientY);
  }, { passive: true });
  el.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    up(t.clientX, t.clientY);
  }, { passive: true });

  // 鼠标拖拽
  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down(e.clientX, e.clientY);
  });
  el.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'mouse') return;
    up(e.clientX, e.clientY);
  });
  el.addEventListener('pointercancel', () => { active = false; });
  el.addEventListener('pointerleave', () => { active = false; });
}

/**
 * 绑定键盘左右键监听（作用于 document）。
 * @param {Object} handlers { onLeft, onRight }
 */
export function attachKeyArrows({ onLeft, onRight } = {}) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') onRight && onRight();   // ← 上一项
    else if (e.key === 'ArrowRight') onLeft && onLeft(); // → 下一项
  });
}
