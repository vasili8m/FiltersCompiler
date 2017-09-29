/* globals require, QUnit, __dirname */

QUnit.test("Test builder", function (assert) {
    'use strict';

    var path = require('path');
    var fs = require('fs');

    var readFile = function (path) {
        try {
            return fs.readFileSync(path, {encoding: 'utf-8'});
        } catch (e) {
            return null;
        }
    };

    var builder = require("../src/compiler/builder.js");
    assert.ok(builder);

    var filtersDir = path.join(__dirname, './resources/filters');
    builder.build(filtersDir);

    var revision = readFile(path.join(filtersDir, 'filter_2_English', 'revision.json'));
    assert.ok(revision);
    //
    revision = JSON.parse(revision);
    assert.ok(revision.version);
    assert.ok(revision.timeUpdated);

    var filterText = readFile(path.join(filtersDir, 'filter_2_English', 'filter.txt'));
    assert.ok(filterText);

    var filterLines = filterText.split('\r\n');
    assert.equal(filterLines.length, 24);

    //TODO: Check header

    //Common include
    assert.ok(filterLines.indexOf('! some common rules could be places here') >= 0);
    assert.ok(filterLines.indexOf('test-common-rule.com') >= 0);
    assert.ok(filterLines.indexOf('test-common-rule.com$special_exc') >= 0);
    assert.ok(filterLines.indexOf('example.com#$#h1 { background-color: blue !important }') >= 0);

    //Common_1 include
    assert.ok(filterLines.indexOf('test-common-1-rule.com') >= 0);
    //Exclude_1
    assert.notOk(filterLines.indexOf('test-common-1-rule.com$special_exc') >= 0);
    //Strip comments
    assert.notOk(filterLines.indexOf('! some common rules could be places here, but comment are stripped') >= 0);

    //Exclude
    assert.ok(filterLines.indexOf('||test.com^') >= 0);
    assert.notOk(filterLines.indexOf('#%#test.com^$third-party') >= 0);
    assert.notOk(filterLines.indexOf('||test.com^$third-party') >= 0);
    assert.notOk(filterLines.indexOf('||test.com^$replace=') >= 0);
});
