import * as babylon from 'babylon';

export function parse(text) {
    const source = babylon.parse(text, { sourceType: 'module' });
    const body = source.program.body;

    const lines = text.split('\n');

    const imports = getImports(body, lines);
    const declaration = getDeclaration(body, text);

    if (!declaration) {
        return false;
    }

    const newParts = declaration.parts
        .filter(part => {
            return !imports.find(
                imp => imp.identifiers.indexOf(part.identifier) > -1
            );
        })
        .map(part => {
            part.async = part.identifier.toLowerCase().indexOf('async') > -1;
            return part;
        });

    return {
        imports,
        newParts,
        parts: declaration.parts,
        type: declaration.type
    };
}

function getImports(body, lines) {
    return body.filter(node => node.type === 'ImportDeclaration').map(node => {
        const identifiers = node.specifiers
            .filter(obj => obj.local.type === 'Identifier')
            .map(identifier => identifier.local.name);
        const path = node.source.value;
        const start = node.loc.start.line - 1;
        const end = node.loc.end.line;

        return {
            lines: lines.slice(start, end),
            loc: {
                start,
                end
            },
            identifiers,
            path
        };
    });
}

function recursiveFindSignals(body) {
    if (body.forEach) {
        for (let i = 0; i < body.length; i++) {
            const result = recursiveFindSignals(body[i]);
            if (result) {
                return result;
            }
        }
    }

    if (body.type === 'ObjectProperty') {
        if (body.key.name === 'signals') {
            return body.value;
        }
    }

    if (body.type === 'ObjectExpression') {
        return recursiveFindSignals(body.properties);
    }

    if (
        body.type === 'ReturnStatement' &&
        (body.argument.type === 'ArrowFunctionExpression' ||
            body.argument.type === 'FunctionExpression' ||
            body.argument.type === 'ObjectExpression')
    ) {
        return recursiveFindSignals(body.argument);
    }

    if (body.declaration && body.declaration.body) {
        return recursiveFindSignals(body.declaration.body);
    }

    if (body.declaration && body.declaration.properties) {
        return recursiveFindSignals(body.declaration.properties);
    }

    if (body.body) {
        return recursiveFindSignals(body.body);
    }

    return false;
}

function getDeclaration(body, text) {
    if (text.indexOf('signals') > -1) {
        const node = recursiveFindSignals(body);
        if (node) {
            const elements = node.properties;

            const parts = parseCollection(elements);

            return { parts: parts, type: 'ModuleFile' };
        }
    }

    const exportDefaultDeclaration = body.find(
        node => node.type === 'ExportDefaultDeclaration'
    );
    if (!exportDefaultDeclaration) {
        return false;
    }

    const signalDeclaration = exportDefaultDeclaration.declaration;
    if (signalDeclaration.type === 'ArrayExpression') {
        const elements = signalDeclaration.elements;
        const parts = parseCollection(elements);
        const uniqueParts = parts.reduce((unique, part) => {
            const found = unique.find(
                item => item.identifier === part.identifier
            );
            if (found) {
                if (
                    found.argumentCount !== undefined &&
                    part.argumentCount !== undefined
                ) {
                    found.argumentCount = Math.max(
                        found.argumentCount,
                        part.argumentCount
                    );
                }
            } else {
                unique.push(part);
            }
            return unique;
        }, []);

        return { parts: uniqueParts, type: 'SignalOrChainFile' };
    }

    if (signalDeclaration.type === 'ObjectExpression') {
        const elements = signalDeclaration.properties;
        const parts = parseCollection(elements);

        return { parts, type: 'SignalDefinitionsFile' };
    }

    return false;
}

function parseCollection(collection) {
    let foundParts = [];
    let lastPart = null;
    for (const element of collection) {
        const part = {};
        if (element.type === 'CallExpression') {
            part.type = 'actionFactory';
            part.identifier = element.callee.name;
            part.argumentCount = element.arguments.length;

            const arrays = element.arguments.filter(
                a => a.type === 'ArrayExpression'
            );

            if (arrays && arrays.length) {
                const subParts = arrays.reduce((all, current) => {
                    console.log(current.elements);
                    return all.concat(...parseCollection(current.elements));
                }, []);
                foundParts.push(part, ...subParts);
                continue;
            }

            const subParts = element.arguments.reduce((all, prop) => {
                if (prop.type === 'TaggedTemplateExpression') {
                    return all.concat({
                        type: 'tag',
                        identifier: prop.tag.name
                    });
                }
                return all;
            }, []);
            foundParts.push(...subParts);
        } else if (element.type === 'ObjectExpression') {
            if (lastPart) {
                lastPart.outputs = element.properties.map(
                    prop => prop.key.name
                );
            }

            const subParts = element.properties.reduce((all, prop) => {
                if (prop.value.type === 'Identifier') {
                    return all.concat({
                        type: 'chain',
                        identifier: prop.value.name
                    });
                }
                return all.concat(parseCollection([prop.value]));
            }, []);
            foundParts.push(...subParts);

            continue;
        } else if (element.type === 'Identifier') {
            part.type = 'action';
            part.identifier = element.name;
        } else if (element.type === 'SpreadElement') {
            if (element.argument.type === 'CallExpression') {
                part.identifier = element.argument.callee.name;
                part.type = 'chainFactory';

                foundParts.push(part);
                element.argument.arguments.map(item => {
                    const subParts = parseCollection(item.elements);
                    foundParts.push(...subParts);
                });

                continue;
            } else {
                part.type = 'chain';
                part.identifier = element.argument.name;
            }
        } else if (element.type === 'ObjectProperty') {
            if (element.value.type === 'ObjectExpression') {
                const chainProp = element.value.properties.find(
                    item => item.key.name === 'chain'
                );
                if (!chainProp) {
                    continue;
                }
                if (chainProp.value.name) {
                    part.type = 'chain';
                    part.identifier = chainProp.value.name;
                } else if (chainProp.value.elements) {
                    const subParts = parseCollection(chainProp.value.elements);
                    foundParts.push(...subParts);
                    continue;
                }
            } else {
                if (!element.value.name) {
                    continue;
                }
                part.type = 'chain_signal';
                part.identifier = element.value.name;
            }
        } else if (element.type === 'ArrayExpression') {
            const subParts = parseCollection(element.elements);
            foundParts.push(...subParts);
            continue;
        } else {
            console.log('Unknown element', element);
            continue;
        }

        foundParts.push(part);
        lastPart = part;
    }

    return foundParts;
}
