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
    static PLAYERS = ['O', 'X'];

    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            nextPlayer: 0,
        };
    }

    handleSquareClick(i) {
        if (this.state.squares[i] != null) {
            return
        }
        /*
         immutableにするために、直接this.state.squaresを書き換えるのではなくコピーを作成し、
         コピーに対して状態の変更を行い、それを使ってsetStateする

         immutableにする利点は

         - 複雑な機能を実装するのを容易にする。たとえばある状態を保存しておき、後で必要になったら差し戻すなど。
         - 状態の変更している箇所をトラッキングしやすくなる。
         - どこで再レンダリングされるのか容易に判定できる。
         */
        const ss = this.state.squares.slice();
        const np = this.state.nextPlayer;
        ss[i] = Board.PLAYERS[np];
        /*
         this.setStateが呼び出されると、コンポーネントの更新がスケジュールされ、子孫とともにコンポーネントレンダリングされる
         再レンダリングされるときは、this.state.squares[i]は 'X'になるので、グリッドにXが表示される。
         */
        this.setState({
            squares: ss,
            nextPlayer: (np + 1) % Board.PLAYERS.length,
        });
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleSquareClick(i)}
            />
        );
    }

    render() {
        const status = `Next player: ${Board.PLAYERS[this.state.nextPlayer]}`;

        return (
            <div>
                <div className="status">{status}</div>
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
                { className: "status" },
                status
            ),
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
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
