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
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node'); // Use '@tensorflow/tfjs-node-gpu' if running with GPU.
class Neural {
    initalize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.model = yield tf.sequential({
                layers: [tf.layers.dense({ units: 18, inputShape: [9], activation: 'linear', useBias: false, kernelInitializer: 'randomUniform' })]
            });
            //  this.model.add(tf.layers.dense({ units: 32, activation: 'sigmoid',useBias: false, kernelInitializer: 'randomUniform' }));
            //this.model.add(tf.layers.dense({ units: 20, activation: 'relu',useBias: false, kernelInitializer: 'randomUniform' }));
            this.model.add(tf.layers.dense({ units: 9, activation: 'sigmoid', useBias: false, kernelInitializer: 'randomUniform' }));
            yield this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError', metrics: ['accuracy'] });
        });
    }
    predict(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let tensorResult = yield this.model.predict(tf.tensor([input])).data();
            return tensorResult;
        });
    }
    getWeight(layer) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.layers[layer].getWeights()[0].data();
        });
    }
    getWeights() {
        return __awaiter(this, void 0, void 0, function* () {
            let weights = [];
            weights.push(yield this.getWeight(0));
            weights.push(yield this.getWeight(1));
            //  weights.push(await this.getWeight(2));
            // weights.push(await this.getWeight(3));
            return weights;
        });
    }
    setWeights(weights) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setWeight(0, weights[0]);
            yield this.setWeight(1, weights[1]);
            //    await this.setWeight(2,weights[2]);
            // await this.setWeight(3,weights[3]);
        });
    }
    setWeight(layer, weights) {
        return __awaiter(this, void 0, void 0, function* () {
            var newWights = [];
            var shape;
            if (layer == 0)
                shape = [9, 18];
            else if (layer == 1)
                shape = [18, 9];
            newWights.push(tf.tensor(weights, shape));
            yield this.model.layers[layer].setWeights(newWights);
        });
    }
}
exports.Neural = Neural;
// async function main() {
//     var neural = new Neural;
//     await neural.initalize();
//     let test = await neural.predict([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
//     let w = await neural.getWeight(2);
//     await neural.setWeight(2, w);
// }
// main(); 
//# sourceMappingURL=neural.js.map