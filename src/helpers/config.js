import path from 'path';
import season from 'season';
import editorConfig from 'editorconfig';
import deepExtend from 'deep-extend';

import * as fsHelpers from './fs.js';
import defaultConfig from '../config/defaultConfig.js';

const CONFIG_FILENAME = '.cerebralrc';

export function getConfig(filePath, masterConfig) {
    const userConfig = !masterConfig || masterConfig.useRcFile ? getConfigRc(filePath) : masterConfig;
    const config = deepExtend(defaultConfig, userConfig);

    // Check editorconfig
    if (config.style.indentationPrefersEditorConfig) {
        const ec = editorConfig.parseSync(filePath);
        if (ec) {
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

    return season.readFileSync(configPath) || {};
}

function mapSpecialImports(config) {
    if (!config.map) {
        return {};
    }

    const map = {};
    config.map(node => {
        if (node.keys && node.importPath) {
            node.keys.map(key => {
                map[key] = node.importPath.replace(/\{KEY\}/g, key);
            });
        } else {
            Object.keys(node).map(key => {
                map[key] = node[key];
            });
        }
    });

    return map;
}
