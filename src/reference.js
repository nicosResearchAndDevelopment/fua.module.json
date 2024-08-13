const
    reference = exports,
    pointer   = require('./pointer.js'),
    assert    = require('@nrd/fua.core.assert'),
    is        = require('@nrd/fua.core.is'),
    objects   = require('@nrd/fua.core.objects'),
    path      = require('node:path'),
    {URL}     = require('node:url');

/** @typedef {({
 *     srcType: 'local'
 * } | {
 *     srcType: 'file',
 *     filePath: string
 * } | {
 *     srcType: 'url',
 *     location: URL
 * }) & ({
 *     refType: 'pointer',
 *     tokens: TokenArray
 * } | {
 *     refType: 'identifier',
 *     id: string
 * })} Reference */

/**
 * @param {string} refStr
 * @param {string} [srcFile]
 * @returns {Reference}
 */
reference.parseReference = function (refStr, srcFile) {
    assert.string(refStr, /^[^#]*#[^#]+$/)
    const [srcPart, refPart] = refStr.split('#')
    const refResult          = {}
    if (/^https?:\/\//.test(srcPart)) {
        refResult.srcType  = 'url'
        refResult.location = new URL(srcPart)
    } else if (srcPart.length > 0) {
        refResult.srcType = 'file'
        if (path.isAbsolute(srcPart)) {
            refResult.filePath = path.normalize(srcPart).replace(/\\/g, '/')
        } else {
            assert(is.string(srcFile), 'missing srcFile')
            assert(path.isAbsolute(srcFile), 'invalid srcFile')
            refResult.filePath = path.join(path.dirname(srcFile), srcPart).replace(/\\/g, '/')
        }
    } else {
        refResult.srcType = 'local'
    }
    if (refPart.startsWith('/')) {
        refResult.refType = 'pointer'
        refResult.tokens  = pointer.parseTokens(refPart)
    } else {
        refResult.refType = 'identifier'
        refResult.id      = '#' + refPart
    }
    return refResult
}

/**
 * @param {Reference} refObj
 * @param {string} [srcFile]
 * @returns {string}
 */
reference.stringifyReference = function (refObj, srcFile) {
    assert.object(refObj, {srcType: is.string, refType: is.string})
    let srcPart              = '', refPart = ''
    const {srcType, refType} = refObj
    if (srcType === 'url') {
        srcPart = '' + refObj.location
    } else if (srcType === 'file') {
        if (is.defined(srcFile)) {
            assert(is.string(srcFile) && path.isAbsolute(srcFile), 'invalid srcFile')
            srcPart = path.relative(path.dirname(srcFile), refObj.filePath).replace(/\\/g, '/')
        } else {
            srcPart = path.normalize(refObj.filePath).replace(/\\/g, '/')
        }
    } else if (srcType === 'local') {
        srcPart = ''
    }
    if (refType === 'pointer') {
        refPart = pointer.stringifyTokens(refObj.tokens)
    } else if (refType === 'identifier') {
        refPart = refObj.id.replace('#', '')
    }
    return srcPart + '#' + refPart
}

objects.freeze(reference)
module.exports = reference
