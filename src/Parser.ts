const fs = require('fs')
const path = require('path')
const SymbolTable = require('./SymbolTable')
const Code = require('./Code')

export type Maybe<T> = T | null | undefined

export type Command_Types =
  "A_COMMAND" |
  "C_COMMAND" |
  "L_COMMAND"
export type Jump_Mnemonic =
  "null"|
  "JGT"|
  "JEQ"|
  "JGE"|
  "JLT"|
  "JNE"|
  "JLE"|
  "JMP"|
  ""

export type ICommand = Array<{
  type: Command_Types,
  sentence: string,
}>

const re = {
  isComments: /(\/\/.*$)|\s+/gim,
  findDest: /([AMD|]{1,4}|null)(?=\=)/g,
  findComp: /(?<=\=)[AMD+01\-\|&!]{1,3}/g,
  findJump: /(?<=;)[(J)[GELNMQTP]{3}|(null)]$/g,
}

const rmUnusableStrings = (arr: Buffer): string[] => {

  const result = arr
      .toString('utf-8')
      .split('\r\n')
      // コメントと空白文字を削除
      .map(line => line.replace(re.isComments, ""))
      .filter(line => !!line)

  return result
}

const to16Bit = (n: number):string => n.toString(2).padStart(16, "0")

module.exports = class Parser {
  commands: ICommand = []

  constructor(filePath: string) {
    this.main(filePath)
  }

  main(filePath: string) {
    try {
      // パスからストリームを開く。
      const buffer = fs.readFileSync(path.resolve(filePath), 'utf-8')
      // バッファからコメントと空白を削除
      const file = [...rmUnusableStrings(buffer)]

      const table = new SymbolTable()
      const code = new Code()


      let romAddress = -1
      let ramAddress = 15

      const binary = file.map((sentence) => {
        const type = this.commandType(sentence)

        if (type === "L_COMMAND") {
          table.addEntry(this.symbol(sentence), romAddress+1)
        } else {
          romAddress+=1
        }

        const newCommand = {
          type,
          sentence,
        }

        return newCommand
      }).map(command => {
        const { sentence, type } = command

        if (type === "A_COMMAND") {
          const symbol = this.symbol(sentence)

          // isNumber
          if (!isNaN(parseInt(symbol)))
            return to16Bit(parseInt(symbol))

          else if (!table.contains(symbol))
            table.addEntry(symbol, ramAddress+=1)

          return to16Bit(table.getAddress(symbol))
        }
        if (type == "C_COMMAND") {
          return [
            '111',
            ...code.comp(this.comp(sentence)),
            ...code.dest(this.dest(sentence)),
            ...code.jump(this.jump(sentence))
          ].join('')
        }

        return null
      })

      const outFileName = filePath.replace(".asm", ".hack")
      fs.writeFileSync(outFileName, binary.filter(a=>a).join('\n'))

      console.log("Successfully")

    } catch(e){
      console.error(`failed to read${e.message}`)
    }
  }
  commandType(line: string): Command_Types {
    switch (true) {
      case line.startsWith("@"):
        return "A_COMMAND"
      case line.startsWith("(") && line.endsWith(")"):
        return "L_COMMAND"
      default:
        return "C_COMMAND"
    }
  }
  symbol(sentence: string): string {
    return sentence.replace(/[@()]/g, "")
  }
  dest(sentence: string): string {
    const matches = sentence.match(re.findDest) || ""
    return matches[0] || ""
  }
  comp(sentence: string): string {
    const matches = sentence.match(re.findComp) || sentence.match(/[0AMD](?=;)/g) || ""
    return matches[0] || ""
  }
  jump(sentence: string): Jump_Mnemonic {
    const matches = sentence.match(re.findJump) || ""
    const mn = matches[0] || ""

    switch(mn) {
      case "null" :
      case "JGT"  :
      case "JEQ"  :
      case "JGE"  :
      case "JLT"  :
      case "JNE"  :
      case "JLE"  :
      case "JMP"  :
        return mn
      default :
        return ""
    }
  }
}
