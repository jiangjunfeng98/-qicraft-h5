import{b as d,c as m,e as r,r as l,A as p,f as u,h,K as f}from"./navigation-BXjHF3lk.js";/* empty css                  */const a={backBtn:document.getElementById("back-detail"),linkTreasure:document.getElementById("link-treasure"),kilnTitle:document.getElementById("kiln-title"),kilnHero:document.getElementById("kiln-hero"),kilnHeroImg:document.getElementById("kiln-hero-img"),kilnName:document.getElementById("kiln-name"),kilnLocation:document.getElementById("kiln-location"),kilnHeritage:document.getElementById("kiln-heritage"),repWorks:document.getElementById("rep-works"),chapters:document.getElementById("chapters"),related:document.getElementById("related-grid"),switcher:document.getElementById("kiln-switcher")};let s="汝瓷";const k=["壹","贰","叁","肆","伍","陆","柒","捌","玖","拾"];function v(){const t=f.filter(e=>e!=="全部");a.switcher.innerHTML=t.map(e=>{const i=e===s;return`<button class="kiln-switcher-chip${i?" is-active":""}" data-kiln="${e}" aria-pressed="${i}">${e}</button>`}).join("")}function g(t){return!t||t.length===0?"":`<div class="flex items-center gap-1 mt-3 pl-1" style="color: var(--qicraft-subtle);">${t.map((i,n)=>`
    <span class="text-xs whitespace-nowrap" style="color: var(--qicraft-muted);">${i}</span>
    ${n<t.length-1?'<i data-lucide="chevron-right" class="w-3 h-3 shrink-0"></i>':""}
  `).join("")}</div>`}function o(t){s=t,v();const e=h(t);document.title=`${e.name.split(" ")[0]}烧制技艺 — 器韵 QiCraft`,a.kilnTitle.textContent=`${t}烧制技艺`,a.kilnHeroImg.src=e.hero,a.kilnHeroImg.alt=`${t}瓷器特写`,a.kilnName.textContent=e.name,a.kilnLocation.innerHTML=`<i data-lucide="map-pin" class="inline-block w-3.5 h-3.5 align-text-bottom" style="vertical-align: -2px; color: var(--qicraft-subtle);"></i> ${e.location}`,a.kilnHeritage.textContent=e.heritage,e.repWorks.length===0?a.repWorks.innerHTML='<p class="text-xs" style="color: var(--qicraft-subtle);">代表性器物整理中</p>':a.repWorks.innerHTML=e.repWorks.map(n=>`
      <div class="rep-thumb shrink-0 text-center" data-id="${n.artifactId||""}" tabindex="0" role="button" aria-label="${n.name}">
        <div class="w-16 h-16 rounded-full overflow-hidden" style="border: 2px solid var(--qicraft-border);">
          <img src="${n.img}" alt="${n.name}" class="w-full h-full object-cover">
        </div>
        <span class="block mt-1.5 text-xs" style="color: var(--qicraft-muted);">${n.name}</span>
      </div>`).join(""),a.chapters.innerHTML=e.chapters.map((n,c)=>`
    <article class="kiln-card mb-4">
      <div class="flex items-start gap-3">
        <span class="shrink-0 text-3xl font-bold" style="font-family: var(--qicraft-font-display); color: var(--qicraft-primary); line-height: 1; opacity: 0.7;">${n.num||k[c]}</span>
        <div class="min-w-0">
          <h4 class="text-base font-semibold" style="font-family: var(--qicraft-font-display); color: var(--qicraft-foreground); letter-spacing: 0.02em;">${n.title}</h4>
          <p class="mt-2 text-sm leading-relaxed" style="color: var(--qicraft-muted); line-height: 1.75;">${n.body}</p>
          ${n.title==="核心工序"||n.title==="工艺特征"?g(e.process):""}
        </div>
      </div>
    </article>`).join("");const i=p.filter(n=>n.kiln===t).slice(0,4);i.length===0?a.related.innerHTML=`
      <div class="empty-state col-span-full">
        <p class="text-sm" style="color: var(--qicraft-muted);">该窑口暂无关联器物</p>
        <a href="index.html" class="inline-block mt-2 text-sm font-medium" style="color: var(--qicraft-primary); text-decoration: none;">前往珍宝馆浏览全部 →</a>
      </div>`:a.related.innerHTML=i.map(n=>`
      <a class="related-card" href="javascript:void(0)" data-id="${n.id}">
        <div style="height: 120px; overflow: hidden;">
          <img src="${n.thumb}" alt="${n.name}" class="w-full h-full object-cover" loading="lazy">
        </div>
        <div class="p-2.5">
          <p class="text-sm font-medium truncate" style="color: var(--qicraft-foreground);">${n.name}</p>
          <p class="text-xs mt-0.5" style="color: var(--qicraft-subtle);">${n.dynasty} · ${n.collection}</p>
        </div>
      </a>`).join(""),l()}a.backBtn.addEventListener("click",t=>{t.preventDefault(),d()});a.linkTreasure.addEventListener("click",t=>{t.preventDefault();const e=new URLSearchParams(window.location.search);m(e.get("kiln")||"全部")});a.repWorks.addEventListener("click",t=>{const e=t.target.closest(".rep-thumb");!e||!e.dataset.id||r(e.dataset.id)});a.repWorks.addEventListener("keydown",t=>{if(t.key!=="Enter"&&t.key!==" ")return;const e=t.target.closest(".rep-thumb");!e||!e.dataset.id||(t.preventDefault(),r(e.dataset.id))});a.related.addEventListener("click",t=>{const e=t.target.closest(".related-card");e&&r(e.dataset.id)});a.switcher.addEventListener("click",t=>{const e=t.target.closest(".kiln-switcher-chip");if(!e||e.classList.contains("is-active"))return;const i=e.dataset.kiln;document.querySelector(".app-content").scrollTo({top:0,behavior:"smooth"}),o(i),l();const n=`kiln-chronicle.html?kiln=${encodeURIComponent(i)}`;window.history.replaceState({kiln:i},"",n)});function y(){const e=new URLSearchParams(window.location.search).get("kiln")||"汝瓷";o(u[e]?e:"汝瓷")}y();
