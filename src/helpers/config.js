import path from 'path';
import season from 'season';
import editorConfig from 'editorconfig';
import deepExtend from 'deep-extend';
import clone from 'clone';

import * as fsHelpers from './fs.js';
import defaultConfig from '../config/defaultConfig.js';

const CONFIG_FILENAME = '.cerebralrc';

export function getConfig(filePath, masterConfig) {
    const userConfig = !masterConfig || masterConfig.useRcFile ? getConfigRc(filePath) : masterConfig;
    const config = deepExtend(clone(defaultConfig), userConfig);

    // Check editorconfig
    if (config.style.indentationPrefersEditorConfig) {
        const ec = editorConfig.parseSync(filePath);
        if (ec && ec.indent_style) {
            if (ec.indent_style === 'space') {
                config.style.indentation = new Array(ec.indent_size + 1).join(' ');
            }
            if (ec.indent_style === 'tab') {
                config.style.indentation = '\t';
            }
        }
    }

    config.specialImportsMap = mapSpecialImports(config.specialImports);

    return config;
}

function getConfigRc(filePath) {
    const configPath = fsHelpers.findConfigFilePath(path.dirname(filePath), CONFIG_FILENAME);

    if (!configPath) {
        return {};
    }

    try {
        const config = season.readFileSync(configPath);
        return config && config.generator ? config.generator : {};
    } catch (exception) {
        return {};
    }
}

function mapSpecialImports(config) {
    const map = {};
    const processNode = (node) => {
        if (node.keys && node.importPath) {
            node.keys.map(key => {
                map[key] = node.importPath.replace(/\{KEY\}/g, key);
            });
        } else {
            Object.keys(node).map(key => {
                map[key] = node[key];
            });
        }
    };

    if (config instanceof Array) {
        config.map(processNode);
    } else if (config instanceof Object) {
        processNode(config);
    }

    return map;
}
