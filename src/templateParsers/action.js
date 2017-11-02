export default (action, template) => {
    const args = action.outputs
        ? ['props', 'state', 'path']
        : ['props', 'state'];
    const info = action.outputs
        ? `// you should implement these output paths: ${action.outputs.join(
              ', '
          )}\n  `
        : '';

    let content = template
        .replace(/\{IDENTIFIER\}/g, action.identifier)
        .replace(/\{ARGUMENTS\}/g, args.join(', '))
        .replace(/\{INFO\}/g, info)
        .replace(/\{ASYNC\}/g, action.async ? 'async ' : '');

    return content;
};
