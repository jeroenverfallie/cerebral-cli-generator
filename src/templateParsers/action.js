export default (action, template) => {
    const args = action.outputs
        ? ['props', 'state', 'path']
        : ['props', 'state'];

    let content = template
        .replace(/\{IDENTIFIER\}/g, action.identifier)
        .replace(/\{ARGUMENTS\}/g, args.join(', '))
        .replace(/\{ASYNC\}/g, action.async ? 'async ' : '');

    return content;
};
