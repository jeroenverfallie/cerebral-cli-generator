export default (signal, template) => {
    const content = template.replace(/\{IDENTIFIER\}/g, signal.identifier);

    return template;
};
