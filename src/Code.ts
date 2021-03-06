import { Jump_Mnemonic } from './Parser';

class Code {
  dest(mnemonic: string): number[] {
    const result = [
      mnemonic.includes("A") || 0,
      mnemonic.includes("D") || 0,
      mnemonic.includes("M") || 0,
    ]
    return mnemonic === "null" ? [0,0,0] : result
  }

  comp(mnemonic: string): number[] {
    const a = mnemonic.includes("M") || 0
    const m = mnemonic.replace("M", "A")
    switch(m) {
      case "0"   :  return [a,1,0,1,0,1,0]
      case "1"   :  return [a,1,1,1,1,1,1]
      case "-1"  :  return [a,1,1,1,0,1,0]
      case "D"   :  return [a,0,0,1,1,0,0]
      case "A"   :  return [a,1,1,0,0,0,0]
      case "!D"  :  return [a,0,0,1,1,0,1]
      case "!A"  :  return [a,1,1,0,0,0,1]
      case "-D"  :  return [a,0,0,1,1,1,1]
      case "-A"  :  return [a,1,1,0,0,1,1]
      case "D+1" :  return [a,0,1,1,1,1,1]
      case "A+1" :  return [a,1,1,0,1,1,1]
      case "D-1" :  return [a,0,0,1,1,1,0]
      case "A-1" :  return [a,1,1,0,0,1,0]
      case "D+A" :  return [a,0,0,0,0,1,0]
      case "D-A" :  return [a,0,1,0,0,1,1]
      case "A-D" :  return [a,0,0,0,1,1,1]
      case "D&A" :  return [a,0,0,0,0,0,0]
      case "D|A" :  return [a,0,1,0,1,0,1]
      default    :  return [0,0,0,0,0,0,0]
    }
  }
  jump(mnemonic: Jump_Mnemonic): number[]{
    switch (mnemonic) {
      case "null" :  return [0,0,0]
      case "JGT"  :  return [0,0,1]
      case "JEQ"  :  return [0,1,0]
      case "JGE"  :  return [0,1,1]
      case "JLT"  :  return [1,0,0]
      case "JNE"  :  return [1,0,1]
      case "JLE"  :  return [1,1,0]
      case "JMP"  :  return [1,1,1]
      default     :  return [0,0,0]
    }
  }
}

module.exports = Code
