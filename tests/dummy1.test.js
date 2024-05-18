const listHelper = require('../utils/list_helper');
const {test, after} = require('node:test');
const assert = require('node:assert');
test('dummy returns one', () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
});
