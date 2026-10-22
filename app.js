/* ============================================================
   Mythe ou Fait ? — Octobre Rose
   app.js — Logique du mini-jeu
============================================================ */

'use strict';

// ── STATE ──────────────────────────────────────────────────
let deck = [];          // cartes mélangées
let currentIndex = 0;  // index actif
let score = 0;         // bonnes réponses
let answered = false;  // carte courante déjà répondue ?

// ── HELPERS ────────────────────────────────────────────────

/** Mélange un tableau en place (Fisher-Yates) */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Affiche un écran, cache les autres */
function showScreen(id) {
  const target = document.getElementById(id);
  if (!target || !target.classList.contains('screen')) {
    throw new Error(`Écran introuvable : ${id}`);
  }

  document.body.classList.toggle('quiz-active', id === 'screen-quiz');
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
            : null;

  ['home', 'play', 'advice', 'about'].forEach(id => {
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
  deck = shuffle([...CARDS]);
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
