import fs from 'fs';
import path from 'path';

import * as fsHelpers from './helpers/fs.js';
import * as configHelpers from './helpers/config.js';

import * as parser from './parser.js';
import * as generator from './generator.js';

export function performOnFile({ filePath, config = false, write = false, logger = {log: () => {}} }) {
    const mergedConfig = configHelpers.getConfig(filePath, config);

    const fileContent = fs.readFileSync(filePath, {encoding: 'utf8'});
    const parseResult = parser.parse(fileContent);

    if (!parseResult) {
        return false;
    }

    const composed = generator.generate(fileContent, parseResult, mergedConfig);

    if (write) {
        logger.log(`Inserted imports into ${filePath}`);
        fs.writeFileSync(filePath, composed.content);
    }

    composed.filesToCreate.forEach(file => {
        logger.log(`Generated ${file.path}.`);
        fsHelpers.createFile(path.join(path.dirname(filePath), file.path), file.content);
    });

    return composed;
};
