export default function() {
    return function(module) {
        return {
            signals: {
                messageOpened,
                somethingElse: {
                    chain: sampleChain
                }
            }
        };
    };
}
