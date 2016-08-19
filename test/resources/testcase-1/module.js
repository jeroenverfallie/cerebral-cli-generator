export default (module) => {
    module.addSignals({
        menuOpened,
        userAuthenticated: {
            chain: [
                someAction,
                anActionFactory(),
                ...aSimpleChain
            ]
        }
    });
};
