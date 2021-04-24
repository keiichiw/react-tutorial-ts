import React from "react";
import CSS from "csstype";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

type SquareProps = {
  onClick: () => void;
  style: React.CSSProperties;
  value: string;
};

function Square(props: SquareProps) {
  return (
    <Button
      variant="outlined"
      className="square"
      onClick={props.onClick}
      style={props.style}
    >
      {props.value}
    </Button>
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
        <Grid container item xs={12} spacing={3} key={key}>
          {row}
        </Grid>
      );
    }
    return (
      <Grid container spacing={3}>
        {board}
      </Grid>
    );
  }
}

export default Board;
