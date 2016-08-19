controller.addSignals({
    menuOpened,
    userAuthenticated: {
        chain: [
            someAction,
            anActionFactory(),
            ...aSimpleChain
        ]
    }
});
