import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
 functional Component
 通常のReact Componentではなく、関数となり状態を持たなくなるのでよりシンプルに
 */
function Square(props) {
    return (
        <button className="square" onClick={() => props.onClick()}>
            {props.value}
        </button>
    );
}


class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
        // ↑ =
        /*
        return (React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "board-row" },
                this.renderSquare(0),
                this.renderSquare(1),
                this.renderSquare(2)
            ),
            React.createElement(
                "div",
                { className: "board-row" },
                this.renderSquare(3),
                this.renderSquare(4),
                this.renderSquare(5)
            ),
            React.createElement(
                "div",
                { className: "board-row" },
                this.renderSquare(6),
                this.renderSquare(7),
                this.renderSquare(8)
            )
        ));
        */
    }
}

class Game extends React.Component {
    static PLAYERS = ['O', 'X'];

    constructor(props) {
        super(props);
        this.state = {
            history: [
                {squares: Array(9).fill(null)}
            ],
            stepNumber: 0,
        };
    }

    jumpTo(stepNumber) {
        this.setState({
            history: this.state.history.slice(0, stepNumber + 1),
            stepNumber: stepNumber,
        });
    }

    currentSquares() {
        const h = this.state.history;
        const sn = this.state.stepNumber;
        return h[sn].squares.slice();
    }

    nextPlayer() {
        return Game.PLAYERS[this.state.stepNumber % Game.PLAYERS.length];
    }

    handleClick(i) {
        const squares = this.currentSquares();
        if (squares[i] != null) {
            return;
        }
        /*
         immutableにするために、直接this.stateを書き換えるのではなくコピーを作成し、
         コピーに対して状態の変更を行い、それを使ってsetStateする

         immutableにする利点は

         - 複雑な機能を実装するのを容易にする。たとえばある状態を保存しておき、後で必要になったら差し戻すなど。
         - 状態の変更している箇所をトラッキングしやすくなる。
         - どこで再レンダリングされるのか容易に判定できる。

         this.setStateが呼び出されると、コンポーネントの更新がスケジュールされ、子孫とともにコンポーネントレンダリングされる
         再レンダリングされるときは、this.state.squares[i]は 'X'になるので、グリッドにXが表示される。
         */
        squares[i] = this.nextPlayer();
        this.setState({
            history: this.state.history.concat({squares: squares}),
            stepNumber: this.state.stepNumber + 1,
        });
    }

    render() {
        const squares = this.currentSquares();
        const winner = calculateWinner(squares);
        const statusLabel = winner ?
            `Winner: ${winner}` : `Next player: ${this.nextPlayer()}`;

        const h = this.state.history;
        const sn = this.state.stepNumber;
        const moves = h.slice(0, sn).map((step, stepNumber) => {
            const desc = stepNumber > 0 ? `Go to move # ${stepNumber}` : 'Go to game start';
            return (
                /*
                 key: 状態を持つリストを作成する場合、Reactが要素を判定できるようにするためにkeyをつけてあげることが強く推奨される。
                 keyは兄弟間で区別できればよく、グローバルで一意である必要はない。
                 */
                <li key={stepNumber}>
                    <button onClick={() => this.jumpTo(stepNumber)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={squares}
                        clickable={!winner}
                        onClick={i => {
                            if (!winner) {
                                this.handleClick(i);
                            }
                        }}
                    />
                </div>
                <div className="game-info">
                    <div>{statusLabel}</div>
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
    <Game/>,
    document.getElementById('root')
);
