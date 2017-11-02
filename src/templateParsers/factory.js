export default (fac, template) => {
    const args = fac.outputs ? ['props', 'state', 'path'] : ['props', 'state'];
    const factoryArgs = fac.argumentCount
        ? new Array(fac.argumentCount)
              .join(',')
              .split(',')
              .map((item, i) => 'arg' + (i + 1))
        : [];

    let content = template
        .replace(/\{IDENTIFIER\}/g, fac.identifier)
        .replace(/\{FACTORYARGUMENTS\}/g, factoryArgs.join(', '))
        .replace(/\{ARGUMENTS\}/g, args.join(', '))
        .replace(/\{ASYNC\}/g, fac.async ? 'async ' : '');

    return content;
};
