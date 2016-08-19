export default (module) => {
    module.addSignals({
        messageOpened,
        somethingElse: {
            chain: sampleChain
        }
    });
};
