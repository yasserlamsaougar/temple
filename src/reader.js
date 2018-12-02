// @flow
import fs from 'fs'
import * as _ from 'lodash'

export default {
    /**
     * checks if the file exists
     * @param {string} path 
     */
    exists(path: string) : boolean {
        return fs.existsSync(path)
    },
    readFile(path: string): string {
        return fs.readFileSync(path, {encoding: 'utf-8'})
    },
    /**
     * Load the contents of the given file paths 
     * @param {Array<string>} list of files paths
     * @returns {Promise<Array<String>>} The files contents promises
     */
    loadFiles(files: Array<string>) : Promise<{ [string]: string }> {
        const reducedFiles = _.reduce(files, (acc, path, index) => {
            if(!acc[path]) {
                acc[path] = readFile(path)
            }
            return acc
        }, {})
        return Promise.all(_.values(reducedFiles)).then(values => {
            _.forEach(values, (file => {
                reducedFiles[file.name] = file.contents
            }))
            return reducedFiles
        });
    }
}

async function readFile(file: string) : Promise<{name: string, contents: string}>{
    return new Promise((resolve, reject) => {
        fs.readFile(file, {encoding: 'utf-8'}, (err, contents: string) => {
            if(err) {
                reject(err)
            }
            else {
                resolve({
                    name: file,
                    contents
                })
            }
        });
    });
}