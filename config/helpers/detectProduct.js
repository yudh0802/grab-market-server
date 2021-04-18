const tf = require('@tensorflw/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs');
const path = require('path');

function detectProduct(url) {
    const image = fs.readFileSync(url);
    const input = tf.node.decodeImage(image, 3);
    console.log(input);
}

dectectProduct(path.join(__dirname, '../uploads/notebook2.jpg'));
