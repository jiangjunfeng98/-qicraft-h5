/* ==========================================
   器韵 QiCraft — App Shell controller
   状态栏时钟 · Tab 高亮 · 点击转场淡出
   （经典脚本，在 body 末尾、模块脚本之前执行）
   ========================================== */
(function () {
  'use strict';

  /* ---- 状态栏实时时钟 ---- */
  function updateClock() {
    var els = document.querySelectorAll('.app-statusbar-time');
    if (!els.length) return;
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var text = h + ':' + (m < 10 ? '0' + m : m);
    els.forEach(function (el) { el.textContent = text; });
  }

  /* ---- Tab 高亮：依据 <body data-page> ---- */
  function highlightTab() {
    var page = document.body.getAttribute('data-page');
    if (!page) return;
    var tab = document.querySelector('.app-tab[data-tab="' + page + '"]');
    if (tab) tab.classList.add('is-active');
  }

  /* ---- Tab 点击：淡出转场再跳转 ---- */
  function bindTabTransitions() {
    var content = document.querySelector('.app-content');
    var tabs = document.querySelectorAll('.app-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        // 当前页 Tab：不跳转
        if (tab.classList.contains('is-active')) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        var href = tab.getAttribute('href');
        if (!href) return;
        if (content) content.classList.add('is-leaving');
        setTimeout(function () {
          window.location.href = href;
        }, 170);
      });
    });
  }

  /* ---- 初始化 Lucide 图标（状态栏 + Tab 栏） ---- */
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function init() {
    highlightTab();
    bindTabTransitions();
    updateClock();
    refreshIcons();
    // 每 30 秒刷新一次时钟
    setInterval(updateClock, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
