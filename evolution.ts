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
        this.generations = 0;
    }

    async championship() {
        console.log(`\n ################# Generation ${++this.generations} ##################`);
        for (let playerA = 0; playerA < this.genetic.peoples.length - 1; playerA++) {

            for (let playerB = playerA + 1; playerB < this.genetic.peoples.length; playerB++) {

                await this.contest(this.genetic.peoples[playerA], this.genetic.peoples[playerB]);
                await this.contest(this.genetic.peoples[playerB], this.genetic.peoples[playerA]);
            }
        }

       // this.genetic.peoples = _.sortBy(this.genetic.peoples, 'points');

        this.genetic.peoples = this.genetic.peoples.sort((a, b) => {
            if (a.points != b.points) return a.points - b.points
            else if (a.plays != b.plays) return a.plays - b.plays
            else return a.qtdeChampion - b.qtdeChampion
            //   if (a.plays != b.plays) return a.points - b.points
            //  else return a.plays - b.plays
        })

        let meanPlays = 0;
        this.genetic.peoples.forEach(people => {
            console.log(`${people.name} Points: ${people.points} (${people.plays}) (${people.qtdeChampion}) [W:${people.wins} T: ${people.tied} L: ${people.losses}]`)
            meanPlays += people.plays;
        })

        console.log(`Mean Plays: ${meanPlays / this.genetic.peoples.length}`)

        await this.genetic.setWinners();



        await this.genetic.createNextGenerations();

    }

   
    async contest(firstPlayer: People, secondPlayer: People) {

        this.ticTacToe = new TicTacToe;
        //players = _.shuffle(players);

        firstPlayer.nickname = Player.X;
        secondPlayer.nickname = Player.O;

        // console.log(`\n---- ${playerA.name} VS ${playerB.name} -------`)

        let playerTurn = firstPlayer;
        let playerNextTurn = secondPlayer;

        for (let i = 0; i < 9; i++) {
            let move = await playerTurn.predict(this.ticTacToe.getBoard(playerTurn.nickname));
            let status = await this.ticTacToe.play(move, playerTurn.nickname);
            playerTurn.plays++;

            if (status.status == StatusGame.win) {
                //console.log(players[i % 2].name + ' Play:' + status.move + ' [' + players[i % 2].nickname + '] ==> ' + status.status);
                if (playerTurn == firstPlayer) playerTurn.points += 10;
                if (playerTurn == secondPlayer) playerTurn.points += 15;
                playerTurn.wins++;
                playerNextTurn.losses++;
                break;
            }

            if (status.status == StatusGame.loss) {
                if (playerNextTurn == firstPlayer) playerNextTurn.points += 10;
                if (playerNextTurn == secondPlayer) playerNextTurn.points += 15;
                playerTurn.losses++;
                playerNextTurn.wins++;
                break;
            }

            if (status.status == StatusGame.draw && i == 8) {
                if (playerTurn == firstPlayer) {
                    playerTurn.points += 10;
                    playerNextTurn.points += 15;
                }
                if (playerTurn == secondPlayer) {
                    playerTurn.points += 10;
                    playerNextTurn.points += 5

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


    }

}

async function main() {
    let ev = new Evolution();
    await ev.initialize();
    for (let i = 0; i < 10000; i++) {


        await ev.championship();
        if (i % 100 == 0)
            await ev.genetic.peoples[ev.genetic.qtdePeoples - 1].neural.model.save(`file://models/model${i}`)
    }


}

main();

