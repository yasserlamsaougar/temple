import _ from 'lodash'
import errors from 'common-errors'
import replacer from '../src/replacer'

test('should be able to load a yaml into a plain js object', () => {
    const pathToYaml = 'test/res/test_1.yaml'
    expect(replacer.loadYaml(pathToYaml)).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: {
            a: {
                c: 3
            }
        }
    })
})
test('should throw exception when file path is wrong', () => {
    expect(() => replacer.loadYaml('')).toThrow(errors.io.FileNotFoundError)
})

test('should throw exception when yaml file is not yaml', () => {
    const pathToYaml = 'test/res/test_2.yaml'
    expect(() => replacer.loadYaml(pathToYaml)).toThrow(errors.io.FileLoadError)
})

test('flatten map', () => {
    const map = {
        a: {
            b: 1,
            c: 2,
            d: 3,
            v: {
                a: 3,
                b: [1, 2, 3],
                q: {}
            }
        }
    }
    expect(replacer.flattenMap(map)).toEqual({
        "a.b": 1,
        "a.c": 2,
        "a.d": 3,
        "a.v.a": 3,
        "a.v.b.0": 1,
        "a.v.b.1": 2,
        "a.v.b.2": 3,
    })
})

test('inverting the flat map', () => {
    const map = {
        "a.b": 3,
        "q.c": true,
        "a.m": "value",
        "a.s": "value"
    }
    expect(replacer.invertMap(map)).toEqual({
        3: ["a.b"],
        true: ["q.c"],
        "value": ["a.m", "a.s"]
    })
})

test('generating replacement regexps', () => {
    const map = {
        3: ["a.b"],
        true: ["q.c"],
        "value": ["a.m", "a.s"]
    }
    expect(replacer.generateRegexsFromReverseIndex(map)).toEqual({
        from: [/3/g, /true/g, /value/g],
        to: ['{{a.b}}', '{{q.c}}', '{{a.m||a.s}}']
    })
})

test('replacing in file', () => {
    const pathToText = 'test/res/some_files/text_1.html'
    const map = {
        from: [/3/g, /true/g, /value/g, /DeviceValue/g],
        to: ['{{a.b}}', '{{q.c}}', '{{a.m||a.s}}', '{{a.s.m.l}}']
    }
    expect(replacer.replaceInFiles([pathToText], map.from, map.to, {dry: true, verbose: true})).toEqual([
        'test/res/some_files/text_1.html'
    ])
})