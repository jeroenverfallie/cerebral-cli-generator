import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

export function verifyExists(fullPath) {
    return fs.existsSync(fullPath) ? fullPath : null;
}

export function findRecursive(dir, fileName) {
    var fullPath = path.join(dir, fileName);
    var nextDir = path.dirname(dir);
    var result = verifyExists(fullPath);

    if (!result && (nextDir !== dir)) {
        result = findRecursive(nextDir, fileName);
    }

    return result;
}

export function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE || "";
}

export function findConfigFilePath(dir, filename) {
    let configPath = findRecursive(dir, filename);

    if (!configPath) {
        const inHomePath = path.join(getUserHome(), filename);
        if (verifyExists(inHomePath)) {
            configPath = inHomePath;
        }
    }

    return configPath;
}

export function createFile(filePath, content) {
    mkdirp.sync(path.dirname(filePath));

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
    }
}
