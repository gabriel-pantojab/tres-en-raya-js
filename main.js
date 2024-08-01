function showPopup(message) {
  const $popupBackground = document.createElement("div");
  const $popupContainer = document.createElement("section");
  const $popupHeader = document.createElement("header");
  const $popupMessage = document.createElement("p");
  const $resetButton = document.createElement("button");

  $popupBackground.classList.add("popup-bg");
  $popupContainer.classList.add("popup");
  $popupHeader.classList.add("popup__header");
  $popupMessage.classList.add("popup__message");
  $resetButton.classList.add("btn-reset");

  $resetButton.textContent = "Reiniciar";
  $popupMessage.textContent = message;
  $popupHeader.textContent = "Popup";

  $resetButton.addEventListener(
    "click",
    () => {
      resetGame();
      $popupBackground.remove();
    },
    {
      once: true,
    }
  );

  $popupContainer.appendChild($popupHeader);
  $popupContainer.appendChild($popupMessage);
  $popupContainer.appendChild($resetButton);
  $popupBackground.appendChild($popupContainer);

  document.body.appendChild($popupBackground);
}

function Header() {
  const $header = document.createElement("header");
  const $h1 = document.createElement("h1");

  $header.classList.add("header");
  $h1.textContent = "Tres en raya";

  const $p = document.createElement("p");
  const $nextPlayer = document.createElement("span");

  $p.classList.add("player-label");
  $p.textContent = "Siguiente jugador: ";

  $nextPlayer.classList.add("span");
  $nextPlayer.textContent = "X";

  $p.appendChild($nextPlayer);

  $header.appendChild($h1);
  $header.appendChild($p);

  return $header;
}

function Square({ i, j }) {
  const $square = document.createElement("button");
  $square.classList.add("square");

  const handleClick = () => {
    if (grid[i][j] || winner) return;
    const player = turn ? "X" : "O";
    $square.textContent = player;
    $square.classList.add(player);

    mark(i, j, player);
    checkGame(player);
  };

  $square.addEventListener("click", handleClick);

  return $square;
}

function Board() {
  const $board = document.createElement("section");
  $board.classList.add("board");

  for (let i = 0; i < N; i++) {
    const $row = document.createElement("div");
    $row.classList.add("row");

    for (let j = 0; j < N; j++) {
      const $square = Square({ i, j });
      $row.appendChild($square);
    }

    $board.appendChild($row);
  }

  return $board;
}

function checkWinner(symbol) {
  let row = 0;
  let column = 0;
  let mainDig = 0;
  let secondDig = 0;

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (grid[i][j] === symbol) column.count++;
      if (grid[j][i] === symbol) row++;
      if (grid[j][j] === symbol) mainDig++;
      if (grid[j][N - j - 1] === symbol) secondDig++;
    }

    if (row === N || column === N || mainDig === N || secondDig === N) {
      return true;
    }

    (row = 0), (column = 0), (mainDig = 0), (secondDig = 0);
  }

  return false;
}

function checkDraw() {
  const allMarked = (row) => row.every((value) => value !== "");
  return grid.every(allMarked);
}

function mark(x, y, symbol) {
  grid[x][y] = symbol;
  turn = !turn;
  const $nextPlayer = document.querySelector(".player-label span");
  $nextPlayer.textContent = `${turn ? "X" : "O"}`;
}

function checkGame(symbol) {
  winner = checkWinner(symbol);
  if (winner) {
    showPopup(`Ganador: ${symbol}`);
  } else {
    isDraw = checkDraw(grid);
    if (isDraw) {
      showPopup("Empate!");
    }
  }
}

function resetGame() {
  turn = true;
  winner = false;
  isDraw = false;
  const $nextPlayer = document.querySelector(".player-label span");
  const $board = document.querySelector(".board");
  $nextPlayer.textContent = "X";
  Array.from($board.children).forEach(($row, indexRow) => {
    Array.from($row.children).forEach(($col, indexCol) => {
      $col.textContent = "";
      $col.classList.remove("win", "X", "O");
      grid[indexRow][indexCol] = "";
    });
  });
}

const N = 3;
let turn = true;
let winner = false;
const grid = Array.from({ length: N }, () => new Array(N).fill(""));

const $main = document.createElement("main");
$main.classList.add("main");

$main.appendChild(Board());

const $app = document.getElementById("app");

$app.appendChild(Header());
$app.appendChild($main);
