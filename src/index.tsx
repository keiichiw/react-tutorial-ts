import CSS from "csstype";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

type SquareProps = {
  onClick: () => void;
  style: React.CSSProperties;
  value: string;
};

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

type BoardProps = {
  selectedMove: number | null;
  winningLine: Array<number>;
  squares: Array<string>;
  onClick: (args0: number) => void;
};

class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    let style: CSS.Properties = {};
    if (this.props.selectedMove === i) {
      style["color"] = "red";
    }

    if (this.props.winningLine && this.props.winningLine.includes(i)) {
      style["background"] = "yellow";
    }

    return (
      <Square
        key={i}
        style={style}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(i * 3 + j));
      }
      const key = `row-${i}`;
      board.push(
        <div key={key} className="board-row">
          {row}
        </div>
      );
    }
    return board;
  }
}

type GameProps = {};

type HistoryElem = {
  pos?: number;
  squares: Array<string>;
};

type GameState = {
  history: Array<HistoryElem>;
  stepNumber: number;
  xIsNext: boolean;
  selectedMove: number | null;
};

class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      selectedMove: null,
    };
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const result = calculateWinner(squares);
    if (result.gameEnd || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          pos: i,
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  selectMove(pos: number | undefined) {
    if (pos) {
      this.setState({
        selectedMove: pos,
      });
    }
  }

  deselectMove() {
    this.setState({
      selectedMove: null,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc;
      if (step.pos) {
        const row = Math.floor(step.pos / 3) + 1;
        const col = (step.pos % 3) + 1;
        desc = `Go to move #${move}: (row=${row}, col=${col})`;
      } else {
        desc = "Go to game start";
      }
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            onMouseOver={() => this.selectMove(step.pos)}
            onMouseOut={() => this.deselectMove()}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (result.winner) {
      status = "Winner: " + result.winner;
    } else if (result.gameEnd) {
      status = "Draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            selectedMove={this.state.selectedMove}
            winningLine={result.winningLine}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: Array<string>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        gameEnd: true,
        winner: squares[a],
        winningLine: lines[i],
      };
    }
  }

  const gameEnd = squares.every((x) => x);
  return {
    gameEnd,
    winner: null,
    winningLine: [],
  };
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
