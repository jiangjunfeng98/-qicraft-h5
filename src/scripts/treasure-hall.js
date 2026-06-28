/* ==========================================
   珍宝馆 · 首页交互
   - 窑口 Tab 筛选
   - 器物卡片渲染 / 查看更多
   - 每日一瓷 / 卡片 → 详情页
   - 一瓷一考弹层
   ========================================== */
import {
  KILN_TABS, ARTIFACTS, INITIAL_PAGE_SIZE,
  getArtifactById
} from '../data/artifacts.js';
import { goToDetail, refreshIcons } from '../lib/navigation.js';

const state = {
  kiln: '全部',
  visibleCount: INITIAL_PAGE_SIZE
};

const grid = document.getElementById('artifact-grid');
const countEl = document.getElementById('artifact-count');
const tabsEl = document.getElementById('kiln-tabs');
const loadMoreWrap = document.getElementById('load-more-wrap');
const loadMoreBtn = document.getElementById('load-more-btn');
const dailyPick = document.getElementById('daily-pick');

/* ---- LocalStorage 工具 ---- */
const LS_KEYS = {
  answered: 'qicraft_answered_questions',
  score: 'qicraft_quiz_score',
  streak: 'qicraft_quiz_streak'
};

function getAnsweredQuestions() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.answered)) || [];
  } catch { return []; }
}

function addAnsweredQuestion(id) {
  const list = getAnsweredQuestions();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem(LS_KEYS.answered, JSON.stringify(list));
  }
}

function getQuizScore() {
  return parseInt(localStorage.getItem(LS_KEYS.score) || '0', 10);
}

function addQuizScore(points) {
  localStorage.setItem(LS_KEYS.score, String(getQuizScore() + points));
}

function getQuizStreak() {
  return parseInt(localStorage.getItem(LS_KEYS.streak) || '0', 10);
}

function setQuizStreak(val) {
  localStorage.setItem(LS_KEYS.streak, String(val));
}

/* ---- 筛选：按窑口 ---- */
function filterArtifacts() {
  return ARTIFACTS.filter((a) => state.kiln === '全部' || a.kiln === state.kiln);
}

/* ---- 渲染单张卡片 ---- */
function cardHTML(a, entering = false) {
  const hook = a.emotionalHook || '';
  return `
    <a class="artifact-card${entering ? ' is-entering' : ''}" href="javascript:void(0)" data-id="${a.id}" aria-label="${a.name}">
      <div class="aspect-square overflow-hidden" style="background-color: var(--qicraft-elevated);">
        <img src="${a.thumb}" alt="${a.name}" class="w-full h-full object-cover" loading="lazy">
      </div>
      <div class="p-2.5">
        <p class="emotional-hook">${hook}</p>
        <p class="text-sm font-medium truncate mt-1" style="color: var(--qicraft-foreground); font-family: var(--qicraft-font-display);">${a.name}</p>
        <p class="text-xs mt-0.5 truncate" style="color: var(--qicraft-muted);">${a.dynasty}</p>
        <span class="inline-flex items-center justify-center mt-1.5 px-2 py-0.5 rounded-md text-xs whitespace-nowrap" style="background-color: var(--qicraft-primary-light); color: var(--qicraft-primary);">${a.kiln}</span>
      </div>
    </a>`;
}

/* ---- 渲染网格 ---- */
function renderGrid() {
  const list = filterArtifacts();
  const visible = list.slice(0, state.visibleCount);
  const entering = state.visibleCount > INITIAL_PAGE_SIZE;

  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="empty-state col-span-full">
        <p class="text-sm" style="color: var(--qicraft-muted);">该窑口暂无器物</p>
        <p class="text-xs mt-1" style="color: var(--qicraft-subtle);">试试其它窑口</p>
      </div>`;
    loadMoreWrap.classList.add('hidden');
  } else {
    grid.innerHTML = visible.map((a) => cardHTML(a, entering)).join('');
    if (list.length > visible.length) {
      loadMoreWrap.classList.remove('hidden');
      loadMoreBtn.textContent = `查看更多（剩余 ${list.length - visible.length} 件）`;
    } else {
      loadMoreWrap.classList.add('hidden');
    }
  }
  countEl.textContent = `共 ${list.length} 件`;
  refreshIcons();
}

/* ---- 渲染窑口 Tabs ---- */
function renderTabs() {
  tabsEl.innerHTML = KILN_TABS.map((k) => {
    const active = k === state.kiln;
    const baseStyle = active
      ? 'background-color: var(--qicraft-primary); color: var(--qicraft-surface); border: 1px solid var(--qicraft-primary);'
      : 'background-color: var(--qicraft-surface); color: var(--qicraft-foreground); border: 1px solid var(--qicraft-border);';
    return `<button class="kiln-tab shrink-0 inline-flex items-center justify-center px-4 h-8 rounded-full text-xs font-medium whitespace-nowrap"
        style="${baseStyle} font-family: var(--qicraft-font-body);" data-kiln="${k}" aria-pressed="${active}">${k}</button>`;
  }).join('');
}

/* ---- 事件：Tab 筛选 ---- */
tabsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-kiln]');
  if (!btn) return;
  state.kiln = btn.dataset.kiln;
  state.visibleCount = INITIAL_PAGE_SIZE;
  renderTabs();
  renderGrid();
});

/* ============================================================
   一瓷一考弹层
   ============================================================ */
let currentQuizArtifact = null;
let quizOverlayEl = null;

function createQuizOverlay() {
  if (quizOverlayEl) return;
  const div = document.createElement('div');
  div.id = 'quiz-overlay';
  div.className = 'quiz-overlay hidden';
  div.innerHTML = `
    <div class="quiz-modal">
      <div class="quiz-header">
        <span class="quiz-badge">鉴赏挑战</span>
        <button class="quiz-skip">跳过</button>
      </div>
      <div class="quiz-image">
        <img src="" alt="">
      </div>
      <p class="quiz-question"></p>
      <div class="quiz-options"></div>
      <div class="quiz-result hidden">
        <p class="quiz-result-text"></p>
        <p class="quiz-explanation"></p>
        <button class="quiz-continue">继续</button>
      </div>
    </div>
  `;
  document.body.appendChild(div);
  quizOverlayEl = div;

  // 跳过按钮
  div.querySelector('.quiz-skip').addEventListener('click', () => {
    hideQuiz();
    if (currentQuizArtifact) {
      addAnsweredQuestion(currentQuizArtifact.id);
      goToDetail(currentQuizArtifact.id);
    }
  });

  // 继续按钮
  div.querySelector('.quiz-continue').addEventListener('click', () => {
    hideQuiz();
    if (currentQuizArtifact) {
      goToDetail(currentQuizArtifact.id);
    }
  });

  // 点击遮罩关闭
  div.addEventListener('click', (e) => {
    if (e.target === div) {
      hideQuiz();
      if (currentQuizArtifact) {
        addAnsweredQuestion(currentQuizArtifact.id);
        goToDetail(currentQuizArtifact.id);
      }
    }
  });
}

function showQuiz(artifact) {
  createQuizOverlay();
  currentQuizArtifact = artifact;

  const img = quizOverlayEl.querySelector('.quiz-image img');
  const questionEl = quizOverlayEl.querySelector('.quiz-question');
  const optionsEl = quizOverlayEl.querySelector('.quiz-options');
  const resultEl = quizOverlayEl.querySelector('.quiz-result');

  img.src = artifact.thumb;
  img.alt = artifact.name;
  questionEl.textContent = artifact.quiz ? artifact.quiz.question : '关于这件器物，以下哪项描述是正确的？';
  resultEl.classList.add('hidden');

  if (artifact.quiz) {
    optionsEl.innerHTML = artifact.quiz.options.map((opt, idx) =>
      `<button class="quiz-option" data-index="${idx}">${opt}</button>`
    ).join('');

    optionsEl.querySelectorAll('.quiz-option').forEach((btn) => {
      btn.addEventListener('click', () => handleQuizAnswer(parseInt(btn.dataset.index, 10)));
    });
  } else {
    optionsEl.innerHTML = `<button class="quiz-continue" style="margin-top:0;">继续探索</button>`;
    optionsEl.querySelector('.quiz-continue').addEventListener('click', () => {
      hideQuiz();
      goToDetail(artifact.id);
    });
  }

  quizOverlayEl.classList.remove('hidden');
}

function hideQuiz() {
  if (quizOverlayEl) quizOverlayEl.classList.add('hidden');
}

function handleQuizAnswer(selectedIndex) {
  if (!currentQuizArtifact || !currentQuizArtifact.quiz) return;
  const quiz = currentQuizArtifact.quiz;
  const optionsEl = quizOverlayEl.querySelector('.quiz-options');
  const resultEl = quizOverlayEl.querySelector('.quiz-result');
  const resultText = quizOverlayEl.querySelector('.quiz-result-text');
  const explanationEl = quizOverlayEl.querySelector('.quiz-explanation');

  const isCorrect = selectedIndex === quiz.correctIndex;

  // 禁用所有选项
  optionsEl.querySelectorAll('.quiz-option').forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === quiz.correctIndex) {
      btn.classList.add('correct');
    } else if (idx === selectedIndex && !isCorrect) {
      btn.classList.add('wrong');
    }
  });

  // 更新积分和连击
  addAnsweredQuestion(currentQuizArtifact.id);
  if (isCorrect) {
    addQuizScore(10);
    setQuizStreak(getQuizStreak() + 1);
    resultText.textContent = '回答正确！';
    resultText.className = 'quiz-result-text correct';
  } else {
    setQuizStreak(0);
    resultText.textContent = '回答错误';
    resultText.className = 'quiz-result-text wrong';
  }

  explanationEl.textContent = quiz.explanation || '';
  resultEl.classList.remove('hidden');
}

/* ---- 事件：卡片点击 → 详情 ---- */
grid.addEventListener('click', (e) => {
  const card = e.target.closest('.artifact-card');
  if (!card) return;
  const id = card.dataset.id;
  const artifact = getArtifactById(id);
  if (!artifact) return;

  const answered = getAnsweredQuestions();
  if (answered.includes(id)) {
    goToDetail(id);
  } else {
    showQuiz(artifact);
  }
});

/* ---- 事件：每日一瓷 ---- */
dailyPick.addEventListener('click', (e) => {
  e.preventDefault();
  const id = dailyPick.dataset.id;
  const artifact = getArtifactById(id);
  if (!artifact) return;

  const answered = getAnsweredQuestions();
  if (answered.includes(id)) {
    goToDetail(id);
  } else {
    showQuiz(artifact);
  }
});

/* ---- 事件：查看更多 ---- */
loadMoreBtn.addEventListener('click', () => {
  state.visibleCount += 6;
  renderGrid();
});

/* ---- 初始化（支持从详情页带 kiln 上下文返回） ---- */
function init() {
  const params = new URLSearchParams(window.location.search);
  const kiln = params.get('kiln');
  if (kiln && KILN_TABS.includes(kiln)) state.kiln = kiln;

  // 每日一瓷固定为汝窑天青釉洗
  const daily = getArtifactById('ru-wash');
  if (daily) {
    dailyPick.setAttribute('data-id', daily.id);
    const img = dailyPick.querySelector('img');
    if (img) { img.src = daily.images[0]; img.alt = daily.name; }
    const title = dailyPick.querySelector('[data-daily-title]');
    if (title) title.textContent = daily.name;
    const sub = dailyPick.querySelector('[data-daily-sub]');
    if (sub) sub.textContent = `${daily.dynasty} · ${daily.kiln}`;
  }

  renderTabs();
  renderGrid();
  refreshIcons();
}

init();
