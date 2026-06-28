import{g,e as d,K as x,r as E,A as C,I as z}from"./navigation-BXjHF3lk.js";/* empty css                  */const c={kiln:"全部",visibleCount:z},v=document.getElementById("artifact-grid"),A=document.getElementById("artifact-count"),L=document.getElementById("kiln-tabs"),p=document.getElementById("load-more-wrap"),w=document.getElementById("load-more-btn"),l=document.getElementById("daily-pick"),u={answered:"qicraft_answered_questions",score:"qicraft_quiz_score",streak:"qicraft_quiz_streak"};function k(){try{return JSON.parse(localStorage.getItem(u.answered))||[]}catch{return[]}}function y(t){const e=k();e.includes(t)||(e.push(t),localStorage.setItem(u.answered,JSON.stringify(e)))}function T(){return parseInt(localStorage.getItem(u.score)||"0",10)}function Q(t){localStorage.setItem(u.score,String(T()+t))}function _(){return parseInt(localStorage.getItem(u.streak)||"0",10)}function S(t){localStorage.setItem(u.streak,String(t))}function B(){return C.filter(t=>c.kiln==="全部"||t.kiln===c.kiln)}function M(t,e=!1){const i=t.emotionalHook||"";return`
    <a class="artifact-card${e?" is-entering":""}" href="javascript:void(0)" data-id="${t.id}" aria-label="${t.name}">
      <div class="aspect-square overflow-hidden" style="background-color: var(--qicraft-elevated);">
        <img src="${t.thumb}" alt="${t.name}" class="w-full h-full object-cover" loading="lazy">
      </div>
      <div class="p-2.5">
        <p class="emotional-hook">${i}</p>
        <p class="text-sm font-medium truncate mt-1" style="color: var(--qicraft-foreground); font-family: var(--qicraft-font-display);">${t.name}</p>
        <p class="text-xs mt-0.5 truncate" style="color: var(--qicraft-muted);">${t.dynasty}</p>
        <span class="inline-flex items-center justify-center mt-1.5 px-2 py-0.5 rounded-md text-xs whitespace-nowrap" style="background-color: var(--qicraft-primary-light); color: var(--qicraft-primary);">${t.kiln}</span>
      </div>
    </a>`}function b(){const t=B(),e=t.slice(0,c.visibleCount),i=c.visibleCount>z;e.length===0?(v.innerHTML=`
      <div class="empty-state col-span-full">
        <p class="text-sm" style="color: var(--qicraft-muted);">该窑口暂无器物</p>
        <p class="text-xs mt-1" style="color: var(--qicraft-subtle);">试试其它窑口</p>
      </div>`,p.classList.add("hidden")):(v.innerHTML=e.map(n=>M(n,i)).join(""),t.length>e.length?(p.classList.remove("hidden"),w.textContent=`查看更多（剩余 ${t.length-e.length} 件）`):p.classList.add("hidden")),A.textContent=`共 ${t.length} 件`,E()}function I(){L.innerHTML=x.map(t=>{const e=t===c.kiln;return`<button class="kiln-tab shrink-0 inline-flex items-center justify-center px-4 h-8 rounded-full text-xs font-medium whitespace-nowrap"
        style="${e?"background-color: var(--qicraft-primary); color: var(--qicraft-surface); border: 1px solid var(--qicraft-primary);":"background-color: var(--qicraft-surface); color: var(--qicraft-foreground); border: 1px solid var(--qicraft-border);"} font-family: var(--qicraft-font-body);" data-kiln="${t}" aria-pressed="${e}">${t}</button>`}).join("")}L.addEventListener("click",t=>{const e=t.target.closest("[data-kiln]");e&&(c.kiln=e.dataset.kiln,c.visibleCount=z,I(),b())});let s=null,r=null;function H(){if(r)return;const t=document.createElement("div");t.id="quiz-overlay",t.className="quiz-overlay hidden",t.innerHTML=`
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
  `,document.body.appendChild(t),r=t,t.querySelector(".quiz-skip").addEventListener("click",()=>{m(),s&&(y(s.id),d(s.id))}),t.querySelector(".quiz-continue").addEventListener("click",()=>{m(),s&&d(s.id)}),t.addEventListener("click",e=>{e.target===t&&(m(),s&&(y(s.id),d(s.id)))})}function $(t){H(),s=t;const e=r.querySelector(".quiz-image img"),i=r.querySelector(".quiz-question"),n=r.querySelector(".quiz-options"),a=r.querySelector(".quiz-result");e.src=t.thumb,e.alt=t.name,i.textContent=t.quiz?t.quiz.question:"关于这件器物，以下哪项描述是正确的？",a.classList.add("hidden"),t.quiz?(n.innerHTML=t.quiz.options.map((o,f)=>`<button class="quiz-option" data-index="${f}">${o}</button>`).join(""),n.querySelectorAll(".quiz-option").forEach(o=>{o.addEventListener("click",()=>j(parseInt(o.dataset.index,10)))})):(n.innerHTML='<button class="quiz-continue" style="margin-top:0;">继续探索</button>',n.querySelector(".quiz-continue").addEventListener("click",()=>{m(),d(t.id)})),r.classList.remove("hidden")}function m(){r&&r.classList.add("hidden")}function j(t){if(!s||!s.quiz)return;const e=s.quiz,i=r.querySelector(".quiz-options"),n=r.querySelector(".quiz-result"),a=r.querySelector(".quiz-result-text"),o=r.querySelector(".quiz-explanation"),f=t===e.correctIndex;i.querySelectorAll(".quiz-option").forEach((q,h)=>{q.disabled=!0,h===e.correctIndex?q.classList.add("correct"):h===t&&!f&&q.classList.add("wrong")}),y(s.id),f?(Q(10),S(_()+1),a.textContent="回答正确！",a.className="quiz-result-text correct"):(S(0),a.textContent="回答错误",a.className="quiz-result-text wrong"),o.textContent=e.explanation||"",n.classList.remove("hidden")}v.addEventListener("click",t=>{const e=t.target.closest(".artifact-card");if(!e)return;const i=e.dataset.id,n=g(i);if(!n)return;k().includes(i)?d(i):$(n)});l.addEventListener("click",t=>{t.preventDefault();const e=l.dataset.id,i=g(e);if(!i)return;k().includes(e)?d(e):$(i)});w.addEventListener("click",()=>{c.visibleCount+=6,b()});function N(){const e=new URLSearchParams(window.location.search).get("kiln");e&&x.includes(e)&&(c.kiln=e);const i=g("ru-wash");if(i){l.setAttribute("data-id",i.id);const n=l.querySelector("img");n&&(n.src=i.images[0],n.alt=i.name);const a=l.querySelector("[data-daily-title]");a&&(a.textContent=i.name);const o=l.querySelector("[data-daily-sub]");o&&(o.textContent=`${i.dynasty} · ${i.kiln}`)}I(),b(),E()}N();
