const yargs = require('yargs/yargs')
const Parser = require('./Parser')
const Code = require('./Code')


async function main() {
  const argv = yargs(process.argv.slice(2))
    .check((a: any) => {
      const filePath = a._
      if (filePath.length > 1) throw new Error('Only 0 or 1 files may be passed.');
      else return true
    }).argv
  const path = argv._

  new Parser(path[0])
}

main()

