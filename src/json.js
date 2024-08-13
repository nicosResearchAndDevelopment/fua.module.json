const
    json    = exports,
    assert  = require('@nrd/fua.core.assert'),
    is      = require('@nrd/fua.core.is'),
    objects = require('@nrd/fua.core.objects'),
    fs      = require('node:fs/promises');

/**
 * @param {string} filePath
 * @param {{
 *     encoding?: BufferEncoding,
 *     reviver?: (key: string, value: any) => any
 * } | BufferEncoding} [options]
 * @returns {Promise<any>}
 */
json.readJSON = async function (filePath, options) {
    assert.string(filePath)
    /** @type {BufferEncoding} */
    const encoding = is.string(options) ? options : options?.encoding ?? 'utf-8'
    assert(Buffer.isEncoding(encoding), 'invalid encoding')
    const reviver = options?.reviver ?? undefined
    const jsonStr = await fs.readFile(filePath, encoding)
    return JSON.parse(jsonStr, reviver)
}

/**
 * @param {string} filePath
 * @param {any} data
 * @param {{
 *     encoding?: BufferEncoding,
 *     replacer?: (key: string, value: any) => any,
 *     space?: string | number
 * } | BufferEncoding} [options]
 * @returns {Promise<void>}
 */
json.writeJSON = async function (filePath, data, options) {
    assert.string(filePath)
    /** @type {BufferEncoding} */
    const encoding = is.string(options) ? options : options?.encoding ?? 'utf-8'
    assert(Buffer.isEncoding(encoding), 'invalid encoding')
    const replacer = options?.replacer ?? undefined
    const space    = options?.space ?? undefined
    const jsonStr  = JSON.stringify(data, replacer, space)
    await fs.writeFile(filePath, jsonStr, encoding)
}

objects.freeze.recursive(json)
module.exports = json
