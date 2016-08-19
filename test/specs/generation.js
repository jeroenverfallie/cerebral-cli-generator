import path from 'path';
import {expect} from 'chai';
import fs from 'fs';
import mock from 'mock-fs';
import mockFsHelper from '../helpers/mock-fs-helper.js';

import * as generation from '../../src/index.js';

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

describe('Config files', () => {
    beforeEach(function() {
        const testCase = mockFsHelper.duplicateFSInMemory(path.join(__dirname, '../resources/testcase/generation'));
        mock(testCase);
    });

    afterEach(mock.restore);

    it('should work on controller files', () => {
        generation.performOnFile({
            filePath: './controller.js',
            write: true,
        });

        expect(fileExists('chains/messageOpened.js')).to.be.true;
        expect(fileExists('actions/fetchMessagesAsync.js')).to.be.true;
        expect(fileExists('actions/showError.js')).to.be.false;
        expect(fileExists('actionFactories/set.js')).to.be.false;
        expect(fileExists('actionFactories/copy.js')).to.be.false;
        expect(fileExists('actionFactories/unset.js')).to.be.false;
    });

    it('should work on module files', () => {
        generation.performOnFile({
            filePath: './modules/mailbox/index.js',
            write: true,
        });

        expect(fileExists('./modules/mailbox/chains/messageOpened.js')).to.be.true;
    });

    it('should work on signal/chain files', () => {
        generation.performOnFile({
            filePath: './modules/mailbox/chains/mailboxOpened.js',
            write: true,
        });

        expect(fileExists('./modules/mailbox/actions/fetchMessagesAsync.js')).to.be.true;
    });

    it('should work on signalsDeclaration files', () => {
        generation.performOnFile({
            filePath: './modules/mailbox/signals.js',
            write: true,
        });

        expect(fileExists('./modules/mailbox/chains/messagesOpened.js')).to.be.true;
    });

    it('should work on other files', () => {
        generation.performOnFile({
            filePath: './modules/mailbox/broken.js',
            write: true,
        });

        expect(fileExists('./modules/mailbox/chains/messagesOpened.js')).to.be.false;
    });
});
