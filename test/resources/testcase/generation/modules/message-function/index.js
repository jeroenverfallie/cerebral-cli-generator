export default function() {
    return function(module) {
        module.addSignals({
            messageOpened,
            somethingElse: {
                chain: sampleChain
            }
        });
    };
};
