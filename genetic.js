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
const neural_1 = require("./neural");
const faker = require("faker");
const fs = require('fs');
const _ = require("underscore");
class People {
    constructor() {
        this.neural = new neural_1.Neural;
        this.isWinner = true;
        this.qtdeChampion = 0;
    }
    initalize(genoma) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.neural.initalize();
            this.name = faker.name.findName();
            if (genoma)
                yield this.neural.setWeights(genoma);
        });
    }
    predict(board) {
        return __awaiter(this, void 0, void 0, function* () {
            let move = yield this.neural.predict(board);
            let ranking = [];
            for (let i = 0; i < move.length; i++)
                ranking.push({ value: move[i], index: i });
            ranking = _.sortBy(ranking, 'value');
            return ranking;
        });
    }
}
exports.People = People;
class Genetic {
    constructor() {
        this.crossOverIndice = 0.5;
        this.mutationIndice = 0.30;
        this.qtdePeoples = 8;
        this.peoples = [];
        this.genomaWinner1 = [];
        this.genomaWinner2 = [];
    }
    createFirstGeneration(genoma1, genoma2) {
        return __awaiter(this, void 0, void 0, function* () {
            if (genoma1) {
                let people1 = new People;
                yield people1.initalize(genoma1);
                this.peoples.push(people1);
                let people2 = new People;
                yield people2.initalize(genoma1);
                this.peoples.push(people2);
                return;
            }
            for (let i = 0; i < this.qtdePeoples; i++) {
                let people = new People();
                yield people.initalize();
                this.peoples.push(people);
            }
        });
    }
    setWinners(firstPlace, secondPlace) {
        return __awaiter(this, void 0, void 0, function* () {
            this.peoples = this.peoples.filter((people, index) => {
                return (index == firstPlace || index == secondPlace);
            });
            this.peoples.forEach(people => {
                people.qtdeChampion++;
            });
            this.genomaWinner1 = yield this.peoples[0].neural.getWeights();
            this.genomaWinner2 = yield this.peoples[1].neural.getWeights();
        });
    }
    createNextGenerations() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.qtdePeoples - 3; i++) {
                let newGenoma = yield this.genomaCrossOver();
                yield this.genenomaMutation(newGenoma);
                let people = new People;
                yield people.initalize(newGenoma);
                this.peoples.push(people);
            }
            // colocando 1 aleatorio
            let people = new People();
            yield people.initalize();
            this.peoples.push(people);
            //this.peoples = _.shuffle(this.peoples)
        });
    }
    genenomaMutation(genoma) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let layer = 0; layer < genoma.length; layer++) {
                for (let i = 0; i < genoma[layer].length; i++) {
                    if (Math.random() <= this.mutationIndice) {
                        var value = (Math.random() <= 0.5) ? -1 : 1;
                        value += Math.random();
                        genoma[layer][i] *= value;
                    }
                }
            }
            return genoma;
        });
    }
    // Uniform Crossover
    genomaCrossOver() {
        return __awaiter(this, void 0, void 0, function* () {
            let newGenoma = [];
            for (let layer = 0; layer < this.genomaWinner1.length; layer++) {
                newGenoma.push(this.genomaWinner1[layer]);
                for (let i = 0; i < this.genomaWinner1[layer].length; i++) {
                    if (Math.random() > 0.5)
                        newGenoma[layer][i] = this.genomaWinner2[layer][i];
                }
            }
            return newGenoma;
        });
    }
    printGenomas() {
        return __awaiter(this, void 0, void 0, function* () {
            var print = [];
            for (let i = 0; i < this.peoples.length; i++) {
                let weight = yield this.peoples[i].neural.getWeights();
                print.push({ name: this.peoples[i].name, genoma: weight });
            }
            console.log(print);
            fs.writeFile('./data.json', JSON.stringify(print, null, 2), 'utf-8');
        });
    }
}
exports.Genetic = Genetic;
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
//# sourceMappingURL=genetic.js.map