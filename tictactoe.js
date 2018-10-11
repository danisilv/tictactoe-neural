"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
const POSITION = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
var StatusGame;
(function (StatusGame) {
    StatusGame["win"] = "win";
    StatusGame["draw"] = "draw";
    StatusGame["loss"] = "loss";
})(StatusGame = exports.StatusGame || (exports.StatusGame = {}));
var Player;
(function (Player) {
    Player[Player["X"] = 1] = "X";
    Player[Player["O"] = 0] = "O";
})(Player = exports.Player || (exports.Player = {}));
const EMPTY = -1;
class TicTacToe {
    constructor() {
        this.board = [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]];
    }
    play(positions, player) {
        for (let i = 8; i >= 0; i--) {
            var line = POSITION[positions[i].index][0];
            var column = POSITION[positions[i].index][1];
            if (this.board[line][column] != EMPTY)
                continue;
            //  return { move: positions[i].index, status: StatusGame.loss};
            this.board[line][column] = player;
            return { move: positions[i].index, status: this.getStatus() };
        }
    }
    getStatus() {
        if (this.board[0][0] != EMPTY && this.board[0][0] == this.board[0][1] && this.board[0][0] == this.board[0][2])
            return StatusGame.win;
        if (this.board[0][0] != EMPTY && this.board[0][0] == this.board[1][0] && this.board[0][0] == this.board[2][0])
            return StatusGame.win;
        if (this.board[0][0] != EMPTY && this.board[0][0] == this.board[1][1] && this.board[0][0] == this.board[2][2])
            return StatusGame.win;
        if (this.board[1][0] != EMPTY && this.board[1][0] == this.board[1][1] && this.board[1][0] == this.board[1][2])
            return StatusGame.win;
        if (this.board[2][0] != EMPTY && this.board[2][0] == this.board[2][1] && this.board[2][0] == this.board[2][2])
            return StatusGame.win;
        if (this.board[0][1] != EMPTY && this.board[0][1] == this.board[1][1] && this.board[0][1] == this.board[2][1])
            return StatusGame.win;
        if (this.board[0][2] != EMPTY && this.board[0][2] == this.board[1][2] && this.board[0][2] == this.board[2][2])
            return StatusGame.win;
        if (this.board[0][2] != EMPTY && this.board[0][2] == this.board[1][1] && this.board[0][2] == this.board[2][0])
            return StatusGame.win;
        return StatusGame.draw;
    }
    getBoard2(player) {
        let board = _.flatten(this.board);
        if (player == Player.X)
            return board;
        board = board.map(position => {
            if (position == Player.X)
                return Player.O;
            if (position == Player.O)
                return Player.X;
            return position;
        });
        return board;
    }
    getBoard(player) {
        let board = _.flatten(this.board);
        //if (player == Player.X) return board;
        if (player == Player.O)
            board = board.map(position => {
                if (position == Player.X)
                    return [0, 1];
                if (position == Player.O)
                    return [1, 0];
                return [0, 0];
            });
        if (player == Player.X)
            board = board.map(position => {
                if (position == Player.X)
                    return [1, 0];
                if (position == Player.O)
                    return [0, 1];
                return [0, 0];
            });
        return _.flatten(this.board);
    }
    printBoard() {
        let prettyBoard = this.board.map(row => {
            let prettyRow = [];
            row.forEach(elem => {
                if (elem == EMPTY)
                    prettyRow.push('_');
                if (elem == 1)
                    prettyRow.push('x');
                if (elem == 0)
                    prettyRow.push('o');
            });
            return prettyRow;
        });
        console.log(`${prettyBoard[0]}\n${prettyBoard[1]}\n${prettyBoard[2]}`);
    }
}
exports.TicTacToe = TicTacToe;
// function main() {
//     var ticTacToe = new TicTacToe;
//     console.log(ticTacToe.play(0, 0, Player.O))
//     console.log(ticTacToe.play(1, 0, Player.O))
//     console.log(ticTacToe.play(2, 2, Player.X))
//     console.log(ticTacToe.play(2, 0, Player.O))
// }
//main(); 
//# sourceMappingURL=tictactoe.js.map