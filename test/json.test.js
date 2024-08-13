const
    expect                          = require('expect'),
    {describe, test, before, after} = require('mocha'),
    json                            = require('../src/json.js'),
    fs                              = require('node:fs/promises');

describe('fua.module.json', function () {

    test('develop', function () {
        console.log(json);
    })

    describe('handle json files', function () {

        before('setup', async function () {
            await fs.mkdir('temp', {recursive: true})
        })

        after('teardown', async function () {
            await fs.rm('temp', {recursive: true, force: true})
        })

        test('read a json file', async function () {
            const filePath  = 'temp/hello.json'
            const jsonValue = {hello: 'world'}
            await fs.writeFile(filePath, JSON.stringify(jsonValue))
            await expect(fs.access(filePath)).resolves.not.toThrow()
            const jsonResult = await json.readJSON(filePath)
            console.log(jsonResult)
            expect(jsonResult).toEqual(jsonValue)
            expect(jsonResult).not.toBe(jsonValue)
            await fs.rm(filePath)
        })

        test('write a json file', async function () {
            const filePath  = 'temp/lorem.json'
            const jsonValue = {lorem: 'ipsum'}
            await json.writeJSON(filePath, jsonValue)
            await expect(fs.access(filePath)).resolves.not.toThrow()
            const jsonResult = JSON.parse(await fs.readFile(filePath, 'utf-8'))
            console.log(jsonResult)
            expect(jsonResult).toEqual(jsonValue)
            expect(jsonResult).not.toBe(jsonValue)
            await fs.rm(filePath)
        })

    })

});
