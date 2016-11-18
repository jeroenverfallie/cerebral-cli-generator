export default () => {
    return (module) => {
        module.addSignals({
            messageOpened,
            somethingElse: {
                chain: sampleChain
            }
        });
    };
};
