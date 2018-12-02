// @flow
import yaml from 'js-yaml';
import errors from 'common-errors'
import regexgen from 'regexgen'
import replace from 'replace-in-file'
import * as _ from 'lodash'
import reader from './reader'
const yamlOptions = {
    json: true
}
export default {
    /**
     * @param {string} filePath
     * @throws {errors.io.FileNotFoundError} Error when the path is wrong
     * @throws {errors.io.FileLoadError} Error when the path is wrong 
     * @returns the file content as js object
     */
    loadYaml(filePath: string = ''): any {
        if(!reader.exists(filePath)) {
            throw new errors.io.FileNotFoundError(`The path to the file '${filePath}' is wrong`);
        }
        try {
            const fileContent = reader.readFile(filePath);
            return yaml.safeLoad(fileContent);
        }
        catch(error) {
            throw errors.io.FileLoadError(`the file ${filePath} is not well formatted or corrupted ${error}`);
        }
    },
    /**
     * tries to flatten if it's a map otherwise nothing
     * @param {any} map or anything really
     * @returns {any} a reverse map if possible 
     */
    flattenMap(map: any): any {
        return flattenMapRec(map, {});
    },
    
    invertMap(map: Object): Object {
        return _.invertBy(map)
    },
    generateRegexsFromReverseIndex(reverseIndex: any) : any {
        return _.reduce(reverseIndex, (acc, value, key) => {
            acc.from.push(regexgen([key], 'g'));
            acc.to.push('{{' + value.join('||') + '}}')
            return acc
        }, {
            from: [],
            to: []
        });
    },
    replaceInFiles(files: Array<string>, from: Array<any>, to: Array<string>, options: any = {}): Array<string> {
        const allOptions = _.merge({
            files,
            from,
            to
        }, options);
        return replace.sync(allOptions);
    }
}

function flattenMapRec(mapOrArray: any, result: any) : any {
    if(_.isObject(mapOrArray) && !_.isEmpty(mapOrArray)) {
        const complexObjects = _.reduce(mapOrArray, (acc, value, key) => {
            if(_.isObject(value)) {
                _.forEach(value, (childValue, childKey) => {
                    const newKey = [key.toString(), childKey.toString()].filter(e => e.length > 0).join('.');
                    acc[newKey] = childValue;
                })
            }
            else {
                result[key] = value;
            }
            return acc;
        }, {});

        return flattenMapRec(complexObjects, result);
    }
    return result;
}
