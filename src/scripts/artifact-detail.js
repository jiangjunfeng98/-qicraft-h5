/* ==========================================
   器物详情 · 灯箱交互
   - URL ?id= 读取器物
   - 图片轮播（触摸滑动 / 拖拽 / 箭头 / 键盘）
   - 上一件 / 下一件器物（按钮 + 信息区滑动）
   - 关闭 → 首页；寻根 → 窑口志
   ========================================== */
import { getArtifactById, getAdjacentArtifact, ARTIFACTS } from '../data/artifacts.js';
import { goToHome, goToKiln, backOrHome, refreshIcons } from '../lib/navigation.js';
import { attachSwipe, attachKeyArrows } from '../lib/swipe.js';

const state = {
  id: null,
  imgIndex: 0
};

const els = {
  closeBtn: document.getElementById('detail-close'),
  ctaKiln: document.getElementById('cta-kiln'),
  carousel: document.getElementById('carousel'),
  track: document.getElementById('carousel-track'),
  counter: document.getElementById('carousel-counter'),
  prevArrow: document.getElementById('carousel-prev'),
  nextArrow: document.getElementById('carousel-next'),
  title: document.getElementById('artifact-title'),
  kilnTag: document.getElementById('artifact-kiln-tag'),
  metaDynasty: document.getElementById('meta-dynasty'),
  metaMaterial: document.getElementById('meta-material'),
  metaSize: document.getElementById('meta-size'),
  desc: document.getElementById('artifact-desc'),
  prevArtifact: document.getElementById('prev-artifact'),
  nextArtifact: document.getElementById('next-artifact'),
  hint: document.getElementById('swipe-hint'),
  infoCard: document.getElementById('info-card')
};

/* ---- 轮播 ---- */
function renderCarousel(images) {
  els.track.innerHTML = images.map((src, i) => `
    <div class="carousel-slide">
      <img src="${src}" alt="器物图 ${i + 1}" draggable="false">
    </div>`).join('');
  state.imgIndex = 0;
  updateCarousel();
}

function updateCarousel() {
  const artifact = getArtifactById(state.id);
  if (!artifact) return;
  const total = artifact.images.length;
  // 箭头在单图时隐藏
  els.prevArrow.hidden = total <= 1;
  els.nextArrow.hidden = total <= 1;
  // 计数器
  els.counter.textContent = total > 1 ? `${state.imgIndex + 1} / ${total}` : '';
  els.counter.style.display = total > 1 ? '' : 'none';
  // 位移
  els.track.style.transform = `translateX(-${state.imgIndex * 100}%)`;
}

function nextImage() {
  const artifact = getArtifactById(state.id);
  if (!artifact) return;
  if (artifact.images.length <= 1) return;
  state.imgIndex = (state.imgIndex + 1) % artifact.images.length;
  updateCarousel();
}
function prevImage() {
  const artifact = getArtifactById(state.id);
  if (!artifact) return;
  if (artifact.images.length <= 1) return;
  state.imgIndex = (state.imgIndex - 1 + artifact.images.length) % artifact.images.length;
  updateCarousel();
}

/* ---- 器物信息渲染 ---- */
function loadArtifact(id, push = true) {
  const artifact = getArtifactById(id);
  if (!artifact) {
    // 找不到：回首页
    goToHome();
    return;
  }
  state.id = id;
  state.imgIndex = 0;

  document.title = `${artifact.name} — 器韵 QiCraft`;
  els.title.textContent = artifact.name;
  els.kilnTag.textContent = `${artifact.kiln}`;
  els.metaDynasty.textContent = artifact.dynasty;
  els.metaMaterial.textContent = artifact.material;
  els.metaSize.innerHTML = artifact.size.replace(/·/g, '&middot;');
  els.desc.textContent = artifact.desc;

  renderCarousel(artifact.images);
  refreshIcons();

  // 同窑口仅 1 件时，禁用上一件 / 下一件按钮（无前后器物可翻）
  const sameKilnCount = ARTIFACTS.filter((a) => a.kiln === artifact.kiln).length;
  const disabled = sameKilnCount <= 1;
  els.prevArtifact.disabled = disabled;
  els.nextArtifact.disabled = disabled;

  if (push) {
    const url = `artifact-detail.html?id=${encodeURIComponent(id)}`;
    window.history.pushState({ id }, '', url);
  }
}

/* ---- 上一件 / 下一件 ---- */
function goAdjacent(dir) {
  const next = getAdjacentArtifact(state.id, dir);
  if (next) loadArtifact(next.id);
}

/* ---- 初始化 ---- */
function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'ru-wash';
  loadArtifact(id, false);

  // 关闭 → 首页
  els.closeBtn.addEventListener('click', () => backOrHome());
  // 寻根 → 窑口志
  els.ctaKiln.addEventListener('click', (e) => {
    e.preventDefault();
    const artifact = getArtifactById(state.id);
    goToKiln(artifact ? artifact.kiln : '汝瓷');
  });

  // 图片轮播：箭头
  els.prevArrow.addEventListener('click', prevImage);
  els.nextArrow.addEventListener('click', nextImage);
  // 图片轮播：滑动 / 拖拽
  attachSwipe(els.carousel, { onLeft: nextImage, onRight: prevImage });

  // 器物翻页：按钮
  els.prevArtifact.addEventListener('click', () => goAdjacent(-1));
  els.nextArtifact.addEventListener('click', () => goAdjacent(1));
  // 器物翻页：信息区滑动（与图片轮播分离，避免冲突）
  attachSwipe(els.infoCard, { onLeft: () => goAdjacent(1), onRight: () => goAdjacent(-1) });
  attachSwipe(els.hint, { onLeft: () => goAdjacent(1), onRight: () => goAdjacent(-1) });

  // 键盘：← → 翻件（优先），图片轮播用按钮/滑动
  attachKeyArrows({ onLeft: () => goAdjacent(1), onRight: () => goAdjacent(-1) });

  // 浏览器前进 / 后退
  window.addEventListener('popstate', (e) => {
    const id = (e.state && e.state.id) || new URLSearchParams(window.location.search).get('id');
    if (id) loadArtifact(id, false);
  });

  refreshIcons();
}

init();
