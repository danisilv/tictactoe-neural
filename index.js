const tf = require('@tensorflow/tfjs');

// Load the binding:
require('@tensorflow/tfjs-node');  // Use '@tensorflow/tfjs-node-gpu' if running with GPU.


async function test() {

  const model = tf.sequential({
    layers: [tf.layers.dense({ units: 2, inputShape: [2], activation: 'relu',useBias:false })]
  })

  tf.sequen
  

    model.add(tf.layers.dense({ units: 5, activation: 'relu',useBias:false }));
    model.add(tf.layers.dense({ units:1, activation: 'relu',useBias:false }));



  model.compile({ optimizer: 'adam', loss: 'meanSquaredError',metrics:['accuracy'] });
                      // i,p
   //const t1 = tf.tensor([[1,0],[1,2],[2,2],[3,3],[4,4],[1,3],[2,5],[3,2],[2,7],[5,4], [86,10]]);
   //const t2 = tf.tensor([[1],  [3],  [4],  [6],  [8],  [4],  [7],  [5],  [9],  [9],   [96]  ]);
   //const t2 = tf.tensor([[1],  [1],  [0],  [0],  [0],  [0],  [1],  [1],  [1],  [1],   [0]  ]);

  const t1 = tf.tensor([[0.0,0.0],[0.2,0.3],[0.45,0.2]])
  const t2 = tf.tensor([[0.0],    [0.5],    [0.65]]);


  await model.predict(tf.tensor([[0.2,0.5]])).print();

  console.log(model.summary());
  var pesos = await model.getWeights();
  let x = await pesos[0].data();
  

  var newpeso = [];
  newpeso.push(tf.tensor([[0.1,0.1],[0.1,0.1]]));
  
  
  await model.layers[0].setWeights(newpeso);
  await model.predict(tf.tensor([[0.2,0.3]])).print();


     

  const history = await model.fit(t1, t2, {
    //batchSize: 10,
    epochs: 1000,
    verbose: 1
  });

  await model.predict(tf.tensor([[0.2,0.3]])).print();
  pesos = await model.layers[0].getWeights();
  pesos[0].print();
  
}

test();


