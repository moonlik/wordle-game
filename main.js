import './style.css';
import { fetchWord, checkWord } from './index.js';

const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');

let wordle;

fetchWord()
  .then((res) => {
    console.log('Wordle word is -', res);
    wordle = res.toUpperCase();
  })
  .catch((error) => console.log(error));

const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'ENTER',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  '≪',
];

const guessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement('div');
  rowElement.setAttribute('id', `guessRow-${guessRowIndex}`);

  guessRow.forEach((_, guessIndex) => {
    const tileElement = document.createElement('div');
    tileElement.setAttribute(
      'id',
      `guessRow-${guessRowIndex}-tile-${guessIndex}`
    );
    tileElement.classList.add('tile');
    rowElement.append(tileElement);
  });

  tileDisplay.append(rowElement);
});

keys.forEach((key) => {
  const buttonElement = document.createElement('button');
  buttonElement.textContent = key;
  buttonElement.setAttribute('id', key);
  buttonElement.addEventListener('click', () => handleClick(key));
  keyboard.append(buttonElement);
});

const handleClick = (key) => {
  if (key === '≪') {
    deleteLetter();
    return;
  }
  if (key === 'ENTER') {
    checkRow();
    return;
  }
  addLetter(key);
};

const addLetter = (letter) => {
  if (currentRow < 6 && currentTile < 5) {
    const tile = document.getElementById(
      `guessRow-${currentRow}-tile-${currentTile}`
    );
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute('data', letter);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      `guessRow-${currentRow}-tile-${currentTile}`
    );
    tile.textContent = '';
    guessRows[currentRow][currentTile] = '';
    tile.setAttribute('data', '');
  }
};

const checkRow = () => {
  const guess = guessRows[currentRow].join('');

  if (currentTile > 4) {
    checkWord(guess.toLowerCase()).then((res) => {
      if (res.list.length === 0) {
        showMessage('Word is not in the list');
        return;
      }

      flipTile();

      if (wordle == guess) {
        showMessage('Magnificent!');
        isGameOver = true;
        return;
      }

      if (currentRow >= 5) {
        isGameOver = true;
        showMessage('Game Over');
        return;
      }

      if (currentRow < 5) {
        currentRow++;
        currentTile = 0;
      }
    });
  }
};

const showMessage = (message) => {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageDisplay.append(messageElement);
  setTimeout(() => messageDisplay.removeChild(messageElement), 2000);
};

const addColorToKey = (letter, color) => {
  const key = document.getElementById(letter);
  key.classList.add(color);
};

const flipTile = () => {
  const rowTiles = document.querySelector(`#guessRow-${currentRow}`).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' });
  });

  guess.forEach((guessItem, index) => {
    if (guessItem.letter == wordle[index]) {
      guessItem.color = 'green-overlay';
      checkWordle = checkWordle.replace(guessItem.letter, '');
    }
  });

  guess.forEach((guessItem) => {
    if (checkWordle.includes(guessItem.letter)) {
      guessItem.color = 'yellow-overlay';
      checkWordle = checkWordle.replace(guessItem.letter, '');
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add('flip');
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};
