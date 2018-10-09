import { Neural } from "./neural";
import * as faker from "faker";
import { TicTacToe, Player } from "./tictactoe";
const fs = require('fs');
import _ = require('underscore');

export class People {
    public neural = new Neural;
    public name: string;
    public isWinner = true;
    public nickname: Player;
    qtdeChampion = 0;

    async initalize(genoma?) {
        await this.neural.initalize();
        this.name = faker.name.findName();
        if (genoma) await this.neural.setWeights(genoma);
    }

    async predict(board) {
        let move = await this.neural.predict(board);
        let ranking = [];
        for (let i = 0; i < move.length; i++)
            ranking.push({ value: move[i], index: i })

        ranking = _.sortBy(ranking, 'value')


        return ranking;
    }

}


export class Genetic {

    crossOverIndice = 0.5;
    mutationIndice = 0.30;


    public qtdePeoples = 8;
    public peoples: People[] = [];

    public genomaWinner1 = [];
    public genomaWinner2 = [];

   


    public async createFirstGeneration(genoma1?, genoma2?) {
        if (genoma1){
            let people1 = new People;
            await people1.initalize(genoma1);
            this.peoples.push(people1)

            let people2 = new People;
            await people2.initalize(genoma1);
            this.peoples.push(people2)

            return;
        }
        
        for (let i = 0; i < this.qtdePeoples; i++) {
            let people = new People();
            await people.initalize();
            this.peoples.push(people)
        }
    }

    public async setWinners(firstPlace: number, secondPlace: number) {
        this.peoples = this.peoples.filter((people, index) => {
            return (index == firstPlace || index == secondPlace)
        })

        this.peoples.forEach(people => {
            people.qtdeChampion++;
        })

        this.genomaWinner1 = await this.peoples[0].neural.getWeights();
        this.genomaWinner2 = await this.peoples[1].neural.getWeights();
        
    }

    public async createNextGenerations() {

        for (let i = 0; i < this.qtdePeoples - 3; i++) {
            let newGenoma = await this.genomaCrossOver();
            await this.genenomaMutation(newGenoma);
            let people = new People;
            await people.initalize(newGenoma);
            this.peoples.push(people)
        }

        // colocando 1 aleatorio
        let people = new People();
        await people.initalize();
        this.peoples.push(people)

        this.peoples = _.shuffle(this.peoples)

    }

    private async genenomaMutation(genoma) {
        for (let layer = 0; layer < genoma.length; layer++) {
            for (let i = 0; i < genoma[layer].length; i++) {
                if (Math.random() <= this.mutationIndice) {
                    var value = (Math.random() <= 0.5) ? -1 : 1
                    value += Math.random();
                    genoma[layer][i] *= value;
                }
            }
        }
        return genoma;

    }

    // Uniform Crossover
    private async genomaCrossOver() {

        let newGenoma = [];
        for (let layer = 0; layer < this.genomaWinner1.length; layer++) {
            newGenoma.push(this.genomaWinner1[layer]);
            for (let i = 0; i < this.genomaWinner1[layer].length; i++) {
                if (Math.random() > 0.5)
                    newGenoma[layer][i] = this.genomaWinner2[layer][i];
            }
        }
        return newGenoma;
    }

    async printGenomas() {
        var print = []
        for (let i = 0; i < this.peoples.length; i++) {
            let weight = await this.peoples[i].neural.getWeights();
            print.push({ name: this.peoples[i].name, genoma: weight });
        }



        console.log(print);
        fs.writeFile('./data.json', JSON.stringify(print, null, 2), 'utf-8');
    }
}

// async function main() {

//     var genetic = new Genetic;
//     await genetic.createFirstGeneration();
//     // await genetic.setWinners(0, 7);
//     //  await genetic.createNextGenerations();
//     //await genetic.printGenomas();


//     var ticTacToe = new TicTacToe;
//     for (let i = 0; i < 8; i++) {
//         let move = await genetic.peoples[i].predict(ticTacToe.getBoard());
//         ticTacToe.play(move, Player.X);

//     }
// }


// main()