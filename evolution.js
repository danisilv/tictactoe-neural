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
            this.generations = 0;
        });
    }
    championship() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n ################# Generation ${++this.generations} ##################`);
            for (let playerA = 0; playerA < this.genetic.peoples.length - 1; playerA++) {
                for (let playerB = playerA + 1; playerB < this.genetic.peoples.length; playerB++) {
                    yield this.contest(this.genetic.peoples[playerA], this.genetic.peoples[playerB]);
                    yield this.contest(this.genetic.peoples[playerB], this.genetic.peoples[playerA]);
                }
            }
            this.genetic.peoples = _.sortBy(this.genetic.peoples, 'points');
            let meanPlays = 0;
            this.genetic.peoples.forEach(people => {
                console.log(`${people.name} Points: ${people.points} (${people.plays}) (${people.qtdeChampion}) [W:${people.wins} T: ${people.tied} L: ${people.losses}]`);
                meanPlays += people.plays;
            });
            console.log(`Mean Plays: ${meanPlays / this.genetic.peoples.length}`);
            yield this.genetic.setWinners();
            yield this.genetic.createNextGenerations();
        });
    }
    // async killKill(generations: number) {
    //     do {
    //         console.log(`\n ################# Generation ${++this.generations} ##################`)
    //         for (let round = 0; round < 2; round++) {
    //             var players = [];
    //             for (let i = 0; i < this.genetic.peoples.length; i++) {
    //                 if (this.genetic.peoples[i].isWinner) players.push(this.genetic.peoples[i]);
    //                 if (players.length == 2) {
    //                     await this.contest([players[0], players[1]]);
    //                     this.ticTacToe.printBoard();
    //                     var players = [];
    //                 }
    //             }
    //         }
    //         console.log(`\n ########### Results ###################`)
    //         let winners = [];
    //         for (let i = 0; i < this.genetic.peoples.length; i++) {
    //             if (this.genetic.peoples[i].isWinner) {
    //                 winners.push(i);
    //             }
    //         }
    //         await this.genetic.setWinners(winners[0], winners[1]);
    //         await this.genetic.peoples.forEach(people => {
    //             if (people.qtdeChampion > 0)
    //                 console.log(`${people.name} Qtde: ${people.qtdeChampion}`)
    //         })
    //         await this.genetic.createNextGenerations();
    //         if (this.generations % 200 == 0) {
    //             console.log('Genomas Winners:')
    //             console.log(`G1: ${this.genetic.genomaWinner1}`)
    //             console.log(`G2: ${this.genetic.genomaWinner2}`)
    //         }
    //     } while (this.generations < generations);
    // }
    contest(firstPlayer, secondPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ticTacToe = new tictactoe_1.TicTacToe;
            //players = _.shuffle(players);
            firstPlayer.nickname = tictactoe_1.Player.X;
            secondPlayer.nickname = tictactoe_1.Player.O;
            // console.log(`\n---- ${playerA.name} VS ${playerB.name} -------`)
            let playerTurn = firstPlayer;
            let playerNextTurn = secondPlayer;
            for (let i = 0; i < 9; i++) {
                let move = yield playerTurn.predict(this.ticTacToe.getBoard(playerTurn.nickname));
                let status = yield this.ticTacToe.play(move, playerTurn.nickname);
                playerTurn.plays++;
                if (status.status == tictactoe_1.StatusGame.win) {
                    //console.log(players[i % 2].name + ' Play:' + status.move + ' [' + players[i % 2].nickname + '] ==> ' + status.status);
                    if (playerTurn == firstPlayer)
                        playerTurn.points += 10;
                    if (playerTurn == secondPlayer)
                        playerTurn.points += 15;
                    playerTurn.wins++;
                    playerNextTurn.losses++;
                    break;
                }
                if (status.status == tictactoe_1.StatusGame.loss) {
                    if (playerNextTurn == firstPlayer)
                        playerTurn.points += 10;
                    if (playerNextTurn == secondPlayer)
                        playerTurn.points += 15;
                    playerTurn.losses++;
                    playerNextTurn.wins++;
                    break;
                }
                if (status.status == tictactoe_1.StatusGame.draw && i == 8) {
                    if (playerTurn == firstPlayer) {
                        playerTurn.points += 10;
                        playerNextTurn.points += 15;
                    }
                    if (playerTurn == secondPlayer) {
                        playerTurn.points += 15;
                        playerNextTurn.points += 10;
                    }
                    playerTurn.tied++;
                    playerNextTurn.tied++;
                    break;
                }
                let auxPlayer = playerTurn;
                playerTurn = playerNextTurn;
                playerNextTurn = auxPlayer;
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
        for (let i = 0; i < 10000; i++) {
            yield ev.championship();
            if (i % 100 == 0)
                yield ev.genetic.peoples[ev.genetic.qtdePeoples - 1].neural.model.save(`file://models/model${i}`);
        }
    });
}
main();
//# sourceMappingURL=evolution.js.map