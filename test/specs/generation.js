import path from 'path';
import {expect} from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import mock from 'mock-fs';
import mockFsHelper from '../helpers/mock-fs-helper.js';

import * as generation from '../../src/index.js';

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

function getFileContent(filePath) {
    return fs.readFileSync(filePath, {encoding: 'utf8'});
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
        expect(fileExists('./modules/mailbox/chains/sampleChain.js')).to.be.true;
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

    it('shouldnt work on other files', () => {
        const brokenResult = generation.performOnFile({
            filePath: './modules/mailbox/broken.js',
            write: true,
        });

        expect(brokenResult).to.be.false;
        expect(fileExists('./modules/mailbox/chains/messagesOpened.js')).to.be.false;

        const emptyResult = generation.performOnFile({
            filePath: './modules/mailbox/empty.js',
            write: true,
        });

        expect(emptyResult).to.be.false;

        generation.performOnFile({
            filePath: './modules/mailbox/empty.js',
            logger: {log() {}}
        });
        generation.performOnFile({
            filePath: './modules/mailbox/empty.js',
            config: {}
        });
    });

    it('should use the provided logger', () => {
        const log = sinon.spy();
        const result = generation.performOnFile({
            filePath: './modules/mailbox/chains/mailboxOpened.js',
            write: true,
            logger: {
                log
            }
        });

        expect(log.called).to.be.true;
    })

    it('should not modify the file if write is off', () => {
        const result = generation.performOnFile({
            filePath: './modules/mailbox/chains/mailboxOpened.js',
            write: false,
        });

        expect(getFileContent('./modules/mailbox/chains/mailboxOpened.js')).to.not.equal(result.content);
    });


    it('should work on extreme stuff', () => {
        generation.performOnFile({
            filePath: './complicated/chains/complicatedChain.js',
            write: true,
        });


        expect(fileExists('./complicated/actions/outputSelectedActivity.js')).to.be.true
        expect(fileExists('./complicated/actions/outputSelectedActivitySubCategory.js')).to.be.true
        expect(fileExists('./complicated/chainFactories/getProfileLoggedActivitiesForSpecifiedDay.js')).to.be.true
        expect(fileExists('./complicated/chainFactories/toggleLoggedActivity.js')).to.be.true
        expect(fileExists('./complicated/actions/outputPointsAndCo2Modifiers.js')).to.be.true
        expect(fileExists('./complicated/chainFactories/updateProfile.js')).to.be.true
        expect(fileExists('./complicated/chainFactories/getProfileChallenges.js')).to.be.true
        expect(fileExists('./complicated/actions/outputActiveChallenges.js')).to.be.true
        expect(fileExists('./complicated/chainFactories/updateChallengesPointsAndCo2.js')).to.be.true
        expect(fileExists('./complicated/chains/updateChallengesAveragePoints.js')).to.be.true
        expect(fileExists('./complicated/chains/updateChallengesLeaderboard.js')).to.be.true
        expect(fileExists('./complicated/actions/resolveTask.js')).to.be.true
        expect(fileExists('./complicated/actions/fetchSomethingAsync.js')).to.be.true
        expect(fileExists('./complicated/actionFactories/doSomething.js')).to.be.true
        expect(fileExists('./complicated/chains/failChain.js')).to.be.true
    });
});
