const path = require('path');
const projectPath = path.join(__dirname, './project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const cssPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const copyAssetsPath = path.join(projectPath, 'assets');
const cssBundlePath = path.join(projectPath, 'style.css');
const fs = require('fs');
const fspromises = require('fs/promises');

// функция копирования из 4 задачи. Копируем папку assets
async function copyDir(sourcePath, destinationPath) {
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
          copyDir(filePath, fileCopyPath);
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

//чтение шаблона
async function readTemplateFile() {
  try {
    return fs.promises.readFile(templatePath, 'utf8');
  } catch (error) {
    console.error('The error occurred', error);
    process.exit(1);
  }
}

// читаем компоненты
async function readComponent(name) {
  const filePath = path.join(componentsPath, `${name}.html`);
  try {
    return fs.promises.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading component ${name}:`, error);
    throw error;
  }
}

async function replaceTemplateTags(templateContent) {
  const tags = templateContent.match(/{{\w+}}/g);
  if (!tags) return templateContent;

  for (const tag of tags) {
    const tagName = tag.slice(2, -2);
    const componentContent = await readComponent(tagName);
    templateContent = templateContent.replace(tag, componentContent);
  }

  return templateContent;
}

async function main() {
  try {
    await fs.mkdir(projectPath, { recursive: true }, (error) => {
      if (error) {
        console.error('The error occurred', error);
        process.exit(1);
      }
      console.log(`Directory ${projectPath} created successfully!`);
    });
    const templateContent = await readTemplateFile();
    const replacedContent = await replaceTemplateTags(templateContent);
    console.log(replacedContent);
    const indexPath = path.join(projectPath, 'index.html');
    try {
      fs.promises.writeFile(indexPath, replacedContent, 'utf8');
      console.log(`File ${indexPath} has been successfully written.`);
    } catch (error) {
      console.error(`Error writing file ${indexPath}:`, error);
    }

    // сборка css
    const arr = [];

    fs.readdir(cssPath, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        const filePath = path.join(cssPath, file);

        fs.stat(filePath, (err, stats) => {
          if (err) {
            if (err) throw err;
            return;
          }

          if (stats.isFile() && path.extname(filePath) === '.css') {
            fs.readFile(filePath, 'utf8', function (error, data) {
              if (error) throw error;
              arr.push(data);
              fs.writeFile(cssBundlePath, arr.join('\n'), (error) => {
                if (error) {
                  console.error(error);
                } else {
                  console.log('Data written to file');
                }
              });
            });
          }
        });
      });

      process.on('exit', () => {
        console.log('Thanks, Buy!');
      });
    });
    await copyDir(assetsPath, copyAssetsPath);

    console.log('HTML page build successful');
  } catch (error) {
    console.error('The error occurred', error.message);
    process.exit(1);
  }
}

main();
