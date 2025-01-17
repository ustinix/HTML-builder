const fs = require('fs');
const path = require('path');
const pathTxt = path.join(__dirname, 'text.txt');
console.log(pathTxt);

const readStream = fs.createReadStream(pathTxt);

readStream.on('data', (chunk) => {
  console.log(chunk.toString());
});
