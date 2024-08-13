const
    json    = exports,
    assert  = require('@nrd/fua.core.assert'),
    objects = require('@nrd/fua.core.objects'),
    fs      = require('node:fs/promises');

/**
 * @param {string} filePath
 * @param {{
 *     encoding?: BufferEncoding,
 *     reviver?: (key: string, value: any) => any
 * }} [options]
 * @returns {Promise<any>}
 */
json.readJSON = async function (filePath, options) {
    assert.string(filePath)
    const encoding = options?.encoding ?? 'utf-8'
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
 * }} [options]
 * @returns {Promise<void>}
 */
json.writeJSON = async function (filePath, data, options) {
    assert.string(filePath)
    const encoding = options?.encoding ?? 'utf-8'
    assert(Buffer.isEncoding(encoding), 'invalid encoding')
    const replacer = options?.replacer ?? undefined
    const space    = options?.space ?? 2
    const jsonStr  = JSON.stringify(data, replacer, space)
    await fs.writeFile(filePath, jsonStr, encoding)
}

/**
 * @param {string} fileUrl
 * @param {{
 *     method?: string,
 *     headers?: Record<string, string>,
 *     reviver?: (key: string, value: any) => any
 * }} [options]
 * @returns {Promise<any>}
 */
json.fetchJSON = async function (fileUrl, options) {
    assert.string(fileUrl)
    const method   = options?.method ?? 'GET'
    const headers  = {
        'Accept': 'application/json',
        ...options?.headers
    }
    const reviver  = options?.reviver ?? undefined
    const response = await fetch(fileUrl, {method, headers})
    const jsonStr  = await response.text()
    return JSON.parse(jsonStr, reviver)
}

objects.lock(json)
module.exports = json
