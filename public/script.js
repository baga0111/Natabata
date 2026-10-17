const buildVersion = '2026-10-16-connections-secrets';
const puzzleDays = [
  {
    label: 'თამაში 001',
    date: '2 ოქტომბერი, პარასკევი',
    words: [
      { word: 'დაიმონდები', group: 'Travel town', color: 'yellow' },
      { word: 'ენერგიები', group: 'Travel town', color: 'yellow' },
      { word: 'შეჯვარება', group: 'Travel town', color: 'yellow' },
      { word: '73', group: 'Travel town', color: 'yellow' },
      { word: 'Days', group: 'The games we played', fullName: 'Days since', color: 'teal' },
      { word: 'Elmwood', group: 'The games we played', fullName: 'Elmwood tree', color: 'teal' },
      { word: 'The past', group: 'The games we played', fullName: 'The past within', color: 'teal' },
      { word: 'Escape', group: 'The games we played', fullName: 'Escape lab', color: 'teal' },
      { word: 'Ida', group: 'The names of our children', color: 'coral' },
      { word: 'Maxime', group: 'The names of our children', color: 'coral' },
      { word: 'ნათლია', group: 'The names of our children', color: 'coral' },
      { word: 'ნატო junior', group: 'The names of our children', color: 'coral' },
      { word: 'Monet pro hole', group: 'Where it all happened', color: 'lilac' },
      { word: 'phobia', group: 'Where it all happened', color: 'lilac' },
      { word: 'Beg like An', group: 'Where it all happened', color: 'lilac' },
      { word: 'star oh, step in, follow', group: 'Where it all happened', color: 'lilac' }
    ]
  },
  {
    label: 'თამაში 002',
    date: 'ახალი დღე',
    words: [
      { word: 'Thumb', group: 'Keyiahanke Favourtie sayings', color: 'yellow' },
      { word: 'თმაში შეუცურა', group: 'Keyiahanke Favourtie sayings', color: 'yellow' },
      { word: 'ნეკნები', group: 'Keyiahanke Favourtie sayings', color: 'yellow' },
      { word: 'იბლარება', group: 'Keyiahanke Favourtie sayings', color: 'yellow' },
      { word: 'ბობი', group: 'Ankoras პერსონაჟები', color: 'teal' },
      { word: 'ტომასი', group: 'Ankoras პერსონაჟები', color: 'teal' },
      { word: 'ალისა', group: 'Ankoras პერსონაჟები', color: 'teal' },
      { word: 'სანი', group: 'Ankoras პერსონაჟები', color: 'teal' },
      { word: 'Pizza van', group: 'Beglika', color: 'coral' },
      { word: 'sam and dan', group: 'Beglika', color: 'coral' },
      { word: 'electricity', group: 'Beglika', color: 'coral' },
      { word: 'lentils', group: 'Beglika', color: 'coral' },
      { word: 'Nevsky', group: 'Associated with sofia', color: 'lilac' },
      { word: 'Avocado taost', group: 'Associated with sofia', color: 'lilac' },
      { word: 'McDonalds', group: 'Associated with sofia', color: 'lilac' },
      { word: 'Utito', group: 'Associated with sofia', color: 'lilac' }
    ]
  }
];

const grid = document.querySelector('#word-grid');
const solvedGroups = document.querySelector('#solved-groups');
const message = document.querySelector('#message');
const submitButton = document.querySelector('#submit-button');
const reactionModal = document.querySelector('#reaction-modal');
const reactionImage = document.querySelector('#reaction-image');
const reactionCopy = document.querySelector('#reaction-copy');
const reactionTitle = document.querySelector('#reaction-title');
const reactionNote = document.querySelector('#reaction-note');
const selected = new Set();
const solved = new Set();
const eggStorageKey = 'connections-easter-eggs';
const eggCompletionStorageKey = 'connections-easter-eggs-complete';
const viewStorageKey = 'connections-active-view';
const collectedEggs = new Set(JSON.parse(localStorage.getItem(eggStorageKey) || '[]'));
const hintButton = document.querySelector('#hint-button');
const hintPanel = document.querySelector('#hint-panel');
const secondHintButton = document.querySelector('#second-hint-button');
const secondHintPanel = document.querySelector('#second-hint-panel');
const secondHintForm = document.querySelector('#second-hint-form');
const secondHintKeyword = document.querySelector('#second-hint-keyword');
const secondHintMessage = document.querySelector('#second-hint-message');
const secondHintContent = document.querySelector('#second-hint-content');
const secondHintAnswer = `Yolk above, then meadow, then blood below, that’s the order of my banner.
Old words live on in my mouth, distant cousins of Sanskrit.
Under my name, if you dig deep enough, you’ll find only rain.
Nowhere in Europe did the old gods hold out longer than with me.
Europe’s very middle, some surveyors swear, hides in my woods.
Very first was I to slip out of the red empire’s chain.
Eaten at my table: airships made of potato, stuffed with meat.
Resin of ancient pines washes onto my shore as gold.
Knight on a white horse gallops forever across my shield.
Nests of white storks crown my rooftops every spring.
Once my borders stretched from one sea all the way to the Black one.
When an orange ball flies, my whole country holds its breath.
Wooden crosses, thousands upon thousands, grow on my hill like a forest.
I am the southern one of three sisters by the sea.
Two million hands once joined in a chain across me and my sisters.
Hills of sand wander along my narrow finger into the sea.
My old capital is a red castle standing on an island in a lake.
End of the riddle: say my name, and you’ll know where I’ll be.`;
const hiddenDateButton = document.querySelector('#hidden-date-button');
const dateHintPanel = document.querySelector('#date-hint-panel');
const dateHintForm = document.querySelector('#date-hint-form');
const dateHintKeyword = document.querySelector('#date-hint-keyword');
const dateHintMessage = document.querySelector('#date-hint-message');
const dateHintContent = document.querySelector('#date-hint-content');
const eggProgress = document.querySelector('#egg-progress');
const connectionsDay = document.querySelector('#connections-day');
const connectionsDayLabel = document.querySelector('#connections-day-label');
const pageTitle = document.querySelector('#page-title');
const titleMessagePanel = document.querySelector('#title-message-panel');
let currentWords = puzzleDays[0].words;
let currentDayIndex = 0;
let mistakesLeft = 4;
let gameOver = false;

function revealPageTitle() {
  titleMessagePanel.hidden = false;
}

pageTitle.addEventListener('click', revealPageTitle);
pageTitle.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    revealPageTitle();
  }
});
function closeTitleMessage() {
  titleMessagePanel.hidden = true;
}

document.querySelector('#close-title-message').addEventListener('click', closeTitleMessage);
document.querySelector('[data-close-title-message]').addEventListener('click', closeTitleMessage);

function createScatteredWords(words) {
  const groups = [...new Set(words.map((item) => item.group))].map((group) => ({
    group,
    words: words.filter((item) => item.group === group).sort(() => Math.random() - 0.5)
  }));
  const scattered = [];
  let previousGroup = null;
  const rounds = Math.max(...groups.map((entry) => entry.words.length));
  for (let round = 0; round < rounds; round += 1) {
    const order = [...groups].sort(() => Math.random() - 0.5);
    if (order[0].group === previousGroup) [order[0], order[1]] = [order[1], order[0]];
    order.forEach((entry) => {
      if (entry.words[round]) scattered.push(entry.words[round]);
    });
    previousGroup = order.at(-1).group;
  }
  return scattered;
}

function showReaction(imageName, title = '', note = '') {
  reactionImage.src = imageName;
  reactionTitle.textContent = title;
  reactionNote.textContent = note;
  reactionCopy.hidden = !title && !note;
  reactionModal.hidden = false;
}

function closeReaction() {
  reactionModal.hidden = true;
  reactionImage.src = '';
  reactionCopy.hidden = true;
}

function showEggCompletion() {
  showReaction('elami.png', 'Bravo TOOO', 'Somethin I started when I came here and finished a couple of weeks ago');
}

function renderEggProgress() {
  const eggIds = ['number-1', 'number-2', 'number-3', 'number-4', 'number-5', 'number-6', 'picture'];
  eggProgress.innerHTML = eggIds.map((eggId) => {
    if (!collectedEggs.has(eggId)) return '<span class="egg-slot empty">?</span>';
    if (eggId === 'picture') return '<span class="egg-slot found-image"><img src="პრავა.png" alt="პრავა" /></span>';
    const item = document.querySelector(`[data-egg-id="${eggId}"]`);
    return `<span class="egg-slot">${item.dataset.eggValue}</span>`;
  }).join('');
}

function collectEgg(egg) {
  if (collectedEggs.has(egg.dataset.eggId)) return;
  collectedEggs.add(egg.dataset.eggId);
  localStorage.setItem(eggStorageKey, JSON.stringify([...collectedEggs]));
  renderEggProgress();
  hintPanel.hidden = false;
  hintButton.setAttribute('aria-expanded', 'true');
  if (collectedEggs.size === 7 && !localStorage.getItem(eggCompletionStorageKey)) {
    localStorage.setItem(eggCompletionStorageKey, 'true');
    showEggCompletion();
  }
}

function setView(view) {
  document.querySelectorAll('.nav-button').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  document.querySelector('#connections-view').hidden = view !== 'connections';
  document.querySelector('#salad-view').hidden = view !== 'salad';
  document.querySelector('#wordle-view').hidden = view !== 'wordle';
  document.querySelector('#riddles-view').hidden = view !== 'riddles';
  localStorage.setItem(viewStorageKey, view);
}

function renderGrid() {
  grid.innerHTML = '';
  currentWords.filter((item) => !solved.has(item.group)).forEach((item) => {
    const card = document.createElement('button');
    card.className = 'word-card';
    card.type = 'button';
    card.textContent = item.word;
    card.dataset.word = item.word;
    if (gameOver) {
      card.disabled = true;
      card.classList.add('revealed');
      card.insertAdjacentHTML('beforeend', `<small>${item.group}</small>`);
    }
    card.setAttribute('aria-pressed', selected.has(item.word));
    if (selected.has(item.word)) card.classList.add('selected');
    card.addEventListener('click', () => toggleSelection(item.word, card));
    grid.appendChild(card);
  });
  submitButton.disabled = selected.size !== 4;
}

function toggleSelection(word, card) {
  if (selected.has(word)) {
    selected.delete(word);
    card.classList.remove('selected');
  } else if (selected.size < 4) {
    selected.add(word);
    card.classList.add('selected');
  }
  card.setAttribute('aria-pressed', selected.has(word));
  submitButton.disabled = selected.size !== 4;
  message.className = 'message';
  message.textContent = selected.size === 4 ? 'მზადაა შემოწმებისთვის.' : 'შექმენი ოთხი ჯგუფი, თითოეულში ოთხი სიტყვით.';
}

function renderSolvedGroups() {
  solvedGroups.innerHTML = '';
  const groupOrder = [...new Set(puzzleDays[currentDayIndex].words.map((item) => item.group))];
  groupOrder.filter((group) => solved.has(group)).forEach((group) => {
    const groupWords = currentWords.filter((item) => item.group === group);
    solvedGroups.insertAdjacentHTML(
      'beforeend',
      `<div class="solved-group" data-color="${groupWords[0].color}"><strong>${group}</strong><span>${groupWords.map((item) => item.fullName || item.word).join(' · ')}</span></div>`
    );
  });
}

function submitGuess() {
  if (gameOver) return;
  const guessedWords = currentWords.filter((item) => selected.has(item.word));
  const group = guessedWords[0]?.group;
  const isMatch = guessedWords.length === 4 && guessedWords.every((item) => item.group === group);

  if (!isMatch) {
    const groupCounts = guessedWords.reduce((counts, item) => {
      counts[item.group] = (counts[item.group] || 0) + 1;
      return counts;
    }, {});
    const largestGroup = Math.max(...Object.values(groupCounts));
      message.className = 'message error';
      message.textContent = largestGroup === 3 ? 'ერთი აკლია.' : 'ჯერ არა. სცადე სხვა კომბინაცია.';
      if (largestGroup === 3) showReaction('one-away.png');
    mistakesLeft = Math.max(0, mistakesLeft - 1);
    document.querySelectorAll('.mistake-dots i')[mistakesLeft]?.classList.add('used');
    document.querySelectorAll('.word-card.selected').forEach((card) => {
      card.classList.add('shake');
      card.addEventListener('animationend', () => card.classList.remove('shake'), { once: true });
    });
    if (mistakesLeft === 0) {
      gameOver = true;
      selected.clear();
      message.textContent = 'ცდები ამოიწურა. პასუხები დაფაზეა ნაჩვენები.';
      renderGrid();
    }
    return;
  }

  solved.add(group);
  renderSolvedGroups();
  showReaction('correct.png');
  selected.clear();
  message.className = 'message';
  message.textContent = solved.size === 4 ? 'თამაში დასრულდა. შესანიშნავია.' : 'ეს კავშირია. გააგრძელე.';
  renderGrid();
}

function shuffleWords() {
  selected.clear();
  solved.clear();
  solvedGroups.innerHTML = '';
  mistakesLeft = 4;
  gameOver = false;
  document.querySelectorAll('.mistake-dots i').forEach((dot) => dot.classList.remove('used'));
  currentWords = createScatteredWords(puzzleDays[currentDayIndex].words);
  renderGrid();
}

function renderConnectionsDayOptions() {
  connectionsDay.innerHTML = puzzleDays.map((day, index) => (
    `<option value="${index}">${day.label}</option>`
  )).join('');
  connectionsDay.value = String(currentDayIndex);
}

function selectConnectionsDay(index) {
  currentDayIndex = index;
  const day = puzzleDays[currentDayIndex];
  connectionsDayLabel.innerHTML = `${day.label} <span aria-hidden="true">•</span> ${day.date}`;
  currentWords = createScatteredWords(day.words);
  shuffleWords();
}

document.querySelector('#shuffle-button').addEventListener('click', shuffleWords);
connectionsDay.addEventListener('change', () => selectConnectionsDay(Number(connectionsDay.value)));
document.querySelector('#deselect-button').addEventListener('click', () => {
  selected.clear();
  message.className = 'message';
  message.textContent = 'შექმენი ოთხი ჯგუფი, თითოეულში ოთხი სიტყვით.';
  renderGrid();
});
submitButton.addEventListener('click', submitGuess);
document.querySelector('#close-reaction').addEventListener('click', closeReaction);
document.querySelector('[data-close-reaction]').addEventListener('click', closeReaction);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeReaction();
});
currentWords = createScatteredWords(puzzleDays[currentDayIndex].words);
renderGrid();

const saladScenarios = [
  {
    title: 'ექვსი სიტყვა',
    answers: ['red', 'yellow', 'green', 'hint', 'love', 'hidden'],
    letters: ['d', 'n', 'i', 'h', 'e', 'd', 't', 'w', 'y', 'e', 'v', 'o', 'r', 'g', 'l', 'l']
  }
];
let saladBoardLetters = saladScenarios[0].letters;
let saladAnswers = saladScenarios[0].answers;
const saladBoard = document.querySelector('#salad-board');
const saladWords = document.querySelector('#salad-words');
const saladMessage = document.querySelector('#salad-message');
const saladHint = document.querySelector('#salad-hint');
const saladFound = new Set();
let saladPath = [];
let saladPointerDown = false;
let saladSolvedPaths = new Map();
let saladHintTimer;
let saladHintCount = 0;
let saladClearTimer;
let saladWordClearTimer;

function buildScenarioLetters(answers) {
  const maximumCounts = new Map();
  answers.forEach((word) => {
    const counts = new Map();
    [...word].forEach((letter) => counts.set(letter, (counts.get(letter) || 0) + 1));
    counts.forEach((count, letter) => maximumCounts.set(letter, Math.max(maximumCounts.get(letter) || 0, count)));
  });
  const letters = [];
  maximumCounts.forEach((count, letter) => {
    for (let index = 0; index < count; index += 1) letters.push(letter);
  });
  while (letters.length < 16) letters.push(letters[letters.length % Math.max(1, letters.length)] || 'ა');
  return letters.slice(0, 16);
}

function loadSaladScenario(index) {
  const scenario = saladScenarios[index];
  saladBoardLetters = scenario.letters || buildScenarioLetters(scenario.answers);
  saladAnswers = scenario.answers;
  document.querySelector('.salad-heading strong').textContent = scenario.title;
  window.clearTimeout(saladClearTimer);
  window.clearTimeout(saladWordClearTimer);
  window.clearTimeout(saladHintTimer);
  saladPath = [];
  saladPointerDown = false;
  saladWords.classList.remove('clearing');
  saladFound.clear();
  saladSolvedPaths.clear();
  saladHintCount = 0;
  renderSaladBoard();
  renderSaladWords();
  saladMessage.className = 'message';
  saladMessage.textContent = 'გაასრიალე თითი ან მაუსი ასოებზე.';
}

function renderSaladWords() {
  saladWords.innerHTML = saladAnswers.map((word) => {
    const found = saladFound.has(word);
    const revealed = [...word].map((letter, index) => index < saladHintCount ? letter : '•').join('');
    return `<div class="salad-word ${found ? 'found' : ''}"><span>${found ? word : revealed}</span><small>${[...word].length} ასო</small></div>`;
  }).join('');
}

function renderSaladBoard() {
  saladBoard.innerHTML = saladBoardLetters.map((letter, index) => `<button class="salad-tile" type="button" role="gridcell" data-index="${index}" aria-label="ასო ${letter}">${letter}</button>`).join('');
  saladBoard.querySelectorAll('.salad-tile').forEach((tile) => {
    tile.addEventListener('pointerdown', (event) => startSaladPath(event, tile));
    tile.addEventListener('pointerenter', () => extendSaladPath(tile));
  });
}

function startSaladPath(event, tile) {
  event.preventDefault();
  saladPointerDown = true;
  saladPath = [Number(tile.dataset.index)];
  tile.classList.add('active');
  saladMessage.textContent = tile.textContent;
}

saladBoard.addEventListener('pointermove', (event) => {
  if (!saladPointerDown) return;
  const tile = event.target.closest?.('.salad-tile') || document.elementFromPoint(event.clientX, event.clientY)?.closest('.salad-tile');
  if (tile && saladBoard.contains(tile)) extendSaladPath(tile);
});

function extendSaladPath(tile) {
  if (!saladPointerDown || saladPath.includes(Number(tile.dataset.index))) return;
  const previousIndex = saladPath.at(-1);
  const nextIndex = Number(tile.dataset.index);
  const rowDistance = Math.abs(Math.floor(previousIndex / 4) - Math.floor(nextIndex / 4));
  const columnDistance = Math.abs((previousIndex % 4) - (nextIndex % 4));
  if (rowDistance > 1 || columnDistance > 1) return;
  saladPath.push(Number(tile.dataset.index));
  tile.classList.add('active');
  saladMessage.textContent = saladPath.map((index) => saladBoardLetters[index]).join('');
}

function findSaladMatch(path) {
  for (const word of saladAnswers) {
    if (path.length === [...word].length && path.map((index) => saladBoardLetters[index]).join('') === word) return { word, path: [...path] };
  }
  return null;
}

function finishSaladPath() {
  if (!saladPointerDown) return;
  saladPointerDown = false;
  const answer = saladPath.map((index) => saladBoardLetters[index]).join('');
  const match = findSaladMatch(saladPath);
  if (match) {
    saladFound.add(match.word);
    saladSolvedPaths.set(match.word, [...match.path]);
    match.path.forEach((index) => saladBoard.querySelector(`[data-index="${index}"]`)?.classList.add('solved'));
    saladMessage.className = 'message';
    saladMessage.textContent = saladFound.size === saladAnswers.length ? 'ყველა სიტყვა იპოვე. შესანიშნავია.' : 'იპოვე. კიდევ ერთი სცადე.';
    if (saladFound.size === saladAnswers.length) {
      saladClearTimer = window.setTimeout(() => {
        saladWords.classList.add('clearing');
        saladWordClearTimer = window.setTimeout(() => {
          saladWords.innerHTML = '';
          saladWords.classList.remove('clearing');
        }, 380);
      }, 700);
    }
    window.setTimeout(() => {
      saladSolvedPaths.get(match.word)?.forEach((index) => {
        const tile = saladBoard.querySelector(`[data-index="${index}"]`);
        const stillNeeded = saladAnswers.filter((word) => !saladFound.has(word)).some((word) => word.includes(saladBoardLetters[index]));
        if (!stillNeeded) tile?.classList.add('vanished');
      });
      saladSolvedPaths.delete(match.word);
    }, 460);
  } else if (answer) {
    saladMessage.className = 'message error';
    saladMessage.textContent = 'ეს სიტყვა სიაში არ არის.';
    saladPath.forEach((index) => saladBoard.querySelector(`[data-index="${index}"]`)?.classList.add('invalid'));
  }
  const completedPath = match ? [...match.path] : [...saladPath];
  window.setTimeout(() => {
    completedPath.forEach((index) => saladBoard.querySelector(`[data-index="${index}"]`)?.classList.remove('active', 'invalid', 'solved'));
  }, match ? 460 : 260);
  saladPath = [];
  renderSaladWords();
}

document.addEventListener('pointerup', finishSaladPath);
document.addEventListener('pointercancel', finishSaladPath);
document.querySelector('#salad-reset').addEventListener('click', () => {
  window.clearTimeout(saladClearTimer);
  window.clearTimeout(saladWordClearTimer);
  window.clearTimeout(saladHintTimer);
  saladFound.clear();
  saladSolvedPaths.clear();
  saladBoard.querySelectorAll('.salad-tile').forEach((tile) => tile.classList.remove('vanished'));
  saladHintCount = 0;
  saladPath = [];
  saladPointerDown = false;
  saladWords.classList.remove('clearing');
  saladMessage.className = 'message';
  saladMessage.textContent = 'გაასრიალე თითი ან მაუსი ასოებზე.';
  renderSaladWords();
});
saladHint.addEventListener('pointerdown', () => {
  saladHintTimer = setTimeout(() => {
    const longestAnswer = Math.max(...saladAnswers.map((word) => [...word].length));
    saladHintCount = Math.min(saladHintCount + 1, longestAnswer);
    renderSaladWords();
    saladMessage.className = 'message';
    saladMessage.textContent = `მინიშნება: ${saladHintCount} ასო გამოჩნდა.`;
    saladHint.classList.add('hint-used');
  }, 650);
});
['pointerup', 'pointerleave', 'pointercancel'].forEach((eventName) => saladHint.addEventListener(eventName, () => clearTimeout(saladHintTimer)));
loadSaladScenario(0);

const wordleScenarios = [
  { title: 'თამაში 001', target: 'პრავა' },
  { title: 'თამაში 002', target: 'სახლი' }
];
let wordleScenarioIndex = 0;
let wordleTarget = wordleScenarios[wordleScenarioIndex].target;
const wordleRows = 6;
const wordleColumns = 5;
const wordleGuesses = [];
let wordleCurrent = '';
const wordleLetterStates = {};
const georgianLetters = ['ქწერტყუიოპ', 'ასდფგჰჯკლ', 'ზხცვბნმ'];
const wordleBoard = document.querySelector('#wordle-board');
const wordleMessage = document.querySelector('#wordle-message');
const wordleScenario = document.querySelector('#wordle-scenario');

function getWordleStatuses(guess) {
  const guessLetters = [...guess];
  const targetLetters = [...wordleTarget];
  const statuses = Array(wordleColumns).fill('absent');
  const remaining = [...targetLetters];
  guessLetters.forEach((letter, index) => {
    if (letter === targetLetters[index]) {
      statuses[index] = 'correct';
      remaining[index] = null;
    }
  });
  guessLetters.forEach((letter, index) => {
    if (statuses[index] === 'correct') return;
    const targetIndex = remaining.indexOf(letter);
    if (targetIndex >= 0) {
      statuses[index] = 'present';
      remaining[targetIndex] = null;
    }
  });
  return statuses;
}

function updateWordleLetterStates(guess, statuses) {
  const priority = { absent: 1, present: 2, correct: 3 };
  [...guess].forEach((letter, index) => {
    const status = statuses[index];
    if (!wordleLetterStates[letter] || priority[status] > priority[wordleLetterStates[letter]]) wordleLetterStates[letter] = status;
  });
}

function renderWordle() {
  wordleBoard.innerHTML = '';
  for (let row = 0; row < wordleRows; row += 1) {
    for (let column = 0; column < wordleColumns; column += 1) {
      const tile = document.createElement('div');
      tile.className = 'wordle-tile';
      const guess = wordleGuesses[row] || '';
      tile.textContent = [...guess][column] || '';
      if (wordleGuesses[row]) {
        tile.classList.add(getWordleStatuses(guess)[column]);
      } else if (row === wordleGuesses.length && column < wordleCurrent.length) {
        tile.textContent = [...wordleCurrent][column];
        tile.classList.add('filled');
      }
      wordleBoard.appendChild(tile);
    }
  }
}

function renderKeyboard() {
  const keyboard = document.querySelector('#georgian-keyboard');
  keyboard.innerHTML = georgianLetters.map((line) => `<div class="keyboard-row">${[...line].map((letter) => `<button class="key ${wordleLetterStates[letter] || ''}" type="button" data-letter="${letter}">${letter}</button>`).join('')}</div>`).join('') + '<div class="keyboard-row"><button class="key key-wide" type="button" data-action="backspace">⌫</button><button class="key key-wide" type="button" data-action="enter">შეყვანა</button></div>';
  keyboard.querySelectorAll('.key').forEach((key) => key.addEventListener('click', () => handleWordleKey(key.dataset.letter, key.dataset.action)));
}

function resetWordle() {
  wordleCurrent = '';
  wordleGuesses.length = 0;
  Object.keys(wordleLetterStates).forEach((letter) => delete wordleLetterStates[letter]);
  wordleMessage.className = 'message';
  wordleMessage.textContent = 'შეიყვანე პირველი სიტყვა.';
  renderWordle();
  renderKeyboard();
}

function populateWordleScenarios() {
  wordleScenario.innerHTML = wordleScenarios.map((scenario, index) => (
    `<option value="${index}">${String(index + 1).padStart(2, '0')} · ${scenario.title}</option>`
  )).join('');
  wordleScenario.value = String(wordleScenarioIndex);
}

function handleWordleKey(letter, action) {
  if (wordleGuesses.length >= wordleRows || wordleGuesses.includes(wordleTarget)) return;
  if (action === 'backspace') wordleCurrent = [...wordleCurrent].slice(0, -1).join('');
  else if (action === 'enter') {
    if ([...wordleCurrent].length !== wordleColumns) {
      wordleMessage.textContent = 'სიტყვა ხუთი ასოსგან უნდა შედგებოდეს.';
      return;
    }
    wordleGuesses.push(wordleCurrent);
    updateWordleLetterStates(wordleCurrent, getWordleStatuses(wordleCurrent));
    wordleCurrent = '';
    if (wordleGuesses.at(-1) === wordleTarget) wordleMessage.textContent = 'გამოიცანი. გილოცავ!';
    else if (wordleGuesses.length === wordleRows) wordleMessage.textContent = `სიტყვა იყო: ${wordleTarget}`;
    else wordleMessage.textContent = 'კიდევ ერთი ცდა.';
  } else if ([...wordleCurrent].length < wordleColumns) wordleCurrent += letter;
  renderWordle();
  renderKeyboard();
}

document.querySelector('#georgian-keyboard').addEventListener('click', () => renderWordle());
document.addEventListener('keydown', (event) => {
  if (document.querySelector('#wordle-view').hidden) return;
  if (/^[\u10D0-\u10FF\u1C90-\u1CBF]$/.test(event.key)) {
    event.preventDefault();
    handleWordleKey(event.key, undefined);
  } else if (event.key === 'Backspace' || event.key === 'Enter') {
    event.preventDefault();
    handleWordleKey(undefined, event.key === 'Backspace' ? 'backspace' : 'enter');
  }
});
document.querySelectorAll('.egg-hotspot').forEach((egg) => egg.addEventListener('click', () => collectEgg(egg)));
hintButton.addEventListener('click', () => {
  hintPanel.hidden = !hintPanel.hidden;
  hintButton.setAttribute('aria-expanded', String(!hintPanel.hidden));
});
secondHintButton.addEventListener('click', () => {
  secondHintPanel.hidden = !secondHintPanel.hidden;
  secondHintButton.setAttribute('aria-expanded', String(!secondHintPanel.hidden));
  if (!secondHintPanel.hidden) secondHintKeyword.focus();
});
document.querySelector('#close-second-hint').addEventListener('click', () => {
  secondHintPanel.hidden = true;
  secondHintButton.setAttribute('aria-expanded', 'false');
});
document.querySelector('[data-close-second-hint]').addEventListener('click', () => {
  secondHintPanel.hidden = true;
  secondHintButton.setAttribute('aria-expanded', 'false');
});
secondHintForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (secondHintKeyword.value.trim().toLocaleLowerCase() !== 'namu') {
    secondHintMessage.className = 'message error';
    secondHintMessage.textContent = 'That keyword is not correct.';
    secondHintContent.hidden = true;
    return;
  }
  secondHintMessage.className = 'message';
  secondHintMessage.textContent = 'Keyword accepted.';
  secondHintContent.textContent = secondHintAnswer;
  secondHintContent.hidden = false;
});
function closeDateHint() {
  dateHintPanel.hidden = true;
}

hiddenDateButton.addEventListener('click', () => {
  dateHintPanel.hidden = false;
  dateHintKeyword.focus();
});
document.querySelector('#close-date-hint').addEventListener('click', closeDateHint);
document.querySelector('[data-close-date-hint]').addEventListener('click', closeDateHint);
dateHintForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (dateHintKeyword.value.trim().toLocaleLowerCase() !== 'sakan') {
    dateHintMessage.className = 'message error';
    dateHintMessage.textContent = 'That keyword is not correct.';
    dateHintContent.hidden = true;
    return;
  }
  dateHintMessage.className = 'message';
  dateHintMessage.textContent = 'Keyword accepted.';
  dateHintContent.hidden = false;
});
document.querySelector('#wordle-reset').addEventListener('click', () => {
  resetWordle();
});
wordleScenario.addEventListener('change', () => {
  wordleScenarioIndex = Number(wordleScenario.value);
  wordleTarget = wordleScenarios[wordleScenarioIndex].target;
  resetWordle();
});
document.querySelectorAll('.nav-button').forEach((button) => button.addEventListener('click', () => {
  setView(button.dataset.view);
}));
renderEggProgress();
renderConnectionsDayOptions();
populateWordleScenarios();
setView(localStorage.getItem(viewStorageKey) || 'connections');
if (collectedEggs.size === 7) showEggCompletion();
renderWordle();
renderKeyboard();

const riddles = [
  { text: 'I am the tenth guest at the calendar table. I arrive after September, bring longer shadows, and wear a famous night of costumes. Who am I?', answers: ['october'], image: 'correct.png' },
  { text: 'I return to the same date each year. I can mark a wedding, a birth, or the day a company began. What am I?', answers: ['anniversary'], image: 'elami.png' },
  { text: 'I may be wrapped, hidden, or handed over with a smile. I am not bought for the person who receives me. What am I?', answers: ['gift', 'present'], image: 'one-away.png' }
];
const riddleText = document.querySelector('#riddle-text');
const riddleNumber = document.querySelector('#riddle-number');
const riddleForm = document.querySelector('#riddle-form');
const riddleAnswer = document.querySelector('#riddle-answer');
const riddleMessage = document.querySelector('#riddle-message');
let riddleIndex = 0;

function renderRiddle() {
  if (riddleIndex >= riddles.length) {
    riddleNumber.textContent = '✓';
    riddleText.textContent = 'ყველა გამოცანა გამოიცანი.';
    riddleForm.hidden = true;
    riddleMessage.className = 'message';
    riddleMessage.textContent = 'შესანიშნავია. სამივე პასუხი სწორია.';
    return;
  }
  riddleNumber.textContent = String(riddleIndex + 1).padStart(2, '0');
  riddleText.textContent = riddles[riddleIndex].text;
  riddleForm.hidden = false;
  riddleAnswer.value = '';
  riddleAnswer.focus();
}

riddleForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const guess = riddleAnswer.value.trim().toLocaleLowerCase();
  if (!riddles[riddleIndex].answers.includes(guess)) {
    riddleMessage.className = 'message error';
    riddleMessage.textContent = 'ჯერ არა. კიდევ სცადე.';
    riddleAnswer.select();
    return;
  }
  const solvedRiddle = riddles[riddleIndex];
  riddleMessage.className = 'message';
  riddleMessage.textContent = 'სწორია. სურათი გაიხსნა.';
  riddleIndex += 1;
  showReaction(solvedRiddle.image);
  renderRiddle();
});

document.querySelector('#riddle-reset').addEventListener('click', () => {
  riddleIndex = 0;
  renderRiddle();
  riddleMessage.className = 'message';
  riddleMessage.textContent = 'ჩაწერე შენი პასუხი.';
});
renderRiddle();
