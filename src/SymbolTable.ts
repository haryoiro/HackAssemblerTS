const reservedWord = {
  SP:   0,
  LCL:  1,
  ARG:  2,
  THIS: 3,
  THAT: 4,
  // R0-R15
  R0:   0,
  R1:   1,
  R2:   2,
  R3:   3,
  R4:   4,
  R5:   5,
  R6:   6,
  R7:   7,
  R8:   8,
  R9:   9,
  R10:  10,
  R11:  11,
  R12:  12,
  R13:  13,
  R14:  14,
  R15:  15,
  SCREEN: 16384, // 0x4000
  KBD: 24576,    // 0x6000
}

module.exports = class SymbolTable {
  symbols = new Map()
  constructor() {
    this.init()
  }
  init() {
    for (const key in reservedWord) {
      if (Object.prototype.hasOwnProperty.call(reservedWord, key)) {
        //@ts-ignore
        const element = reservedWord[key];
        this.symbols.set(key, element)
      }
    }
  }
  printSymbol(): void {
    console.log(this.symbols.entries())
  }
  addEntry(symbol: string, address: number): void {
    this.symbols.set(symbol, address)
  }
  contains(symbol: string): boolean {
    return this.symbols.has(symbol)
  }
  getAddress(symbol: string): number {
    return this.symbols.get(symbol)
  }
}
