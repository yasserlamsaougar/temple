import JsDiff from 'diff'
import replacer from './replacer'

function main(args) {
    const yamlConfig = args.config
    const fileList = args.root
    const yamlMap = replacer.loadYaml(yamlConfig)
    const flatYamlMap = replacer.flattenMap(yamlMap)
    const invertFlatYamlMap = replacer.invertMap(flatYamlMap)
    const replacements = replacer.generateRegexsFromReverseIndex(invertFlatYamlMap)
    // dry run to get the changed files
    const fileChanged = replacer.replaceInFiles(fileList, replacements.from, replacements.to, {verbose: true, dry: true})
    // we load the changed files in one swoop
    const contents = {}
    const originalContents = replacer.loadFiles(fileChanged).then(values => {
        contents.original = values
        replacer.replaceInFiles(fileList, replacements.from, replacements.to, {verbose: false})
        return replacer.loadFiles(fileChanged)
    }).then(values => {
        contents.changed = values
        console.error(JsDiff.diffTrimmedLines(contents.original, contents.changed))
    })

}
()
main()