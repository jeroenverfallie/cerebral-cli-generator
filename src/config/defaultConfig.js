import * as defaultTemplates from './defaultTemplates.js';

export default {
    style: {
        imports: {
            semiColon: true,
            sortAll: true, // If enabled, existing imports will be managed, sorted too
            sortBy: 'type', // Sort imports by 'type' or 'appearance'
            separateGroups: 'all', // If sorted by type, separate the groups by an empty line, ['all', 'local', 'none']
            extension: false // add extension to the path
        },
        indentation: '    ', // Define the indentation to use in the templates.
        indentationPrefersEditorConfig: true
    },
    specialImports: [
        {
            keys: [
                'debounce',
                'when',
                'wait',
                'equals',
                'concat',
                'increment',
                'merge',
                'pop',
                'push',
                'set',
                'shift',
                'splice',
                'toggle',
                'unset',
                'unshift'
            ],
            importPath: 'cerebral/operators/{KEY}'
        },
        {
            keys: ['state', 'props'],
            importPath: 'cerebral/tags/{KEY}'
        }
    ],
    legacy: {
        signalFiles: true
    },
    templates: {
        chain: defaultTemplates.chain,
        action: defaultTemplates.action,
        actionFactory: defaultTemplates.factory,
        chainFactory: defaultTemplates.factory,
        signal: defaultTemplates.signal
    },
    paths: {
        actionFactory: 'actionFactories',
        chainFactory: 'chainFactories',
        chain: 'chains',
        action: 'actions',
        signal: 'signals',
        tag: 'tags'
    },
    extension: '.js'
};
