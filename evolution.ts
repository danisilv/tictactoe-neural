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

                if (Math.random() < 0.5)
                    await this.contest(this.genetic.peoples[playerA], this.genetic.peoples[playerB]);
                else
                    await this.contest(this.genetic.peoples[playerB], this.genetic.peoples[playerA]);
            }
        }

        this.genetic.peoples = _.sortBy(this.genetic.peoples, 'points');
        
        let meanPlays =0;
        this.genetic.peoples.forEach( people => {
            console.log(`${people.name} Points: ${people.points} (${people.plays}) (${people.qtdeChampion}) [W:${people.wins} T: ${people.tied} L: ${people.losses}]`)
            meanPlays += people.plays;
        })
        
        console.log(`Mean Plays: ${meanPlays/this.genetic.peoples.length}`)

        await this.genetic.setWinners();

        

        await this.genetic.createNextGenerations();

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

    async contest(playerA: People, playerB: People) {
        
        this.ticTacToe = new TicTacToe;
        //players = _.shuffle(players);

        playerA.nickname = Player.X;
        playerB.nickname = Player.O;

       // console.log(`\n---- ${playerA.name} VS ${playerB.name} -------`)

        let playerTurn = playerA;
        let playerNextTurn = playerB;

        for (let i = 0; i < 9; i++) {
            let move = await playerTurn.predict(this.ticTacToe.getBoard(playerTurn.nickname));
            let status = await this.ticTacToe.play(move, playerTurn.nickname);
            playerTurn.plays++;

            if (status.status == StatusGame.win) {
                //console.log(players[i % 2].name + ' Play:' + status.move + ' [' + players[i % 2].nickname + '] ==> ' + status.status);
                if (playerTurn == playerA) playerTurn.points += 10;
                if (playerTurn == playerB) playerTurn.points += 15;
                playerTurn.wins++;
                playerNextTurn.losses++;
                break;
            }

            if (status.status == StatusGame.loss) {
                if (playerNextTurn == playerA) playerTurn.points += 10;
                if (playerNextTurn == playerB) playerTurn.points += 15;
                playerTurn.losses++;
                playerNextTurn.wins++;
                break;
            }

            if (status.status == StatusGame.draw && i == 8) {
                if (playerTurn == playerA){
                    playerTurn.points += 5;
                    playerNextTurn.points += 10;
                } 
                if (playerTurn == playerB)
                {
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
    for (let i =0; i<10000; i++){
        
        
        await ev.championship();
        if (i % 3 == 0)
            await ev.genetic.peoples[ev.genetic.qtdePeoples-1].neural.model.save(`file://models/model${i}`)
    }
        

}

main();

