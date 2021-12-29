// Copyright (c) Wictor Wilén. All rights reserved.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

const gulp = require("gulp");
const pkg = require("./package.json");
const argv = require("yargs").argv;
const log = require("fancy-log");
const path = require("path");
const dotenvExpand = require("dotenv-expand");

const config = {
    staticFiles: "./src/public/**/*.*"
};

// Set environment variables
const env = argv.env;
let dotenv;
if (env === undefined) {
    dotenv = require("dotenv").config();
} else {
    log(`Using custom .env: ${env}`);
    dotenv = require("dotenv").config({ path: path.resolve(process.cwd(), env) });
}
dotenvExpand(dotenv);
process.env.VERSION = pkg.version;

const core = require("yoteams-build-core");

// Initialize core build
core.setup(gulp, config);

// Add your custom or override tasks below
