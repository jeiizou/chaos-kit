const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const mustache = require('mustache');

const __packagePath = path.resolve(__dirname, '..', 'packages');
const __templatePath = path.resolve(__dirname, '__template__');

inquirer
    .prompt([
        {
            type: 'input',
            name: 'name',
            message: 'input package name',
        },
        {
            type: 'input',
            name: 'description',
            message: 'input package description',
        },
    ])
    .then(ans => {
        checkPackageTsExist(ans.name);
        createPackage(ans);
    });

function createPackage(answer) {
    let dirPath = path.resolve(__packagePath, answer.name);

    // empty directory won't be created
    function renderFile(curFilePath) {
        let fileStat = fs.statSync(curFilePath);
        if (fileStat.isDirectory()) {
            // handle dir
            let files = fs.readdirSync(curFilePath);
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                let filePath = path.resolve(curFilePath, file);
                renderFile(filePath);
            }
        } else {
            // handle file
            let fileContent = fs.readFileSync(curFilePath, 'utf8');
            fileContent = mustache.render(fileContent, answer);

            let relativePath = path.relative(__templatePath, curFilePath);
            let targetFilePath = path.resolve(dirPath, relativePath);

            fs.ensureFileSync(targetFilePath);
            fs.writeFileSync(targetFilePath, fileContent, 'utf8');

            console.log(`create: ${relativePath}`);
        }
    }

    renderFile(__templatePath);
}

function checkPackageTsExist(packageName) {
    let dirPath = path.resolve(__packagePath, packageName);
    if (fs.existsSync(dirPath)) {
        console.warn('WARN: Package already exists');
        process.exit(1);
    }
}
