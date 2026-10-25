/* ============================================================
   Mythe ou Fait ? — Octobre Rose
   app.js — Logique du mini-jeu
============================================================ */

'use strict';

// ── STATE ──────────────────────────────────────────────────
const GAME_CARD_COUNT = 12;
let deck = [];          // cartes mélangées
let currentIndex = 0;  // index actif
let score = 0;         // bonnes réponses
let answered = false;  // carte courante déjà répondue ?

// ── HELPERS ────────────────────────────────────────────────

/** Mélange une copie d'un tableau avec Fisher-Yates. */
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Sélectionne n cartes dans un paquet mélangé, sans modifier l'original. */
function pickCards(all, n = GAME_CARD_COUNT) {
  return shuffle(all).slice(0, Math.max(0, Math.floor(n)));
}

/** Affiche un écran, cache les autres */
function showScreen(id) {
  const target = document.getElementById(id);
  if (!target || !target.classList.contains('screen')) {
    throw new Error(`Écran introuvable : ${id}`);
  }

  const gardenBubble = document.getElementById('garden-bubble');
  if (gardenBubble) gardenBubble.style.display = 'none';

  if (document.body.classList.contains('garden-active') && id !== 'screen-garden') {
    window.scrollTo(0, 0);
  }
  document.body.classList.toggle('quiz-active', id === 'screen-quiz');
  document.body.classList.toggle('garden-active', id === 'screen-garden');
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.screen').forEach(s => s.setAttribute('aria-hidden', 'true'));
  updateNavigation(id);
  // Petit délai pour que la transition soit visible
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.classList.add('active');
      target.setAttribute('aria-hidden', 'false');
    });
  });
}

function updateNavigation(screenId) {
  const activeId = screenId === 'screen-result' ? 'play'
    : screenId === 'screen-quiz' ? 'play'
      : screenId === 'screen-home' ? 'home'
        : screenId === 'screen-advice' ? 'advice'
          : screenId === 'screen-about' ? 'about'
            : screenId === 'screen-garden' ? 'garden'
              : null;

  ['home', 'play', 'advice', 'about', 'garden'].forEach(id => {
    const desktopLink = document.getElementById(`nav-${id}`);
    const drawerLink = document.getElementById(`dl-${id}`);
    [desktopLink, drawerLink].forEach(link => {
      if (!link) return;
      const active = id === activeId;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  });
}

/** Pad un numéro sur 2 chiffres */
const pad = n => String(n).padStart(2, '0');

// ── JEU — INITIALISATION ───────────────────────────────────

function startGame() {
  deck = pickCards(CARDS, GAME_CARD_COUNT);
  currentIndex = 0;
  score = 0;
  answered = false;
  showScreen('screen-quiz');
  loadCard();
}

function restartGame() {
  startGame();
}

// ── JEU — CHARGEMENT D'UNE CARTE ──────────────────────────

function loadCard() {
  if (currentIndex >= deck.length) {
    showResults();
    return;
  }

  const card = deck[currentIndex];
  answered = false;

  // Textes
  document.getElementById('card-number').textContent    = pad(currentIndex + 1);
  document.getElementById('card-statement').textContent = card.statement;

  // Réinitialise la carte (côté question)
  const cardFront = document.getElementById('card-front');
  const questionFace = cardFront.querySelector('.card-question');
  const revealFace   = cardFront.querySelector('.card-reveal');

  questionFace.style.display = 'flex';
  revealFace.classList.remove('visible');
  revealFace.style.display = 'none';

  // Reset boutons
  const btnMyth = document.getElementById('btn-myth');
  const btnFact = document.getElementById('btn-fact');
  btnMyth.disabled = false;
  btnFact.disabled = false;
  btnMyth.classList.remove('correct-pick', 'wrong-pick');
  btnFact.classList.remove('correct-pick', 'wrong-pick');

  // Cache le bouton "suivant"
  document.getElementById('next-wrap').classList.remove('visible');

  // Barre de progression
  const pct = (currentIndex / deck.length) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-label').textContent = `${currentIndex + 1} / ${deck.length}`;

  // Score
  updateScoreDisplay();

  // Animation d'entrée de la carte
  cardFront.style.opacity = '0';
  cardFront.style.transform = 'translateY(20px)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cardFront.style.transition = 'opacity .35s ease, transform .35s ease';
      cardFront.style.opacity = '1';
      cardFront.style.transform = 'translateY(0)';
    });
  });
}

// ── JEU — RÉPONSE ─────────────────────────────────────────

function submitAnswer(userChoice) {
  if (answered) return;
  answered = true;

  const card = deck[currentIndex];
  const isCorrect = (userChoice === card.type);

  if (isCorrect) score++;

  // Colore les boutons
  const btnMyth = document.getElementById('btn-myth');
  const btnFact = document.getElementById('btn-fact');
  btnMyth.disabled = true;
  btnFact.disabled = true;

  // Bouton sélectionné
  const selectedBtn = userChoice === 'myth' ? btnMyth : btnFact;
  const correctBtn  = card.type === 'myth' ? btnMyth : btnFact;

  if (isCorrect) {
    selectedBtn.classList.add('correct-pick');
  } else {
    selectedBtn.classList.add('wrong-pick');
    correctBtn.classList.add('correct-pick');
  }

  // Feedback visuel centré
  showFeedback(isCorrect);

  // Retourne la carte (affiche explication)
  flipCard(card, isCorrect);

  // Montre le bouton suivant
  setTimeout(() => {
    document.getElementById('next-wrap').classList.add('visible');
    // Libelle si dernière carte
    const label = currentIndex === deck.length - 1 ? 'Voir mes résultats' : 'Question suivante';
    document.getElementById('btn-next-label').textContent = label;
  }, 600);

  updateScoreDisplay();
}

// ── JEU — FEEDBACK OVERLAY ────────────────────────────────

function showFeedback(isCorrect) {
  const el = document.getElementById('answer-feedback');
  const txt = document.getElementById('feedback-text');
  txt.textContent = isCorrect ? '✅ Bravo !' : '❌ Dommage !';
  el.style.color = isCorrect ? '#4ade80' : '#f87171';
  el.removeAttribute('aria-hidden');

  el.classList.remove('hide');
  el.classList.add('show');
  setTimeout(() => {
    el.classList.remove('show');
    el.classList.add('hide');
    setTimeout(() => {
      el.setAttribute('aria-hidden', 'true');
      el.classList.remove('hide');
    }, 300);
  }, 900);
}

// ── JEU — FLIP CARTE ──────────────────────────────────────

function flipCard(card, isCorrect) {
  const cardFront = document.getElementById('card-front');
  const questionFace = cardFront.querySelector('.card-question');
  const revealFace   = cardFront.querySelector('.card-reveal');

  // Prépare le contenu reveal
  const verdictEl = document.getElementById('reveal-verdict');
  if (card.type === 'myth') {
    verdictEl.textContent = '❌ C\'est un MYTHE';
    verdictEl.className = 'reveal-verdict is-myth';
  } else {
    verdictEl.textContent = '✅ C\'est un FAIT';
    verdictEl.className = 'reveal-verdict is-fact';
  }
  document.getElementById('reveal-explanation').textContent = card.explanation;
  document.getElementById('reveal-source').textContent      = '📚 Source : ' + card.source;

  // Animation : slide vers le haut puis affiche reveal
  cardFront.style.transition = 'transform .25s ease, opacity .25s ease';
  cardFront.style.transform  = 'translateY(-8px)';
  cardFront.style.opacity    = '.7';

  setTimeout(() => {
    questionFace.style.display = 'none';
    revealFace.style.display   = 'flex';
    revealFace.classList.add('visible');

    cardFront.style.transform = 'translateY(0)';
    cardFront.style.opacity   = '1';

    // Ajoute animation selon correct/incorrect
    cardFront.classList.remove('shake', 'bounce');
    void cardFront.offsetWidth; // reflow
    cardFront.classList.add(isCorrect ? 'bounce' : 'shake');
    setTimeout(() => cardFront.classList.remove('bounce', 'shake'), 500);
  }, 250);
}

// ── JEU — CARTE SUIVANTE ──────────────────────────────────

function nextCard() {
  const cardFront = document.getElementById('card-front');

  // Slide out vers le bas
  cardFront.style.transition = 'transform .3s ease, opacity .3s ease';
  cardFront.style.transform  = 'translateY(30px)';
  cardFront.style.opacity    = '0';

  setTimeout(() => {
    currentIndex++;
    loadCard();
  }, 300);
}

// ── JEUX — SCORE DISPLAY ─────────────────────────────────

function updateScoreDisplay() {
  document.getElementById('score-display').textContent = score + ' ✓';
}

// ── RÉSULTATS ─────────────────────────────────────────────

function showResults() {
  const total = deck.length;
  const wrong = total - score;
  const pct   = score / total; // 0 à 1

  // Texte dynamique selon score
  let title, message;
  if (pct >= .9) {
    title   = 'Expert(e) Octobre Rose ! 🎀';
    message = 'Tu maîtrises parfaitement le sujet. Partage tes connaissances autour de toi !';
  } else if (pct >= .7) {
    title   = 'Très bien joué ! 💪';
    message = 'Tu connais bien le sujet. Quelques nuances à explorer, mais tu as les bons réflexes.';
  } else if (pct >= .5) {
    title   = 'Pas mal du tout ! 👍';
    message = 'Tu progresses ! Les mythes autour du cancer du sein sont nombreux — tu sauras maintenant les démystifier.';
  } else {
    title   = 'Bonne découverte ! 🌸';
    message = 'Ce quiz t\'a permis d\'en apprendre plus. Partage-le autour de toi pour sensibiliser tes proches !';
  }

  document.getElementById('result-title').textContent   = title;
  document.getElementById('result-message').textContent = message;
  document.getElementById('ring-score').textContent     = score;
  document.getElementById('ring-total').textContent     = '/' + total;
  document.getElementById('bd-correct').textContent     = score;
  document.getElementById('bd-wrong').textContent       = wrong;

  showScreen('screen-result');

  // Anime l'anneau de score (327 = circonférence pour r=52)
  const circumference = 327;
  setTimeout(() => {
    const offset = circumference - pct * circumference;
    const ringFill = document.getElementById('ring-fill');
    ringFill.style.stroke = 'url(#ringGrad)';
    ringFill.style.strokeDashoffset = offset;
  }, 300);
}

// ── SVG GRADIENT INJECT ───────────────────────────────────
// Injecte un defs SVG dans le DOM pour le dégradé du ring
(function injectSvgGradient() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  const defs = document.createElementNS(svgNS, 'defs');
  const grad = document.createElementNS(svgNS, 'linearGradient');
  grad.setAttribute('id', 'ringGrad');
  grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '100%');
  const s1 = document.createElementNS(svgNS, 'stop');
  s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', '#D63384');
  const s2 = document.createElementNS(svgNS, 'stop');
  s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', '#9B59FA');
  grad.appendChild(s1); grad.appendChild(s2);
  defs.appendChild(grad); svg.appendChild(defs);
  document.body.appendChild(svg);
})();


// ── NAVBAR — BURGER MENU ──────────────────────────────────

/** Retour a l accueil */
function goHome() {
  showScreen('screen-home');
}

/** Ouvre/ferme le drawer burger */
function toggleMenu() {
  const drawer  = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  const burger  = document.getElementById('burger-btn');
  const isOpen  = drawer.classList.contains('open');
  if (isOpen) { closeMenu(); return; }
  drawer.classList.add('open');
  overlay.classList.add('open');
  burger.classList.add('is-open');
  burger.setAttribute('aria-label', 'Fermer le menu');
  burger.setAttribute('aria-expanded', 'true');
  drawer.setAttribute('aria-hidden', 'false');
  drawer.inert = false;
  document.body.style.overflow = 'hidden';
  document.querySelector('.drawer-close-btn').focus();
}

/** Ferme le drawer et rend le focus au bouton burger si nécessaire */
function closeMenu(returnFocus = true) {
  const drawer  = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  const burger  = document.getElementById('burger-btn');
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-label', 'Ouvrir le menu');
  burger.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.inert = true;
  document.body.style.overflow = '';
  if (returnFocus && window.matchMedia('(max-width: 960px)').matches) burger.focus();
}

window.addEventListener('resize', function() {
  if (window.matchMedia('(min-width: 961px)').matches
      && document.getElementById('drawer').classList.contains('open')) {
    closeMenu(false);
  }
});

/** Touche Echap : ferme le drawer s'il est ouvert */
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  if (document.getElementById('drawer').classList.contains('open')) {
    closeMenu();
  }
});

// ── JARDIN DES MESSAGES POSITIFS ──────────────────────────

(function initGarden() {
  // Réglages des rangées, tailles, virtualisation et plafond d'affichage.
  const NB_ROWS = 4;
  const FLOWER_SIZES = [28, 36, 46, 56];
  const MOBILE_FLOWER_SIZES = [24, 34, 44];
  const MAX_FLOWERS = 300;
  const BUFFER_SCREENS = 1;
  const PALETTES = [
    ['#E8509A', '#FFC2DA'], ['#C93580', '#F8D7E3'], ['#F78FB8', '#FFE3EE'],
    ['#B04A9A', '#F1CBE8'], ['#FF6F9F', '#FFD6E4'], ['#9C2F6E', '#F2C4D8']
  ];

  const form = document.getElementById('garden-form');
  const nameInput = document.getElementById('garden-name');
  const msgInput = document.getElementById('garden-msg');
  const gardenScreen = document.getElementById('screen-garden');
  const websiteInput = document.getElementById('garden-website');
  const track = document.getElementById('garden-track');
  const empty = document.getElementById('garden-empty');
  const bubble = document.getElementById('garden-bubble');
  const thanks = document.getElementById('garden-thanks');
  const viewport = document.getElementById('garden-viewport');
  const world = document.getElementById('garden-world');
  const count = document.getElementById('garden-count');
  const progress = document.querySelector('.garden-progress');
  const progressFill = document.getElementById('garden-progress-fill');
  const leftButton = document.getElementById('garden-scroll-left');
  const rightButton = document.getElementById('garden-scroll-right');
  const allButton = document.getElementById('garden-all-button');
  const modal = document.getElementById('garden-modal');
  const modalClose = document.getElementById('garden-modal-close');
  const searchInput = document.getElementById('garden-search');
  const modalCount = document.getElementById('garden-modal-count');
  const messageList = document.getElementById('garden-message-list');

  if (!form || !nameInput || !msgInput || !gardenScreen || !websiteInput
      || !track || !empty || !bubble || !thanks
      || !viewport || !world || !count || !progress || !progressFill
      || !leftButton || !rightButton || !allButton || !modal || !modalClose
      || !searchInput || !modalCount || !messageList) {
    throw new Error('Éléments du jardin introuvables dans la page.');
  }

  const mobileQuery = window.matchMedia('(max-width: 639px)');
  let items = [];
  let layout = [];
  let rowCount = NB_ROWS;
  let flowerGap = 70;
  let bubbleTimer;
  let thanksTimer;
  let inertiaFrame;
  let suppressNextClick = false;
  let pendingFlowerIndex = null;
  const renderedFlowers = new Map();

  function setStatus(message, isError = false) {
    thanks.textContent = message;
    thanks.classList.toggle('is-error', isError);
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index++) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function getRowCount() {
    return mobileQuery.matches ? 3 : NB_ROWS;
  }

  function readFlowerGap() {
    const value = Number.parseFloat(
      window.getComputedStyle(document.documentElement).getPropertyValue('--flower-gap')
    );
    return Number.isFinite(value) && value > 0 ? value : 70;
  }

  function getFlowerSize(row) {
    return (mobileQuery.matches ? MOBILE_FLOWER_SIZES : FLOWER_SIZES)[row];
  }

  function drawFlower(canvas, seed) {
    canvas.width = 16;
    canvas.height = 24;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Le dessin des fleurs n’est pas pris en charge par ce navigateur.');

    const [petal, light] = PALETTES[seed % PALETTES.length];
    const pixel = (x, y, color) => {
      context.fillStyle = color;
      context.fillRect(x, y, 1, 1);
    };

    for (let y = 11; y < 24; y++) {
      pixel(8, y, '#2F7A3A');
      pixel(7, y, '#4C9A4F');
    }
    [[5, 19], [4, 18], [3, 17], [6, 20], [10, 21], [11, 20], [12, 19], [9, 22]]
      .forEach(([x, y]) => pixel(x, y, '#7FCB6A'));
    [[5, 20], [4, 19], [10, 22], [11, 21]]
      .forEach(([x, y]) => pixel(x, y, '#58A94D'));
    [[6, 15], [5, 14], [5, 16], [10, 15], [11, 14], [11, 16], [7, 15], [8, 15], [9, 15]]
      .forEach(([x, y]) => pixel(x, y, '#E8509A'));
    pixel(8, 15, '#A8246B');

    const centerX = 7.5;
    const centerY = 5.5;
    for (let k = 0; k < 5; k++) {
      const angle = -Math.PI / 2 + k * 2 * Math.PI / 5;
      const petalX = centerX + Math.cos(angle) * 3.3;
      const petalY = centerY + Math.sin(angle) * 3.3;
      for (let y = 0; y < 12; y++) {
        for (let x = 0; x < 16; x++) {
          const distance = Math.hypot(x - petalX, y - petalY);
          if (distance <= 2.6) pixel(x, y, distance <= 1.3 ? light : petal);
        }
      }
    }

    for (let y = 0; y < 12; y++) {
      for (let x = 0; x < 16; x++) {
        const distance = Math.hypot(x - centerX, y - centerY);
        if (distance <= 1.9) pixel(x, y, distance <= 1 ? '#C98A1E' : '#F5C04A');
      }
    }
  }

  // ── Connexion à l'API (remplace le localStorage) ──
  const API_URL = '/api/garden-messages';
  const SYNC_INTERVAL = 30000;      // rafraîchit le jardin toutes les 30 s
  let sending = false;
  let ignoreSyncUntil = 0;

  // La couleur de la fleur est dérivée de l'id : identique pour tous les visiteurs
  function seedFromId(id) {
    return hashString(String(id)) % PALETTES.length;
  }

  function fromApi(row) {
    return { id: row.id, name: row.first_name, msg: row.message, seed: seedFromId(row.id) };
  }

  // L'API renvoie les plus récents d'abord : on inverse (ancien → récent)
  async function fetchMessages() {
    const response = await fetch(API_URL, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Impossible de charger les fleurs pour le moment.');
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error('Réponse inattendue du serveur.');
    return rows.map(fromApi).reverse();
  }

  function applyItems(next) {
    const same = next.length === items.length && next.every((item, i) => item.id === items[i].id);
    if (same) {
      empty.textContent = 'Plante la première fleur du jardin 🌸';
      return;
    }
    const wasAtEnd = Math.abs(viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft) < 4;
    bubble.style.display = 'none';
    track.replaceChildren();
    renderedFlowers.clear();
    items = next;
    empty.textContent = 'Plante la première fleur du jardin 🌸';
    refreshGarden();
    if (wasAtEnd) viewport.scrollLeft = viewport.scrollWidth;
  }

  async function syncGarden() {
    if (Date.now() < ignoreSyncUntil) return;
    try {
      const next = await fetchMessages();
      if (Date.now() < ignoreSyncUntil) return;
      applyItems(next);
    } catch (error) {
      // silencieux : on garde les fleurs déjà affichées
    }
  }

  function positionBubble(flowerButton) {
    const rect = flowerButton.getBoundingClientRect();
    const bubbleWidth = bubble.offsetWidth;
    const bubbleHeight = bubble.offsetHeight;
    const margin = 8;
    const left = Math.max(
      margin,
      Math.min(window.innerWidth - bubbleWidth - margin, rect.left + (rect.width - bubbleWidth) / 2)
    );
    const navbar = document.querySelector('.navbar');
    const navbarBottom = navbar ? navbar.getBoundingClientRect().bottom : 0;
    let top = rect.top - bubbleHeight - margin;

    if (top < navbarBottom || top < margin) top = rect.bottom + margin;

    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
  }

  function createFlower(item, index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'garden-plant';
    button.setAttribute('aria-label', `Message de ${item.name}`);
    button.dataset.flowerIndex = String(index);

    const label = document.createElement('span');
    label.className = 'garden-name';
    label.textContent = item.name;

    const canvas = document.createElement('canvas');
    drawFlower(canvas, item.seed);
    button.append(label, canvas);
    button.addEventListener('click', event => {
      event.stopPropagation();
      if (suppressNextClick) {
        suppressNextClick = false;
        return;
      }
      if (bubble.dataset.flowerIndex === String(index) && bubble.style.display === 'block') {
        bubble.style.display = 'none';
        return;
      }
      bubble.replaceChildren();
      const author = document.createElement('b');
      author.textContent = item.name;
      bubble.append(author, document.createTextNode(item.msg));
      bubble.dataset.flowerIndex = String(index);
      bubble.style.display = 'block';
      positionBubble(button);
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => {
        bubble.style.display = 'none';
      }, 6000);
    });
    return button;
  }

  function calculateLayout() {
    rowCount = getRowCount();
    flowerGap = readFlowerGap();
    const rowPositions = Math.ceil(items.length / rowCount);
    world.style.width = `${Math.max(viewport.clientWidth, rowPositions * flowerGap + flowerGap)}px`;

    const firstIndex = Math.max(0, items.length - MAX_FLOWERS);
    layout = [];
    for (let index = firstIndex; index < items.length; index++) {
      const item = items[index];
      const row = index % rowCount;
      const stableHash = hashString(`${item.id}\u0000${item.name}`);
      const jitter = ((stableHash % 10001) / 10000 - 0.5) * flowerGap * 0.24;
      const bottomJitter = (((stableHash >>> 8) % 1001) / 1000 - 0.5) * 4;
      const stagger = row * flowerGap / 2;
      const x = Math.max(0, Math.floor(index / rowCount) * flowerGap + stagger + jitter);
      const bottoms = rowCount === 3 ? [44, 23, 4] : [55, 38, 20, 4];
      layout.push({
        index,
        row,
        x,
        bottom: bottoms[row] + bottomJitter,
        size: getFlowerSize(row),
        hash: stableHash
      });
    }
  }

  function createFlowerNode(entry) {
    const flower = createFlower(items[entry.index], entry.index);
    flower.style.left = `${entry.x}px`;
    flower.style.bottom = `${entry.bottom}%`;
    flower.style.zIndex = String(entry.row + 1);
    flower.style.setProperty('--flower-size', `${entry.size}px`);
    flower.style.setProperty('--sway-delay', `-${entry.hash % 3000}ms`);
    flower.classList.add(`garden-row-${entry.row}`);
    track.appendChild(flower);
    renderedFlowers.set(entry.index, flower);
    return flower;
  }

  function renderVisibleFlowers() {
    const firstX = Math.max(0, viewport.scrollLeft - viewport.clientWidth * BUFFER_SCREENS);
    const lastX = viewport.scrollLeft + viewport.clientWidth * (1 + BUFFER_SCREENS);
    const visibleIndices = new Set();

    layout.forEach(entry => {
      if (entry.x + entry.size < firstX || entry.x > lastX) return;
      visibleIndices.add(entry.index);
      const flower = renderedFlowers.get(entry.index) || createFlowerNode(entry);
      flower.style.left = `${entry.x}px`;
      flower.style.bottom = `${entry.bottom}%`;
      flower.style.zIndex = String(entry.row + 1);
      flower.style.setProperty('--flower-size', `${entry.size}px`);
      flower.classList.remove('garden-row-0', 'garden-row-1', 'garden-row-2', 'garden-row-3');
      flower.classList.add(`garden-row-${entry.row}`);
      if (entry.index === pendingFlowerIndex) {
        pendingFlowerIndex = null;
        flower.classList.add('grow', 'new-flower-halo');
        setTimeout(() => flower.classList.remove('grow', 'new-flower-halo'), 1600);
      }
    });

    renderedFlowers.forEach((flower, index) => {
      if (visibleIndices.has(index)) return;
      if (bubble.style.display === 'block' && bubble.dataset.flowerIndex === String(index)) {
        bubble.style.display = 'none';
      }
      flower.remove();
      renderedFlowers.delete(index);
    });
  }

  function updateScrollIndicators() {
    const maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const current = Math.min(maximum, Math.max(0, viewport.scrollLeft));
    const percent = maximum ? (current / maximum) * 100 : 100;
    viewport.classList.toggle('can-scroll-left', current > 2);
    viewport.classList.toggle('can-scroll-right', current < maximum - 2);
    leftButton.disabled = current <= 2;
    rightButton.disabled = current >= maximum - 2;
    progressFill.style.width = `${percent}%`;
    progress.setAttribute('aria-valuenow', String(Math.round(percent)));
    count.textContent = `${renderedFlowers.size} / ${items.length} fleurs`;
    allButton.hidden = items.length <= MAX_FLOWERS;
    allButton.textContent = `Voir tous les messages (${items.length})`;
  }

  function refreshGarden() {
    calculateLayout();
    empty.hidden = items.length > 0;
    renderVisibleFlowers();
    updateScrollIndicators();
  }

  function showAllMessages() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const filtered = query
      ? items.filter(item =>
        item.name.toLocaleLowerCase().includes(query)
        || item.msg.toLocaleLowerCase().includes(query))
      : items;
    const fragment = document.createDocumentFragment();
    [...filtered].reverse().forEach(item => {
      const entry = document.createElement('li');
      const author = document.createElement('strong');
      const message = document.createElement('p');
      author.textContent = item.name;
      message.textContent = item.msg;
      entry.append(author, message);
      fragment.appendChild(entry);
    });
    messageList.replaceChildren(fragment);
    modalCount.textContent = `${filtered.length} message${filtered.length === 1 ? '' : 's'}`;
  }

  async function initialLoad() {
    refreshGarden();
    try {
      items = await fetchMessages();
      refreshGarden();
      requestAnimationFrame(() => {
        viewport.scrollLeft = viewport.scrollWidth;
        refreshGarden();
      });
    } catch (error) {
      setStatus(error.message, true);
      empty.textContent = 'Impossible de charger les fleurs pour le moment.';
    }
  }

  initialLoad();
  window.setInterval(() => {
    if (!document.hidden && gardenScreen.classList.contains('active')) syncGarden();
  }, SYNC_INTERVAL);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && gardenScreen.classList.contains('active')) syncGarden();
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    if (!name || !message) {
      setStatus('Ajoute ton prénom et un message positif.', true);
      return;
    }

    sending = true;
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: name,
          message,
          website: websiteInput.value
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Impossible de planter ta fleur. Réessaie.');
      }
      if (!result.id) throw new Error('Impossible de planter ta fleur. Réessaie.');

      const item = fromApi(result);
      items = items.filter(existing => existing.id !== item.id);
      items.push(item);
      ignoreSyncUntil = Date.now() + SYNC_INTERVAL;
      const newIndex = items.length - 1;
      pendingFlowerIndex = newIndex;
      refreshGarden();
      const newFlower = layout.find(entry => entry.index === newIndex);
      if (newFlower) {
        viewport.scrollTo({
          left: Math.max(0, newFlower.x - viewport.clientWidth / 2),
          behavior: 'smooth'
        });
      }

      form.reset();
      setStatus('Merci ! Ta fleur est plantée 🌸');
      clearTimeout(thanksTimer);
      thanksTimer = setTimeout(() => setStatus(''), 4000);
    } catch (error) {
      setStatus(error.message || 'Impossible de planter ta fleur pour le moment.', true);
    } finally {
      sending = false;
      if (submitButton) submitButton.disabled = false;
    }
  });

  document.addEventListener('click', event => {
    if (event.target.closest('.garden-plant, .garden-bubble')) return;
    bubble.style.display = 'none';
  });

  viewport.addEventListener('scroll', () => {
    bubble.style.display = 'none';
    renderVisibleFlowers();
    updateScrollIndicators();
  }, { passive: true });
  window.addEventListener('scroll', () => {
    bubble.style.display = 'none';
  }, { passive: true });
  window.addEventListener('resize', () => {
    bubble.style.display = 'none';
  });

  leftButton.addEventListener('click', () => {
    viewport.scrollBy({ left: -viewport.clientWidth * 0.8, behavior: 'smooth' });
  });
  rightButton.addEventListener('click', () => {
    viewport.scrollBy({ left: viewport.clientWidth * 0.8, behavior: 'smooth' });
  });

  viewport.addEventListener('wheel', event => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    viewport.scrollLeft += event.deltaY;
  }, { passive: false });

  let pointerStartX = 0;
  let previousPointerX = 0;
  let pointerVelocity = 0;
  let pointerMoved = false;

  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    cancelAnimationFrame(inertiaFrame);
    pointerStartX = event.clientX;
    previousPointerX = event.clientX;
    pointerVelocity = 0;
    pointerMoved = false;
    viewport.classList.add('is-dragging');
  });

  viewport.addEventListener('pointermove', event => {
    if (!viewport.classList.contains('is-dragging')) return;
    const delta = event.clientX - previousPointerX;
    if (!pointerMoved && Math.abs(event.clientX - pointerStartX) <= 5) {
      previousPointerX = event.clientX;
      return;
    }
    if (!pointerMoved) {
      pointerMoved = true;
      viewport.setPointerCapture(event.pointerId);
    }
    viewport.scrollLeft -= delta;
    pointerVelocity = delta;
    previousPointerX = event.clientX;
  });

  function stopDragging(event) {
    if (!viewport.classList.contains('is-dragging')) return;
    viewport.classList.remove('is-dragging');
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    if (pointerMoved) suppressNextClick = true;

    let velocity = -pointerVelocity * 0.35;
    function coast() {
      if (Math.abs(velocity) < 0.5) return;
      viewport.scrollLeft += velocity;
      velocity *= 0.92;
      inertiaFrame = requestAnimationFrame(coast);
    }
    inertiaFrame = requestAnimationFrame(coast);
    setTimeout(() => {
      suppressNextClick = false;
    }, 250);
  }

  viewport.addEventListener('pointerup', stopDragging);
  viewport.addEventListener('pointercancel', stopDragging);
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);

  function handleResize() {
    const wasAtEnd = Math.abs(viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft) < 4;
    refreshGarden();
    if (wasAtEnd) viewport.scrollLeft = viewport.scrollWidth;
  }

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(handleResize).observe(viewport);
  } else {
    window.addEventListener('resize', handleResize);
  }
  mobileQuery.addEventListener('change', handleResize);

  allButton.addEventListener('click', () => {
    searchInput.value = '';
    showAllMessages();
    modal.showModal();
  });
  modalClose.addEventListener('click', () => modal.close());
  searchInput.addEventListener('input', showAllMessages);
  modal.addEventListener('click', event => {
    if (event.target === modal) modal.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') bubble.style.display = 'none';
  });

  window.openGarden = function() {
    showScreen('screen-garden');
    syncGarden();
    setTimeout(() => nameInput.focus({ preventScroll: true }), 450);
  };
})();
