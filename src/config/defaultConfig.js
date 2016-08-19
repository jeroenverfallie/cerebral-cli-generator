import * as defaultTemplates from './defaultTemplates.js';


export default {
    style: {
        imports: {
            semiColon: true,
            sortAll: true, // If enabled, existing imports will be managed, sorted too
            sortBy: 'type', // Sort imports by 'type' or 'appearance'
            separateGroups: 'all' // If sorted by type, separate the groups by an empty line, ['all', 'local', 'none']
        },
        indentation: '    ', // Define the indentation to use in the templates.
        indentationPrefersEditorConfig: true
    },
    specialImports: [
        {
            keys: ['set', 'unset', 'toggle', 'throttle', 'debounce', 'delay', 'when'],
            importPath: 'cerebral/operators/{KEY}'
        }
    ],
    legacy: {
        signalFiles: false
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
        signal: 'signals'
    }
};
