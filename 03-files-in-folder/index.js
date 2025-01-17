const fs = require('fs');
const path = require('path');
const pathFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathFolder, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const filePath = path.join(pathFolder, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        if (err) throw err;
        return;
      }

      if (stats.isFile()) {
        const fileExtension = path.extname(file);
        const fileName = path.basename(file, fileExtension);
        const fileSize = stats.size;
        console.log(
          fileName + ' - ' + fileExtension.slice(1) + ' - ' + fileSize,
        );
      };
    });
  });
});
