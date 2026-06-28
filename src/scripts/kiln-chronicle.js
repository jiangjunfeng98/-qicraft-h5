/* ==========================================
   窑口志 · 交互
   - URL ?kiln= 读取窑口
   - 渲染 Hero / 代表性器物 / 章节 / 工序流 / 关联器物
   - 返回 · 跳转详情 · 跳转首页
   ========================================== */
import { getKilnData, KILN_DATA, ARTIFACTS, KILN_TABS } from '../data/artifacts.js';
import { goToDetail, goToHome, backOrHome, refreshIcons } from '../lib/navigation.js';

const els = {
  backBtn: document.getElementById('back-detail'),
  linkTreasure: document.getElementById('link-treasure'),
  kilnTitle: document.getElementById('kiln-title'),
  kilnHero: document.getElementById('kiln-hero'),
  kilnHeroImg: document.getElementById('kiln-hero-img'),
  kilnName: document.getElementById('kiln-name'),
  kilnLocation: document.getElementById('kiln-location'),
  kilnHeritage: document.getElementById('kiln-heritage'),
  repWorks: document.getElementById('rep-works'),
  chapters: document.getElementById('chapters'),
  related: document.getElementById('related-grid'),
  switcher: document.getElementById('kiln-switcher')
};

let currentKiln = '汝瓷';

const CN_NUMS = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾'];

/* ---- 窑口切换 chip 行 ---- */
function renderSwitcher() {
  const kilns = KILN_TABS.filter((k) => k !== '全部');
  els.switcher.innerHTML = kilns.map((k) => {
    const active = k === currentKiln;
    return `<button class="kiln-switcher-chip${active ? ' is-active' : ''}" data-kiln="${k}" aria-pressed="${active}">${k}</button>`;
  }).join('');
}

/* ---- 工序流 HTML ---- */
function processFlowHTML(process) {
  if (!process || process.length === 0) return '';
  const steps = process.map((p, i) => `
    <span class="text-xs whitespace-nowrap" style="color: var(--qicraft-muted);">${p}</span>
    ${i < process.length - 1 ? '<i data-lucide="chevron-right" class="w-3 h-3 shrink-0"></i>' : ''}
  `).join('');
  return `<div class="flex items-center gap-1 mt-3 pl-1" style="color: var(--qicraft-subtle);">${steps}</div>`;
}

/* ---- 渲染窑口志 ---- */
function render(kiln) {
  currentKiln = kiln;
  renderSwitcher();
  const data = getKilnData(kiln);
  document.title = `${data.name.split(' ')[0]}烧制技艺 — 器韵 QiCraft`;

  // 头部标题
  els.kilnTitle.textContent = `${kiln}烧制技艺`;
  // Hero
  els.kilnHeroImg.src = data.hero;
  els.kilnHeroImg.alt = `${kiln}瓷器特写`;
  els.kilnName.textContent = data.name;
  els.kilnLocation.innerHTML = `<i data-lucide="map-pin" class="inline-block w-3.5 h-3.5 align-text-bottom" style="vertical-align: -2px; color: var(--qicraft-subtle);"></i> ${data.location}`;
  els.kilnHeritage.textContent = data.heritage;

  // 代表性器物
  if (data.repWorks.length === 0) {
    els.repWorks.innerHTML = `<p class="text-xs" style="color: var(--qicraft-subtle);">代表性器物整理中</p>`;
  } else {
    els.repWorks.innerHTML = data.repWorks.map((w) => `
      <div class="rep-thumb shrink-0 text-center" data-id="${w.artifactId || ''}" tabindex="0" role="button" aria-label="${w.name}">
        <div class="w-16 h-16 rounded-full overflow-hidden" style="border: 2px solid var(--qicraft-border);">
          <img src="${w.img}" alt="${w.name}" class="w-full h-full object-cover">
        </div>
        <span class="block mt-1.5 text-xs" style="color: var(--qicraft-muted);">${w.name}</span>
      </div>`).join('');
  }

  // 章节
  els.chapters.innerHTML = data.chapters.map((c, i) => `
    <article class="kiln-card mb-4">
      <div class="flex items-start gap-3">
        <span class="shrink-0 text-3xl font-bold" style="font-family: var(--qicraft-font-display); color: var(--qicraft-primary); line-height: 1; opacity: 0.7;">${c.num || CN_NUMS[i]}</span>
        <div class="min-w-0">
          <h4 class="text-base font-semibold" style="font-family: var(--qicraft-font-display); color: var(--qicraft-foreground); letter-spacing: 0.02em;">${c.title}</h4>
          <p class="mt-2 text-sm leading-relaxed" style="color: var(--qicraft-muted); line-height: 1.75;">${c.body}</p>
          ${c.title === '核心工序' || c.title === '工艺特征' ? processFlowHTML(data.process) : ''}
        </div>
      </div>
    </article>`).join('');

  // 关联器物：同窑口的器物（最多 4 件）
  const related = ARTIFACTS.filter((a) => a.kiln === kiln).slice(0, 4);
  if (related.length === 0) {
    els.related.innerHTML = `
      <div class="empty-state col-span-full">
        <p class="text-sm" style="color: var(--qicraft-muted);">该窑口暂无关联器物</p>
        <a href="index.html" class="inline-block mt-2 text-sm font-medium" style="color: var(--qicraft-primary); text-decoration: none;">前往珍宝馆浏览全部 →</a>
      </div>`;
  } else {
    els.related.innerHTML = related.map((a) => `
      <a class="related-card" href="javascript:void(0)" data-id="${a.id}">
        <div style="height: 120px; overflow: hidden;">
          <img src="${a.thumb}" alt="${a.name}" class="w-full h-full object-cover" loading="lazy">
        </div>
        <div class="p-2.5">
          <p class="text-sm font-medium truncate" style="color: var(--qicraft-foreground);">${a.name}</p>
          <p class="text-xs mt-0.5" style="color: var(--qicraft-subtle);">${a.dynasty} · ${a.collection}</p>
        </div>
      </a>`).join('');
  }

  refreshIcons();
}

/* ---- 事件 ---- */
els.backBtn.addEventListener('click', (e) => {
  e.preventDefault();
  backOrHome();
});
els.linkTreasure.addEventListener('click', (e) => {
  e.preventDefault();
  const params = new URLSearchParams(window.location.search);
  goToHome(params.get('kiln') || '全部');
});
// 代表性器物点击 → 详情
els.repWorks.addEventListener('click', (e) => {
  const t = e.target.closest('.rep-thumb');
  if (!t || !t.dataset.id) return;
  goToDetail(t.dataset.id);
});
els.repWorks.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const t = e.target.closest('.rep-thumb');
  if (!t || !t.dataset.id) return;
  e.preventDefault();
  goToDetail(t.dataset.id);
});
// 关联器物点击 → 详情
els.related.addEventListener('click', (e) => {
  const card = e.target.closest('.related-card');
  if (!card) return;
  goToDetail(card.dataset.id);
});
// 窑口切换 chip → 重新渲染并更新 URL
els.switcher.addEventListener('click', (e) => {
  const chip = e.target.closest('.kiln-switcher-chip');
  if (!chip || chip.classList.contains('is-active')) return;
  const kiln = chip.dataset.kiln;
  // 滚动回顶部，便于阅读新窑口
  document.querySelector('.app-content').scrollTo({ top: 0, behavior: 'smooth' });
  render(kiln);
  refreshIcons();
  // 更新 URL，保留可分享 / 返回态
  const url = `kiln-chronicle.html?kiln=${encodeURIComponent(kiln)}`;
  window.history.replaceState({ kiln }, '', url);
});

/* ---- 初始化 ---- */
function init() {
  const params = new URLSearchParams(window.location.search);
  const kiln = params.get('kiln') || '汝瓷';
  render(KILN_DATA[kiln] ? kiln : '汝瓷');
}

init();
