const fs = require('fs');
const process = require('process');
const path = require('path');
const pathTxt = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathTxt);
console.log('Would you write something for me?');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (line) => {
  output.write(`${line}\n`);

  if (line.toLowerCase() === 'exit') {
    console.log('Output is ending!');
    output.end();
    process.exit();
  }
});
process.on('exit', () => {
  console.log('Thanks, Buy!');
});
