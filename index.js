/* globals require, __dirname, process */

module.exports = (function () {

    'use strict';

    const path = require('path');
    const builder = require("./src/main/builder.js");
    const platformsConfig = path.join(__dirname, './platforms.json');

    process.on('unhandledRejection', error => {
        throw error;
    });

    let compile = function (path, logPath, domainBlacklistFile, platformsPath) {
        return builder.build(path, logPath, domainBlacklistFile, platformsPath, platformsConfig);
    };

    return {
        compile: compile
    };
})();