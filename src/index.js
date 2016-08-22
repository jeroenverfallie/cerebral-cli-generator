import fs from 'fs';
import path from 'path';
import * as fsHelpers from './helpers/fs.js';
import * as configHelpers from './helpers/config.js';
import * as parser from './parser.js';
import * as generator from './generator.js';

const defaultLogger = {
    log() {}
};

export function performOnFile({filePath, config = null, write = false, logger = defaultLogger, content = false}) {
    const mergedConfig = configHelpers.getConfig(filePath, config);

    logger.log('CEREBRAL-CLI-GENERATOR: Parsed config', mergedConfig);

    const fileContent = content || fs.readFileSync(filePath, {encoding: 'utf8'});
    const parseResult = parser.parse(fileContent);

    logger.log('CEREBRAL-CLI-GENERATOR: ParseResult', parseResult);

    if (!parseResult) {
        return false;
    }

    const composed = generator.generate(fileContent, parseResult, mergedConfig);

    logger.log('CEREBRAL-CLI-GENERATOR: composed', composed);

    if (write) {
        logger.log(`CEREBRAL-CLI-GENERATOR: Generated and wrote imports for ${filePath}`);
        fs.writeFileSync(filePath, composed.content);
    }

    composed.filesToCreate.forEach(file => {
        logger.log(`CEREBRAL-CLI-GENERATOR: Generated file ${file.path}`);
        fsHelpers.createFile(path.join(path.dirname(filePath), file.path), file.content);
    });

    return composed.content;
}
