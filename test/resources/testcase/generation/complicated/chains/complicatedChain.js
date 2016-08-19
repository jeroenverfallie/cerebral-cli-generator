export default [
    outputSelectedActivity,
    outputSelectedActivitySubCategory,
    ...getProfileLoggedActivitiesForSpecifiedDay([
        ...toggleLoggedActivity([
            outputPointsAndCo2Modifiers,
            ...updateProfile([
                ...getProfileChallenges([
                    outputActiveChallenges,
                    ...updateChallengesPointsAndCo2([
                        [
                            ...updateChallengesAveragePoints,
                            ...updateChallengesLeaderboard
                        ],
                        resolveTask
                    ])
                ])
            ])
        ])
    ]),
    fetchSomethingAsync, {
        success: [
            doSomething('with a factory')
        ],
        fail: [...failChain]
    }
];
