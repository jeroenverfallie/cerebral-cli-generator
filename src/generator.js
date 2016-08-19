import chainTemplate from './templateParsers/chain.js';
import factoryTemplate from './templateParsers/factory.js';
import actionTemplate from './templateParsers/action.js';
import signalTemplate from './templateParsers/signal.js';

function generateContent(part, partType, config) {
    let content;
    switch (partType) {
        case 'chainFactory':
            content = factoryTemplate(part, config.templates.chainFactory);
            break;
        case 'actionFactory':
            content = factoryTemplate(part, config.templates.actionFactory);
            break;
        case 'action':
            content = actionTemplate(part, config.templates.action);
            break;
        case 'chain':
            content = chainTemplate(part, config.templates.chain);
            break;
        case 'signal':
            content = signalTemplate(part, config.templates.signal);
            break;
        default:
            content = ''
    }

    return content;
}


function generateImports(parseResult, config) {
    const { paths: typePaths } = config;

    return parseResult.newParts.map(part => {
        let line = '';
        let path = '';
        let shouldCreateFile = false;

        let partType = part.type;
        if (partType === 'chain_signal') {
            partType = config.legacy.signalFiles ? 'signal' : 'chain';
        }

        if (config.specialImportsMap[part.identifier]) {
            path = config.specialImportsMap[part.identifier];
        } else {
            path = `${typePaths[partType]}/${part.identifier}.js`;
            shouldCreateFile = true;

            if (parseResult.type === 'SignalOrChainFile') {
                path = `../${path}`;
            } else {
                path = `./${path}`;
            }
        }



        line = `import ${part.identifier} from '${path}'${config.style.imports.semiColon ? ';' : ''}`;

        let content = false;
        if (shouldCreateFile) {
            content = generateContent(part, partType, config);
            content = content.replace(/\ {2}/g, config.style.indentation);
        }

        return {
            identifiers: [part.identifier],
            lines: [line],
            path: path,
            shouldCreateFile: shouldCreateFile,
            content
        };
    });
}

export function generate(fileContent, parseResult, config) {
    const newImports = generateImports(parseResult, config);

    let newContent = fileContent;
    let imports = newImports;

    if (config.style.imports.sortAll) {
        let lines = fileContent.split('\n');
        parseResult.imports.map(imp => {
            for (let i = imp.loc.start; i < imp.loc.end; i++) {
                lines[i] = '_____REMOVE_THIS_LINE_____';
            }
        });
        newContent = lines
                    .filter(line => line !== '_____REMOVE_THIS_LINE_____')
                    .join('\n');

        imports = [...parseResult.imports, ...newImports];
    }

    if (config.style.imports.sortBy === 'type') {
        imports = imports.sort((a, b) => {
            if (a.path.slice(0, 1) === '.' && b.path.slice(0, 1) !== '.') {
                return 1;
            }

            if (b.path.slice(0, 1) === '.' && a.path.slice(0, 1) !== '.') {
                return -1;
            }

            if (a.path > b.path) {
                return 1;
            }

            if (a.path < b.path) {
                return -1;
            }

            return 0;
        });
    }

    if (imports && imports.length > 0) {
        const groupRegex = '(' + Object.keys(config.paths).reduce((sum, key) => [...sum, config.paths[key]], []).join('|') + ')';

        let importsText = '';
        let lastFirstPartOfPath = false;
        imports.map(imp => {
            const matches = imp.path.match(groupRegex);
            const thisFirstPartOfPath = matches && matches.length ? matches[0] : imp.path.slice(0, 6);
            if (
                config.style.imports.separateGroups !== 'none' &&
                (
                    config.style.imports.separateGroups === 'all' ||
                    (config.style.imports.separateGroups === 'local' && thisFirstPartOfPath.slice(0, 1) === '.')
                ) &&
                lastFirstPartOfPath && lastFirstPartOfPath !== thisFirstPartOfPath
            ) {
                importsText += '\n';
            }

            importsText += imp.lines.join('\n') + '\n';
            lastFirstPartOfPath = thisFirstPartOfPath;
        });

        newContent = importsText + '\n' + newContent;
        newContent = newContent.replace(/\n{4,}/, '\n\n\n');

        return {
            content: newContent,
            filesToCreate: newImports.filter(imp => imp && imp.shouldCreateFile)
        };
    }
}
