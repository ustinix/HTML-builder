const path = require('path');
const pathFolder = path.join(__dirname, 'files');
const pathCopyFolder = path.join(__dirname, 'files-copy');
const fs = require('fs');
const fspromises = require('fs/promises');

async function copyFile(sourcePath, destinationPath) {
  try {
    fspromises.mkdir(destinationPath, { recursive: true });
    fspromises.readdir(sourcePath).then(async (filenames) => {
      const files = await fs.promises.readdir(sourcePath);
      const filesCopy = await fs.promises.readdir(destinationPath);
      for (const file of filesCopy) {
        if (!files.includes(file)) {
          const filePathToRemove = path.join(destinationPath, file);
          await fs.promises.unlink(filePathToRemove);
          console.log(`File ${file} has been removed from files-copy.`);
        }
      }

      for (let filename of filenames) {
        const filePath = path.join(sourcePath, filename);
        const fileCopyPath = path.join(destinationPath, filename);

        const sourceStat = await fspromises.stat(filePath);

        if (sourceStat.isDirectory()) {
          copyFile(filePath, fileCopyPath);
        } else {
          fspromises.copyFile(filePath, fileCopyPath);
        }
      }
    });
    console.log('File copied successfully!');
  } catch (error) {
    console.error('Error copying file:', error);
  }
}

copyFile(pathFolder, pathCopyFolder);
