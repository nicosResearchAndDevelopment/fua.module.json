const
    expect                          = require('expect'),
    {describe, test, before, after} = require('mocha'),
    pointer                         = require('../src/pointer.js');

describe('fua.module.json/pointer', function () {

    test('stringify empty token array', function () {
        expect(pointer.stringifyTokens([])).toBe('/')
    })

    test('stringify token array with regular characters', function () {
        expect(pointer.stringifyTokens(['hello', 'world'])).toBe('/hello/world')
    })

    test('stringify token array with / and ~ characters', function () {
        expect(pointer.stringifyTokens(['/lorem~~', '/~ipsum//'])).toBe('/~1lorem~0~0/~1~0ipsum~1~1')
    })

    test('reject stringify if array contains non-strings', function () {
        expect(() => pointer.stringifyTokens([123])).toThrow()
        expect(() => pointer.stringifyTokens([undefined])).toThrow()
    })

    test('parse empty pointer to empty token array', function () {
        expect(pointer.parseTokens('')).toEqual([])
    })

    test('parse root pointer to array with empty string', function () {
        expect(pointer.parseTokens('/')).toEqual([''])
    })

    test('parse pointer with regular characters to token array', function () {
        expect(pointer.parseTokens('/lorem/ipsum')).toEqual(['lorem', 'ipsum'])
    })

    test('parse pointer with ~0 and ~1 characters to token array', function () {
        expect(pointer.parseTokens('/~1hello~0~0/~1~0world~1~1')).toEqual(['/hello~~', '/~world//'])
    })

    test('reject parse pointer if value is not a string', function () {
        expect(() => pointer.parseTokens(123)).toThrow()
        expect(() => pointer.parseTokens(['test'])).toThrow()
    })

    test('reject parse pointer if value is malformed', function () {
        expect(() => pointer.parseTokens('/~/1')).toThrow()
        expect(() => pointer.parseTokens('/~2')).toThrow()
    })

});
