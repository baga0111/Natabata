const puzzleWords = [
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
const eggProgress = document.querySelector('#egg-progress');
let currentWords;
let mistakesLeft = 4;
let gameOver = false;

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
  document.querySelector('#wordle-view').hidden = view !== 'wordle';
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
  solvedGroups.insertAdjacentHTML('beforeend', `<div class="solved-group" data-color="${guessedWords[0].color}"><strong>${group}</strong><span>${guessedWords.map((item) => item.fullName || item.word).join(' · ')}</span></div>`);
  showReaction('correct.png');
  selected.clear();
  message.className = 'message';
  message.textContent = solved.size === 4 ? 'თამაში დასრულდა. შესანიშნავია.' : 'ეს კავშირია. გააგრძელე.';
  renderGrid();
}

function shuffleWords() {
  currentWords = createScatteredWords(puzzleWords);
  renderGrid();
}

document.querySelector('#shuffle-button').addEventListener('click', shuffleWords);
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
currentWords = createScatteredWords(puzzleWords);
renderGrid();

const wordleTarget = 'პრავა';
const wordleRows = 6;
const wordleColumns = 5;
const wordleGuesses = [];
let wordleCurrent = '';
const georgianLetters = ['ქწერტყუიოპ', 'ასდფგჰჯკლ', 'ზხცვბნმ'];
const wordleBoard = document.querySelector('#wordle-board');
const wordleMessage = document.querySelector('#wordle-message');

function renderWordle() {
  wordleBoard.innerHTML = '';
  for (let row = 0; row < wordleRows; row += 1) {
    for (let column = 0; column < wordleColumns; column += 1) {
      const tile = document.createElement('div');
      tile.className = 'wordle-tile';
      const guess = wordleGuesses[row] || '';
      tile.textContent = [...guess][column] || '';
      if (wordleGuesses[row]) {
        const letter = [...guess][column];
        tile.classList.add(letter === [...wordleTarget][column] ? 'correct' : [...wordleTarget].includes(letter) ? 'present' : 'absent');
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
  keyboard.innerHTML = georgianLetters.map((line) => `<div class="keyboard-row">${[...line].map((letter) => `<button class="key" type="button" data-letter="${letter}">${letter}</button>`).join('')}</div>`).join('') + '<div class="keyboard-row"><button class="key key-wide" type="button" data-action="backspace">⌫</button><button class="key key-wide" type="button" data-action="enter">შეყვანა</button></div>';
  keyboard.querySelectorAll('.key').forEach((key) => key.addEventListener('click', () => handleWordleKey(key.dataset.letter, key.dataset.action)));
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
    wordleCurrent = '';
    if (wordleGuesses.at(-1) === wordleTarget) wordleMessage.textContent = 'გამოიცანი. გილოცავ!';
    else if (wordleGuesses.length === wordleRows) wordleMessage.textContent = `სიტყვა იყო: ${wordleTarget}`;
    else wordleMessage.textContent = 'კიდევ ერთი ცდა.';
  } else if ([...wordleCurrent].length < wordleColumns) wordleCurrent += letter;
  renderWordle();
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
document.querySelector('#wordle-reset').addEventListener('click', () => {
  wordleCurrent = '';
  wordleGuesses.length = 0;
  wordleMessage.textContent = 'შეიყვანე პირველი სიტყვა.';
  renderWordle();
});
document.querySelectorAll('.nav-button').forEach((button) => button.addEventListener('click', () => {
  setView(button.dataset.view);
}));
renderEggProgress();
setView(localStorage.getItem(viewStorageKey) || 'connections');
if (collectedEggs.size === 7) showEggCompletion();
renderWordle();
renderKeyboard();
