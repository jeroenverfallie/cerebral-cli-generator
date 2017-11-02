import showError from '../actions/showError.js';

export default () => ({
    signals: {
        messagesOpened: {
            chain: [
                set(state`mailbox.isLoading`, true),
                fetchMessagesAsync,
                {
                    success: [set(state`mailbox.messages`, props`messages`)],
                    error: [showError]
                },
                unset(state`mailbox.isLoading`)
            ]
        },
        messageOpened
    }
});
