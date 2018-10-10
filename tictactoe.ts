import _ = require('underscore');

const POSITION = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]];


export enum StatusGame {
    win = 'win',
    draw = 'draw',
    loss = 'loss'
}

export enum Player {
    X = 1,
    O = 0
}

const EMPTY = 0.5;
export class TicTacToe {
    public board =
        [[EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]]



    public play(positions, player: Player): any {

        for (let i = 8; i >= 0; i--) {
            var line = POSITION[positions[i].index][0];
            var column = POSITION[positions[i].index][1];

            if (this.board[line][column] != EMPTY) 
                continue;
               // return { move: positions[i].index, status: StatusGame.loss};

            this.board[line][column] = player;

            return { move: positions[i].index, status: this.getStatus() };
        }

    }

    public getStatus() {

        if (this.board[0][0] != EMPTY && this.board[0][0] == this.board[0][1] && this.board[0][0] == this.board[0][2]) return StatusGame.win;
        if (this.board[0][0] != EMPTY && this.board[0][0] == this.board[1][0] && this.board[0][0] == this.board[2][0]) return StatusGame.win;
        if (this.board[0][0] != EMPTY && this.board[0][0] == this.board[1][1] && this.board[0][0] == this.board[2][2]) return StatusGame.win;

        if (this.board[1][0] != EMPTY && this.board[1][0] == this.board[1][1] && this.board[1][0] == this.board[1][2]) return StatusGame.win;
        if (this.board[2][0] != EMPTY && this.board[2][0] == this.board[2][1] && this.board[2][0] == this.board[2][2]) return StatusGame.win;

        if (this.board[0][1] != EMPTY && this.board[0][1] == this.board[1][1] && this.board[0][1] == this.board[2][1]) return StatusGame.win;

        if (this.board[0][2] != EMPTY && this.board[0][2] == this.board[1][2] && this.board[0][2] == this.board[2][2]) return StatusGame.win;
        if (this.board[0][2] != EMPTY && this.board[0][2] == this.board[1][1] && this.board[0][2] == this.board[2][0]) return StatusGame.win;


        return StatusGame.draw;
    }

    public getBoard(player: Player) {
        let board = _.flatten(this.board);
        if (player == Player.X) return board;

        board = board.map( position => {
            if (position == Player.X ) return Player.O;
            if (position == Player.O) return Player.X;
            
            return position
        })

        return board;
    }



    public printBoard() {
        let prettyBoard = this.board.map(row => {
            let prettyRow = [];
            row.forEach(elem => {
                if (elem == EMPTY) prettyRow.push('_');
                if (elem == 1) prettyRow.push('x');
                if (elem == 0) prettyRow.push('o');

            })
            
            return prettyRow;
        })
        console.log(`${prettyBoard[0]}\n${prettyBoard[1]}\n${prettyBoard[2]}`)
    }



}

// function main() {

//     var ticTacToe = new TicTacToe;
//     console.log(ticTacToe.play(0, 0, Player.O))
//     console.log(ticTacToe.play(1, 0, Player.O))
//     console.log(ticTacToe.play(2, 2, Player.X))
//     console.log(ticTacToe.play(2, 0, Player.O))

// }

//main();