import path from 'path';
import {expect} from 'chai';
import mock from 'mock-fs';
import mockFsHelper from '../helpers/mock-fs-helper.js';

import * as configHelpers from '../../src/helpers/config.js';

describe('Config files', () => {
    it('Should merge configs properly', () => {
        const config = configHelpers.getConfig('controller.js');
        console.log(config);
    });

    beforeEach(function() {
        const testCase = mockFsHelper.duplicateFSInMemory(path.join(__dirname, '../resources/testcase-1'));
        mock(testCase);
    });

    afterEach(mock.restore);
});
