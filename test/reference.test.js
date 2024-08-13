const
    expect                          = require('expect'),
    {describe, test, before, after} = require('mocha'),
    reference                       = require('../src/reference.js');

describe('fua.module.json/reference', function () {

    test('develop', function () {
        const refStr  = '../data#/def/test'
        const srcFile = __filename
        const refObj  = reference.parseReference(refStr, srcFile)
        console.log('parsed:', refObj)
        const refVal = reference.stringifyReference(refObj, srcFile)
        console.log('serialized:', refVal)
        expect(refVal).toBe(refStr)
    })

});
