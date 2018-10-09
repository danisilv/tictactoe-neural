import { Genetic, People } from "./genetic";
import { TicTacToe, Player, StatusGame } from "./tictactoe";
import _ = require('underscore');
import { Stats } from "fs";

export class Evolution {
    genetic = new Genetic;
    ticTacToe = new TicTacToe;
    winners = [];
    generations = 0;

    async initialize() {
     
        await this.genetic.createFirstGeneration();
        this.generations = 500;


    }

    async gamePlay(generations: number) {
        do {


            console.log(`\n ################# Generation ${++this.generations} ##################`)
            for (let round = 0; round < 2; round++) {
                var players = [];
                for (let i = 0; i < this.genetic.peoples.length; i++) {
                    if (this.genetic.peoples[i].isWinner) players.push(this.genetic.peoples[i]);

                    if (players.length == 2) {
                        await this.contest([players[0], players[1]]);
                        this.ticTacToe.printBoard();
                        var players = [];
                    }

                }
            }

            console.log(`\n ########### Results ###################`)
            let winners = [];
            for (let i = 0; i < this.genetic.peoples.length; i++) {
                if (this.genetic.peoples[i].isWinner) {

                    winners.push(i);
                }

            }

            await this.genetic.setWinners(winners[0], winners[1]);

            this.genetic.peoples.forEach(people => {
                console.log(`${people.name} Qtde: ${people.qtdeChampion}`)
            })

            await this.genetic.createNextGenerations();

            if (this.generations % 50 == 0) {
                console.log('Genomas Winners:')

                console.log(`G1: ${this.genetic.genomaWinner1}`)
                console.log(`G2: ${this.genetic.genomaWinner2}`)

            }



        } while (this.generations < generations);
    }

    async contest(players: People[]) {
        this.ticTacToe = new TicTacToe;
        players = _.shuffle(players);
        players[0].nickname = Player.X;
        players[1].nickname = Player.O;
        players[0].isWinner = false;
        players[1].isWinner = false;

        console.log(`\n---- ${players[0].name} VS ${players[1].name} -------`)

        for (let i = 0; i < 9; i++) {
            let move = await players[i % 2].predict(this.ticTacToe.getBoard( players[i % 2].nickname));
            let status = await this.ticTacToe.play(move, players[i % 2].nickname);

            if (status.status == StatusGame.win)
                console.log(players[i % 2].name + ' Play:' + status.move + ' [' + players[i % 2].nickname + '] ==> ' + status.status);

            if (status.status == StatusGame.loss) {
                players[i % 2].isWinner = false;
                players[(i + 1) % 2].isWinner = true;
                break;
            }
            if (status.status == StatusGame.win) {
                players[i % 2].isWinner = true;
                players[(i + 1) % 2].isWinner = false;
                break;
            }

            if (i == 8) {
                console.log('Game Draw')
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


    }
}

async function main() {
    let ev = new Evolution();
    await ev.initialize();
    await ev.gamePlay(1000);

}

main();

