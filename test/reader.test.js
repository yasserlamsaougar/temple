import reader from '../src/reader'
import { cpus } from 'os';

test('exists must return true if the file exists', () => {
    const pathToYaml = 'test/res/test_1.yaml'
    expect(reader.exists(pathToYaml)).toBeTruthy()
})

test('exists must return false if the file exists', () => {
    const pathToYaml = 'test/res/test_absent.yaml'
    expect(reader.exists(pathToYaml)).toBeFalsy()
})

test('read file must return file contents', () => {
    const pathToYaml = 'test/res/test_2.yaml'
    expect(reader.readFile(pathToYaml)).toEqual('{"a": "2"**}')
})

test('read file must throw error if the file doesn\'t exist', () => {
    const somePath = 'where_am_i'
    expect(() => reader.readFile(somePath)).toThrow()
})

test('reading many files at the same time', () => {
    const files = ['test/res/test_2.yaml', 'test/res/test_2.yaml', 'test/res/test_4.yaml']
    return reader.loadFiles(files).then(fileContents => {
        return expect(fileContents).toEqual({
            'test/res/test_2.yaml': '{"a": "2"**}',
            'test/res/test_4.yaml': '"test4"'
        })
    })
})