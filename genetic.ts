import { Neural } from "./neural";
import * as faker from "faker";
import { TicTacToe, Player } from "./tictactoe";
const fs = require('fs');
import _ = require('underscore');

export class People {
    public neural = new Neural;
    public name: string;
    public isWinner = false;
    public nickname: Player;
    public plays:0;
    public qtdeChampion = 0;
    public points = 0;
    public wins = 0;
    public tied = 0;
    public losses = 0;

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
    mutationIndice = 0.05;


    public qtdePeoples = 20;
    public peoples: People[] = [];

    public genomaWinner1 = [];
    public genomaWinner2 = [];
    public nameWinner1:string;
    public nameWinner2:string;




    public async createFirstGeneration(genoma1?, genoma2?) {
        if (genoma1) {
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

    public async setWinners() {
        // let winners = this.peoples.filter((people, index) => {
        //     return (index == firstPlace || index == secondPlace)
        // })
       
         this.genomaWinner1 = await this.peoples[this.qtdePeoples -1].neural.getWeights();
         this.genomaWinner2 = await this.peoples[this.qtdePeoples -2].neural.getWeights();
         
         this.nameWinner1 = this.peoples[this.qtdePeoples -1].name;
         this.nameWinner2 = this.peoples[this.qtdePeoples -2].name;
         
         this.peoples[this.qtdePeoples -1].qtdeChampion++;
         this.peoples[this.qtdePeoples -2].qtdeChampion++;

        // for (let i = 0; i < this.peoples.length; i++) {
        //     if (i != firstPlace && i != secondPlace) {

        //     }

        //     if (i == firstPlace) {
        //         this.genomaWinner1 = await this.peoples[i].neural.getWeights();
        //         await this.peoples[0].neural.setWeights(await this.peoples[i].neural.getWeights())
        //         this.peoples[0].name = this.peoples[i].name;
        //         this.peoples[0].qtdeChampion = this.peoples[i].qtdeChampion + 1;
        //         this.peoples[0].isWinner = true;
        //     }

        //     else if (i == secondPlace) {
        //         this.genomaWinner2 = await this.peoples[i].neural.getWeights();
        //         await this.peoples[1].neural.setWeights(await this.peoples[i].neural.getWeights())
        //         this.peoples[1].name = this.peoples[i].name;
        //         this.peoples[1].qtdeChampion = this.peoples[i].qtdeChampion + 1;
        //         this.peoples[1].isWinner = true;
        //     }
        //     else {
        //         this.peoples[i].name = faker.name.findName();
        //         this.peoples[i].qtdeChampion = 0;
        //         this.peoples[i].isWinner = true;
        //     }


        // }

        // this.peoples.forEach(people => {
        //     people.qtdeChampion++;
        // })

        // this.genomaWinner1 = await this.peoples[0].neural.getWeights();
        // this.genomaWinner2 = await this.peoples[1].neural.getWeights();

    }

    public async createNextGenerations() {

        
        this.peoples[0].name = this.nameWinner1;
        this.peoples[0].neural.setWeights(this.genomaWinner1);
        this.peoples[0].points = 0;
        this.peoples[0].plays = 0;
        this.peoples[0].wins = this.peoples[0].losses = this.peoples[0].tied = 0;
        

        
        this.peoples[1].name = this.nameWinner2;
        this.peoples[1].neural.setWeights(this.genomaWinner2);
        this.peoples[1].points = 0;
        this.peoples[1].plays = 0;
        this.peoples[1].wins = this.peoples[1].losses = this.peoples[1].tied = 0;
        

        for (let i = 2; i < this.qtdePeoples; i++) {
            this.peoples[i].name = faker.name.findName();
            this.peoples[i].qtdeChampion = 0;
            this.peoples[i].isWinner = true;
            this.peoples[i].points = 0;
            this.peoples[i].plays = 0;
            this.peoples[i].wins = this.peoples[i].losses = this.peoples[i].tied = 0;

            let newGenoma = await this.genomaCrossOver();
            newGenoma = await this.genenomaMutation(newGenoma);
            
            await this.peoples[i].neural.setWeights(newGenoma);

            //let people = new People;
            //await people.initalize(newGenoma);
            //this.peoples.push(people)
        }

        // colocando 1 aleatorio
        // let people = new People();
        // await people.initalize();
        // this.peoples.push(people)

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