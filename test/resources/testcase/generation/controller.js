import showError from '../actions/showError.js';

controller.addSignals({
    messagesOpened: {
        chain: [
            set('state:mailbox.isLoading', true),
            fetchMessagesAsync, {
                success: [
                    copy('input:messages', 'state:mailbox.messages')
                ],
                error: [
                    showError
                ]
            },
            unset('state:mailbox.isLoading')
        ]
    },
    messageOpened
})
