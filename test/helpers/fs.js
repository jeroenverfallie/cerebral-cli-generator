import fs from 'fs';

export function initTest(name = 'full-test') {

}

export function verifyFileExists(filePath) {
    return fs.existsSync(filePath);
}

export function getFileContents(filePath) {
    return fs.readFileSync(filePath, {encoding: 'uft8'});
}
