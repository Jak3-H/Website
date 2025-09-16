// Example games
const GAMES = [
  {
    title: 'Flipoint',
    short: 'A reflective puzzler.',
    description: `Throw Orbs to reflect crates onto boxes`,
    tags: ['Puzzle','Jam Game'],
    itch: 'https://thereal-phoenix.itch.io/flipoint',
    screenshots: [
      'images/flipoint (1).png',
      'images/flipoint (2).png',
      'images/flipoint (3).png',
    ]
  },
  {
    id: 'bestbefore',
    title: 'Best Before',
    short: 'A Binding of Issac-like',
    description: `Grow strong, not mold.`,
    tags: ['Shooter','Rogue-like','Jam Game'],
    itch: 'https://thereal-phoenix.itch.io/best-before',
    screenshots: [
      'images/bestbefore (1).png',
      'images/bestbefore (2).png',
      'images/bestbefore (3).png',
    ]
  }
];

const ALL_TAGS = Array.from(
  new Set(GAMES.reduce((acc,g)=>acc.concat(g.tags),[]))
).sort();

function highlightNav(route){
  document.querySelectorAll('.navbar a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('data-route')===route);
  });
}

function cardHtml(g){
  const thumb = g.screenshots[0] || '';
  return `
    <article class="card">
      <div class="thumb">
        <img src="${thumb}" alt="${g.title}">
      </div>
      <div style="padding:12px">
        <div class="game-title"><strong>${g.title}</strong></div>
        <div class="small">${g.short}</div>
        <div class="meta">
          <div>${g.tags.map(t=>`<span class="tag small">${t}</span>`).join(' ')}</div>
          <button onclick="openGame('${g.id}')">Open</button>
        </div>
      </div>
    </article>
  `;
}

// ---- Pages ----
function renderHome(){
  appView.innerHTML = `
    <h1>Welcome</h1>
    <p>I'm a game developer. Here are some of my projects.</p>
    <h3>Featured</h3>
    <div class="grid">${GAMES.slice(0,2).map(cardHtml).join('')}</div>
  `;
}

function renderGames(){
  appView.innerHTML = `
    <h1>Games</h1>
    <div class="searchrow">
      <input class="search" id="searchInput" placeholder="Search games or tags...">
      <div id="tagCloud"></div>
    </div>
    <div id="resultsSummary"></div>
    <div class="grid" id="gamesGrid">${GAMES.map(cardHtml).join('')}</div>
  `;
  document.getElementById('tagCloud').innerHTML =
    ALL_TAGS.map(t=>`<span class="tag" data-tag="${t}">${t}</span>`).join('');
  attachListeners();
}

function renderGamePage(id){
  const game = GAMES.find(g => g.id === id);
  if(!game) {
    appView.innerHTML = `<h2>Game not found</h2>`;
    return;
  }

  appView.innerHTML = `
    <h1>${game.title}</h1>
    <p>${game.description}</p>
    <div>${game.tags.map(t => `<span class="tag">${t}</span>`).join(' ')}</div>

    <!-- Itch link at the top -->
    <a class="itch" href="${game.itch}" target="_blank">Play on itch.io</a>

    <!-- Screenshots -->
    <div class="gallery">
      ${game.screenshots.map(s => `<img src="${s}" alt="${game.title} screenshot">`).join('')}
    </div>
  `;
}

function renderAbout(){
  appView.innerHTML = `
    <h1>About Me</h1>
    <p>Write about yourself, tools you use, and what you like to build.</p>
  `;
}

// ---- Filtering ----
function attachListeners(){
  document.querySelectorAll('.tag[data-tag]').forEach(tag=>{
    tag.addEventListener('click',()=>{
      tag.classList.toggle('active');
      applyFilters();
    });
  });
  const s=document.getElementById('searchInput');
  if(s) s.oninput=()=>applyFilters();
}
function applyFilters(){
  const active=[...document.querySelectorAll('.tag[data-tag].active')]
      .map(t=>t.getAttribute('data-tag'));
  const q=(document.getElementById('searchInput')?.value||'').toLowerCase();
  const filtered=GAMES.filter(g=>{
    if(!active.every(t=>g.tags.includes(t))) return false;
    if(!q) return true;
    const hay=(g.title+g.short+g.description+g.tags.join(' ')).toLowerCase();
    return hay.includes(q);
  });
  document.getElementById('gamesGrid').innerHTML = filtered.map(cardHtml).join('');
  document.getElementById('resultsSummary').textContent = `${filtered.length} result(s)`;
}

// ---- Routing ----
function routeTo(hash){
  const clean=(hash||'').replace(/^#\/?/,'').replace(/^\//,'');
  const parts=clean.split('/');
  highlightNav(parts[0]||'home');
  if(!clean) return renderHome();
  if(parts[0]==='games') return renderGames();
  if(parts[0]==='game'&&parts[1]) return renderGamePage(parts[1]);
  if(parts[0]==='about') return renderAbout();
  renderHome();
}
function navigate(route){ location.hash = `#/${route}`; }
function openGame(id){ navigate(`game/${id}`); }

// ---- Init ----
const appView = document.getElementById('appView');
(function init(){
  document.querySelectorAll('a[data-route]').forEach(link=>{
    link.addEventListener('click', e=>{
      e.preventDefault();
      const route=link.getAttribute('data-route');
      navigate(route==='home'?'':route);
    });
  });
  routeTo(location.hash);
  window.addEventListener('hashchange',()=>routeTo(location.hash));
})();
