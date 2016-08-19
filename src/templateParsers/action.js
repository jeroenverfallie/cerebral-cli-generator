export default (action, template) => {
    const args = action.outputs ? ['input', 'state', 'output'] : ['input', 'state'];
    const outputs = action.outputs ? action.identifier + '.outputs = [\'' + action.outputs.join('\', \'') + '\'];\n' : '';
    const async = action.async ? action.identifier + '.async = true;\n' : '';

    let content = template
        .replace(/\{IDENTIFIER\}/g, action.identifier)
        .replace(/\{ARGUMENTS\}/g, args.join(', '))
        .replace(/\{OUTPUTS\}/g, outputs)
        .replace(/\{ASYNC\}/g, async);

    return content;
};
