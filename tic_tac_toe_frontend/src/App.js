import React, { useMemo, useState } from "react";
import "./App.css";

const BOARD_SIZE = 9;
const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Compute winner and the winning line (if any).
 * @param {Array<"X"|"O"|null>} squares
 * @returns {{winner: "X"|"O"|null, line: number[]|null}}
 */
function calculateWinner(squares) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

/**
 * @param {Array<"X"|"O"|null>} squares
 * @returns {boolean}
 */
function isDraw(squares) {
  return squares.every((s) => s !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** @type {[Array<"X"|"O"|null>, Function]} */
  const [squares, setSquares] = useState(() => Array(BOARD_SIZE).fill(null));
  /** @type {[boolean, Function]} */
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const draw = useMemo(() => !winner && isDraw(squares), [winner, squares]);
  const currentPlayer = xIsNext ? "X" : "O";

  const status = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (draw) return "It's a draw";
    return `Turn: ${currentPlayer}`;
  }, [winner, draw, currentPlayer]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    setSquares((prev) => {
      // Ignore clicks when game is over or square already filled.
      if (winner || draw || prev[index] !== null) return prev;

      const next = prev.slice();
      next[index] = xIsNext ? "X" : "O";
      return next;
    });

    // Only toggle turn if move is valid (square empty, game not ended).
    if (!winner && !draw && squares[index] === null) {
      setXIsNext((v) => !v);
    }
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setSquares(Array(BOARD_SIZE).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="App">
      <main className="ttt-page">
        <section className="ttt-card" aria-label="Tic Tac Toe">
          <header className="ttt-header">
            <div>
              <h1 className="ttt-title">Tic Tac Toe</h1>
              <p className="ttt-subtitle">Local two‑player (X/O)</p>
            </div>

            <button
              type="button"
              className="ttt-button ttt-button--secondary"
              onClick={resetGame}
            >
              New Game
            </button>
          </header>

          <div
            className={`ttt-status ${
              winner ? "ttt-status--win" : draw ? "ttt-status--draw" : ""
            }`}
            role="status"
            aria-live="polite"
          >
            <span className="ttt-statusLabel">{status}</span>
            {!winner && !draw ? (
              <span className="ttt-statusHint">
                Tap a square to place <strong>{currentPlayer}</strong>
              </span>
            ) : (
              <span className="ttt-statusHint">Press “New Game” to play again</span>
            )}
          </div>

          <div className="ttt-boardWrap">
            <div className="ttt-board" role="grid" aria-label="3 by 3 board">
              {squares.map((value, idx) => {
                const isWinningSquare = line ? line.includes(idx) : false;
                const isDisabled = Boolean(winner || draw || value !== null);
                const ariaLabel = value
                  ? `Square ${idx + 1}, ${value}`
                  : `Square ${idx + 1}, empty`;

                return (
                  <button
                    key={idx}
                    type="button"
                    role="gridcell"
                    className={`ttt-square ${
                      isWinningSquare ? "ttt-square--winning" : ""
                    } ${value ? "ttt-square--filled" : ""}`}
                    onClick={() => handleSquareClick(idx)}
                    disabled={isDisabled}
                    aria-label={ariaLabel}
                  >
                    <span className="ttt-mark" aria-hidden="true">
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="ttt-footer">
            <button
              type="button"
              className="ttt-button"
              onClick={resetGame}
              aria-label="Reset the board and start a new game"
            >
              Reset
            </button>

            <div className="ttt-legend" aria-label="Legend">
              <span className="ttt-pill ttt-pill--x">X</span>
              <span className="ttt-pill ttt-pill--o">O</span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
