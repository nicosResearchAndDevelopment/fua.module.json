const
    pointer = exports,
    assert  = require('@nrd/fua.core.assert'),
    is      = require('@nrd/fua.core.is'),
    objects = require('@nrd/fua.core.objects');

/** @typedef {Array<string>} TokenArray */

/**
 * @param {string} pointerStr
 * @returns {TokenArray}
 */
pointer.parseTokens = function (pointerStr) {
    assert.string(pointerStr, /^(?:\/(?:[\u{00}-\u{2E}\u{30}-\u{7D} \u{7F}-\u{10FFFF}]|~[01])*)*$/u)
    return pointerStr.split('/').slice(1)
        .map(token => token.replace(/~1/g, '/').replace(/~0/g, '~'))
}

/**
 * @param {TokenArray} tokens
 * @returns {string}
 */
pointer.stringifyTokens = function (tokens) {
    assert.array(tokens, is.string)
    return '/' + tokens.map(token => token.replace(/~/g, '~0').replace(/\//g, '~1')).join('/')
}

objects.freeze(pointer)
module.exports = pointer
