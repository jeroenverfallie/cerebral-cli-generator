import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

export function verifyExists(fullPath) {
    if(fs.existsSync(fullPath)) {
        return fullPath;
    } else if (fs.existsSync(fullPath + '.json')) {
        return fullPath + '.json';
    } else if (fs.existsSync(fullPath + '.cson')) {
        return fullPath + '.cson';
    }
    return false;
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
        const inHomePath = verifyExists(path.join(getUserHome(), filename));
        if (inHomePath) {
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
