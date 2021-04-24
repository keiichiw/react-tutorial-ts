import React from "react";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";

import Board from "./board";
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
        <ListItem key={move} button>
          <ListItemText
            onClick={() => this.jumpTo(move)}
            onMouseOver={() => this.selectMove(step.pos)}
            onMouseOut={() => this.deselectMove()}
            primary={desc}
          />
        </ListItem>
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
        <Typography variant="h6">{status}</Typography>
        <div className="game-board">
          <Board
            squares={current.squares}
            selectedMove={this.state.selectedMove}
            winningLine={result.winningLine}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="history">
          <List>{moves}</List>
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

export default Game;
