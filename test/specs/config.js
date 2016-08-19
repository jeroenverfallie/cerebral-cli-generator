import path from 'path';
import {expect} from 'chai';
import mock from 'mock-fs';
import mockFsHelper from '../helpers/mock-fs-helper.js';

import * as configHelpers from '../../src/helpers/config.js';

describe('Config files', () => {
    beforeEach(function() {
        const testCase = mockFsHelper.duplicateFSInMemory(path.join(__dirname, '../resources/testcase'));
        mock(testCase);
    });

    afterEach(mock.restore);

    it('should respect useRcFile option', () => {
        const config = configHelpers.getConfig('with-rc/controller.js', {useRcFile: false, style: {indentation: '   '}});
        expect(config.specialImportsMap).to.not.have.property('specialAction');
    });

    it('should respect editorConfig (space) when provided', () => {
        const config = configHelpers.getConfig('with-editorconfig-space/controller.js');
        expect(config.style.indentation).to.equal('      ');
    });

    it('should respect editorConfig (tab) when provided', () => {
        const config = configHelpers.getConfig('with-editorconfig-tab/controller.js');
        expect(config.style.indentation).to.equal('\t');
        expect(config.style.imports.semiColon).to.equal(false);
    });

    it('should merge configs properly with rc file', () => {
        const config = configHelpers.getConfig('with-rc/controller.js');

        expect(config.style.indentation).to.equal('  ');
        expect(config.specialImportsMap).to.have.property('specialAction', 'commons/actions/specialAction');
    });

    it('should merge configs properly without rc file', () => {
        const config = configHelpers.getConfig('without-rc/controller.js');

        expect(config.style.indentation).to.not.equal('  ');
        expect(config.specialImportsMap).to.not.have.property('specialAction');
    });

    it('should merge configs properly with a broken rc file', () => {
        const config = configHelpers.getConfig('with-broken-rc/controller.js');

        expect(config.style.indentation).to.not.equal('  ');
        expect(config.specialImportsMap).to.not.have.property('specialAction');
    });

    it('should merge configs properly with a broken specialImports', () => {
        const config = configHelpers.getConfig('without-rc/controller.js', {specialImports: 'test'});
        expect(config.specialImportsMap).to.not.have.property('specialAction');
    });

    it('should merge configs properly with a flat specialImports', () => {
        const config = configHelpers.getConfig('without-rc/controller.js', {specialImports: {map: 'commons/map'}});
        expect(config.specialImportsMap).to.have.property('map', 'commons/map');
    });

    it('should merge configs properly with an empty rc file', () => {
        const config = configHelpers.getConfig('with-empty-rc/controller.js');

        expect(config.style.indentation).to.not.equal('  ');
        expect(config.specialImportsMap).to.not.have.property('specialAction');
    });
});
