"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const genetic_1 = require("./genetic");
const tictactoe_1 = require("./tictactoe");
const _ = require("underscore");
class Evolution {
    constructor() {
        this.genetic = new genetic_1.Genetic;
        this.ticTacToe = new tictactoe_1.TicTacToe;
        this.winners = [];
        this.generations = 0;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.genetic.createFirstGeneration();
            this.generations = 500;
        });
    }
    gamePlay(generations) {
        return __awaiter(this, void 0, void 0, function* () {
            do {
                console.log(`\n ################# Generation ${++this.generations} ##################`);
                for (let round = 0; round < 2; round++) {
                    var players = [];
                    for (let i = 0; i < this.genetic.peoples.length; i++) {
                        if (this.genetic.peoples[i].isWinner)
                            players.push(this.genetic.peoples[i]);
                        if (players.length == 2) {
                            yield this.contest([players[0], players[1]]);
                            this.ticTacToe.printBoard();
                            var players = [];
                        }
                    }
                }
                console.log(`\n ########### Results ###################`);
                let winners = [];
                for (let i = 0; i < this.genetic.peoples.length; i++) {
                    if (this.genetic.peoples[i].isWinner) {
                        winners.push(i);
                    }
                }
                yield this.genetic.setWinners(winners[0], winners[1]);
                this.genetic.peoples.forEach(people => {
                    console.log(`${people.name} Qtde: ${people.qtdeChampion}`);
                });
                yield this.genetic.createNextGenerations();
                if (this.generations % 50 == 0) {
                    console.log('Genomas Winners:');
                    console.log(`G1: ${this.genetic.genomaWinner1}`);
                    console.log(`G2: ${this.genetic.genomaWinner2}`);
                }
            } while (this.generations < generations);
        });
    }
    contest(players) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ticTacToe = new tictactoe_1.TicTacToe;
            players = _.shuffle(players);
            players[0].nickname = tictactoe_1.Player.X;
            players[1].nickname = tictactoe_1.Player.O;
            players[0].isWinner = false;
            players[1].isWinner = false;
            console.log(`\n---- ${players[0].name} VS ${players[1].name} -------`);
            for (let i = 0; i < 9; i++) {
                let move = yield players[i % 2].predict(this.ticTacToe.getBoard(players[i % 2].nickname));
                let status = yield this.ticTacToe.play(move, players[i % 2].nickname);
                if (status.status == tictactoe_1.StatusGame.win)
                    console.log(players[i % 2].name + ' Play:' + status.move + ' [' + players[i % 2].nickname + '] ==> ' + status.status);
                if (status.status == tictactoe_1.StatusGame.loss) {
                    players[i % 2].isWinner = false;
                    players[(i + 1) % 2].isWinner = true;
                    break;
                }
                if (status.status == tictactoe_1.StatusGame.win) {
                    players[i % 2].isWinner = true;
                    players[(i + 1) % 2].isWinner = false;
                    break;
                }
                if (i == 8) {
                    console.log('Game Draw');
                    if (players[0].qtdeChampion >= players[1].qtdeChampion) {
                        players[0].isWinner = true;
                        players[1].isWinner = false;
                    }
                    else {
                        players[0].isWinner = false;
                        players[1].isWinner = true;
                    }
                }
            }
            //this.ticTacToe.printBoard();
        });
    }
}
exports.Evolution = Evolution;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let ev = new Evolution();
        yield ev.initialize();
        yield ev.gamePlay(1000);
    });
}
main();
//# sourceMappingURL=evolution.js.map