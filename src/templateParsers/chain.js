export default (chain, template) => {
    const content = template.replace(/\{IDENTIFIER\}/g, chain.identifier);

    return content;
};
