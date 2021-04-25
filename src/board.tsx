import React from "react";
import CSS from "csstype";
import { Typography, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  square: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
    "&:hover": {
      borderColor: "red",
    },
  },
  mark: {
    textAlign: "center",
    height: theme.spacing(12),
    width: theme.spacing(12),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));

type SquareProps = {
  onClick: () => void;
  style: React.CSSProperties;
  value: string;
};

function Square(props: SquareProps) {
  const classes = useStyles();

  return (
    <div>
      <Paper
        elevation={15}
        variant="outlined"
        className={classes.square}
        onClick={props.onClick}
        style={props.style}
      >
        <Typography variant="h4" className={classes.mark}>
          {props.value}
        </Typography>
      </Paper>
    </div>
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
      <Grid item spacing={1}>
        <Square
          key={i}
          style={style}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      </Grid>
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
        <Grid container item xs={12} spacing={1} key={key}>
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
