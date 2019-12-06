var path = require('path');
var locateRootFolder = require('../locateRootFolder');

describe('locateRootFolder', () => {
    test('should correctly resolve the node_modules for gitbook', () => {
        expect(locateRootFolder()).toBe(
            path.resolve(__dirname, '../../../')
        );
    });
});
