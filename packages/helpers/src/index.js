'use strict';

const frontCommentsParse = require('./front-comments-parse');
const markdownParse = require('./markdown-parse');
const helpers = require('./helpers');

module.exports = Object.assign({}, helpers, {
    markdownParse,
    frontCommentsParse,
});
