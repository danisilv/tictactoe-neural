import { Model, Sequential, Tensor, Rank, tensor } from "@tensorflow/tfjs";

const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');  // Use '@tensorflow/tfjs-node-gpu' if running with GPU.


export class Neural {

    public model: Sequential;


    public async initalize() {
        this.model = await tf.sequential({
            layers: [tf.layers.dense({ units: 18, inputShape: [9], activation: 'relu', useBias: false, kernelInitializer: 'randomUniform' })]
        });
        this.model.add(tf.layers.dense({ units: 50, activation: 'relu', useBias: false, kernelInitializer: 'randomUniform' }));
        //this.model.add(tf.layers.dense({ units: 20, activation: 'relu',useBias: false, kernelInitializer: 'randomUniform' }));
        this.model.add(tf.layers.dense({ units: 9, activation: 'relu', useBias: false, kernelInitializer: 'randomUniform' }));

        await this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError', metrics: ['accuracy'] });
    }

    public async predict(input: number[]) {

        let tensorResult = await (this.model.predict(tf.tensor([input])) as Tensor<Rank>).data();

        return tensorResult;
    }

    public async  getWeight(layer: number) {
        return await this.model.layers[layer].getWeights()[0].data();
    }

    public async  getWeights() {
        let weights = [];
        weights.push(await this.getWeight(0));
        weights.push(await this.getWeight(1));
        weights.push(await this.getWeight(2));
        // weights.push(await this.getWeight(3));
        return weights;
    }

    public async setWeights(weights) {
        await this.setWeight(0, weights[0]);
        await this.setWeight(1, weights[1]);
        await this.setWeight(2, weights[2]);
        // await this.setWeight(3,weights[3]);
    }

    public async setWeight(layer: number, weights) {
        var newWights = [];
        var shape;

        if (layer == 0) shape = [9, 18]
        else if (layer == 1) shape = [18, 50]
        //else if (layer == 2) shape = [50,20]
        else if (layer == 2) shape = [50, 9]

        newWights.push(
            tf.tidy(() => {
                return tf.tensor(weights, shape)
            })
        )

        await this.model.layers[layer].setWeights(newWights)
    }


}

// async function main() {
//     var neural = new Neural;
//     await neural.initalize();
//     let test = await neural.predict([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
//     let w = await neural.getWeight(2);
//     await neural.setWeight(2, w);




// }

// main();