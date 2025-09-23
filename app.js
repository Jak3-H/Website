// Example games
const GAMES = [
  {
    id: 'flipoint',

    title: 'Flipoint',
    short: 'A reflective puzzler.',

    slogan: `A reflective puzzler`,
    description: `Throw Orbs to reflect crates onto boxes`,

    tags: ['Puzzle','Jam Game'],
    itch: 'https://thereal-phoenix.itch.io/flipoint',

    thumbnail: 'screenshots/flipoint1.png',
    heroImage: 'screenshots/flipoint1.png',

    screenshots: [
      'screenshots/flipoint1.png',
      'screenshots/flipoint2.png',
      'screenshots/flipoint3.png',
    ],
    //gifs: [
    // 'screenshots/flipoint.gif',
    //]
  },
  {
    id: 'bestbefore',

    title: 'Best Before',
    short: 'A Binding of Issac-like',

    slogan: `Grow strong, not mold.`,
    description: `
    A game made for a university hosted game jam about an old japanese noodle commecial.
    Play as Cheddar Man and fight in a procedurally generated dungeon, collecting items, freeing birds and hopefully staying fresh.
    `,

    tags: ['Shooter','Rogue-like','Jam Game'],
    itch: 'https://thereal-phoenix.itch.io/best-before',

    thumbnail: 'screenshots/bestbefore_thumbnail.png',
    heroImage: 'screenshots/bestbefore1.png',
    
    screenshots: [
      'screenshots/bestbefore1.png',
      'screenshots/bestbefore2.png',
      'screenshots/bestbefore3.png',
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
  const thumb = (g.thumbnail) || '';
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
  <section class="section-1">
    <h1>Hi, I'm Jake Hall</h1>
    <p>I'm a game developer. Here are some of my projects.</p>
    </section>

    <section class="section-2">
    <h2>Featured</h2>
    <div class="grid">${GAMES.slice(0,2).map(cardHtml).join('')}</div>
    <div class="nav-right">
      <a href="#/games" data-route="games">Games</a>
    </div>
    </section>
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
    <!-- Title -->
    <section class="section-hero">
        <h1>${game.title}</h1>
        <p>${game.slogan}</p>
    </section>

    <!-- Tags -->
    <section class="section-2">
    <div>${game.tags.map(t => `<span class="tag">${t}</span>`).join(' ')}</div>
    </section>

    <!-- Description-->
    <section class="section-1">
    <h2>About this game</h2>
    <p>${game.description}</p>
    </section>

    <!-- Itch link at the top -->
    <a class="itch" href="${game.itch}" target="_blank">Play on itch.io</a>


    <!-- Screenshots -->
    ${game.screenshots && game.screenshots.length ? `
    <h2>Screenshots</h2>
    <div class="gallery">
      ${game.screenshots.map(s => `<img src="${s}" alt="${game.title} screenshot">`).join('')}
    </div>
    ` : ''}

    <!-- GIFs -->
    ${game.gifs && game.gifs.length ? `
      <h2>GIFs</h2>
      <div class="gallery">
        ${game.gifs.map(g => `<img src="${g}" alt="${game.title} gif">`).join('')}
      </div>
    ` : ''}
  `;
  
  //const hero = document.querySelector('.section-hero');
  //const hero_Div = hero.querySelector('div');
  //const thumb = game.heroImage || '';
  //hero_Div.style.backgroundImage = `url('${thumb}')`;
}

function renderAbout(){
  appView.innerHTML = `
    <section class="section-1">
    <h1>About Me</h1>
    <p>Write about yourself, tools you use, and what you like to build.</p>
    </section>
    <section class="section-2">
    <h2>Contacts</h2>
    <p>Jak3DHall@gmail.com</p>
    </section>
    <section class="section-1">
    <h2>Education</h2>
    <p>SEC Game Design BSc(Hons)</p>
    </section>
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
