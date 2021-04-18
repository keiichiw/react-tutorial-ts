import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let style = {};
    if (props.highlight) {
        style = {
            color: "red",
        };
    }
    return (
        <button
          className="square"
          onClick={props.onClick}
          style={style}
        >
          {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let highlight = false;
        if (this.props.highlightPositions.has(i)) {
            highlight = true;
        }
        return <Square
                 key={i}
                 highlight={highlight}
                 value={this.props.squares[i]}
                 onClick={ () => this.props.onClick(i) }
               />;
    }

    render() {
        let board = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                row.push(this.renderSquare(i * 3 + j));
            }
            const key = `row-${i}`;
            board.push(<div key={key} className="board-row">{row}</div>);
        }
        return board;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                pos: null,
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            highlightPositions: new Set(),
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                pos: i,
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            highlightPositions: new Set(),
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    addHighlight(pos) {
        const highlightPositions = new Set(this.state.highlightPositions);
        this.setState({
            highlightPositions: highlightPositions.add(pos)
        });
    }

    removeHighlight(pos) {
        const highlightPositions = new Set(this.state.highlightPositions);
        highlightPositions.delete(pos);
        this.setState({
            highlightPositions: highlightPositions
        });
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let desc;
            if (move) {
                const row = Math.floor(step.pos / 3) + 1;
                const col = (step.pos % 3) + 1;
                desc = `Go to move #${move}: (row=${row}, col=${col})`;
            } else {
                desc = 'Go to game start';
            }
            return (
                <li key={move}>
                  <button
                    onClick={() => this.jumpTo(move)}
                    onMouseOver={() => this.addHighlight(step.pos)}
                    onMouseOut={() => this.removeHighlight(step.pos)}
                  >
                    {desc}
                  </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
              <div className="game-board">
                <Board
                  squares={current.squares}
                  highlightPositions={this.state.highlightPositions}
                  onClick={ (i) => this.handleClick(i) }
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

function calculateWinner(squares) {
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
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
