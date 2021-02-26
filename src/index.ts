const yargs = require('yargs/yargs')
const Parser = require('./Parser')
const Code = require('./Code')

const argv = yargs(process.argv.slice(2))
  .check((a: any) => {
    if (a._.length > 1) throw new Error('Only 0 or 1 files may be passed.');
    return true
  }).argv

new Parser(argv._[0])
