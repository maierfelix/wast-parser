import CC from "../cc";
import BinaryArray from "../binary";

export default class Writer {

  constructor() {
    this.array = new BinaryArray();
    console.log(this.array.writei32);
  }

  writeMagic() {
    this.array.writei32(CC.WASM_MAGIC);
  }

  writeVersion() {
    this.array.writei32(CC.WASM_BINARY_VERSION);
  }

  write(ast) {
    this.writeMagic();
    this.writeVersion();
    let buffer = this.array.encode();
    console.log(ast);
    console.log(this.array);
    console.log(buffer);
    return (buffer);
  }

}