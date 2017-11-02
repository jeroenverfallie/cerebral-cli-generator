export default () => {
    return module => ({
        signals: {
            messageOpened,
            somethingElse: {
                chain: sampleChain
            }
        }
    });
};
