const conwayArea = <HTMLCanvasElement>document.getElementById("conwayCanvas");
const clearButton = <HTMLButtonElement>document.getElementById("clearButton");
const startStopGame = <HTMLButtonElement>(
  document.getElementById("startStopGame")
);

const refreshGame = <HTMLButtonElement>document.getElementById("refreshButton");

conwayArea.width = window.innerWidth;
conwayArea.height = window.innerHeight;

let running = false;

const ctx = conwayArea?.getContext("2d");

conwayArea.style.backgroundColor = "#2e3440";
const cellSize = 15;
const rows = conwayArea.height / cellSize;
const cols = conwayArea.width / cellSize;
const cellAlive = 1;
const cellDead = 0;
const gosperGliderGun = [
  [5, 1],
  [5, 2],
  [6, 1],
  [6, 2], // Left square
  [3, 13],
  [3, 14],
  [4, 12],
  [4, 16],
  [5, 11],
  [5, 17],
  [6, 11],
  [6, 15],
  [6, 17],
  [6, 18],
  [7, 11],
  [7, 17],
  [8, 12],
  [8, 16],
  [9, 13],
  [9, 14], // Left part
  [1, 25],
  [2, 23],
  [2, 25],
  [3, 21],
  [3, 22],
  [4, 21],
  [4, 22],
  [5, 21],
  [5, 22],
  [6, 23],
  [6, 25],
  [7, 25],
  [3, 35],
  [3, 36],
  [4, 35],
  [4, 36], // Right part
];

let grid = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => 0)
);

const drawGrid = () => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      ctx?.beginPath();
      ctx?.rect(j * cellSize, i * cellSize, cellSize, cellSize);
      ctx?.stroke();
      ctx?.fillStyle = grid[i][j] ? "#5e81ac" : "#2e3440";
      ctx?.fill();
    }
  }
};
const getNeighborCount = (grid: number[][], x: number, y: number): number => {
  const neighbors = [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
  ];

  return neighbors.reduce((count, [nx, ny]) => {
    if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
      count += grid[nx][ny];
    }
    return count;
  }, 0);
};

const updateGrid = () => {
  const nextGrid = grid.map((arr) => [...arr]);
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      const cell = grid[x][y];
      const neighborsCount = getNeighborCount(grid, x, y);
      if (cell === cellAlive) {
        if (neighborsCount < 2 || neighborsCount > 3) {
          nextGrid[x][y] = cellDead;
        }
      } else {
        if (neighborsCount === 3) {
          nextGrid[x][y] = cellAlive;
        }
      }
    }
  }
  grid = nextGrid;
};

conwayArea.addEventListener("click", (e) => {
  const x = Math.floor(e.offsetX / cellSize);
  const y = Math.floor(e.offsetY / cellSize);
  grid[y][x] = grid[y][x] ? cellDead : cellAlive;
  drawGrid();
});

const gameLoop = () => {
  if (running) {
    updateGrid();
    drawGrid();
    requestAnimationFrame(gameLoop);
  }
};

startStopGame?.addEventListener("click", () => {
  if (!running) {
    running = true;
    requestAnimationFrame(gameLoop);
  } else {
    running = false;
  }
  startStopGame.innerHTML = running ? "Stop" : "Start";
});

clearButton.addEventListener("click", () => {
  grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );

  drawGrid();
});

const initGame = () => {
  gosperGliderGun.forEach(([row, col]) => {
    grid[row + 20][col + 20] = cellAlive;
  });

  drawGrid();
};

refreshGame.addEventListener("click", () => {
  running = false;

  grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );
  initGame();
});

initGame();
