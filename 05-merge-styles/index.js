const path = require('path');
const process = require('process');
const folderPath = path.join(__dirname, 'styles');
const projectPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(projectPath, 'bundle.css');
const fs = require('fs');


const arr = [];

fs.readdir(folderPath, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        if (err) throw err;
        return;
      }

      if (stats.isFile() && path.extname(filePath) === '.css') {
        fs.readFile(filePath, 'utf8', function (error, data) {
            if (error) throw error;
            arr.push(data);
            fs.writeFile(bundlePath, arr.join('\n'), (error) => {
                if (error) {
                  console.error(error);
                } else {
                  console.log('Data written to file');
                }
              });
        });

      };
    });
  });

  process.on('exit', () => {
    console.log('Thanks, Buy!');
  });
});