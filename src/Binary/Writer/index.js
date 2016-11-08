import {
  NodeKind,
  getNameByLabel
} from "../../labels";

import CC from "../cc";
import BinaryArray from "../binary";

let idx = 0;
export default class Writer {

  constructor() {
    this.array = new BinaryArray();
  }

  writeMagic() {
    this.array.writei32(CC.WASM_MAGIC_COOKIE);
  }

  writeVersion() {
    this.array.writei32(CC.WASM_BINARY_VERSION);
  }

  write(ast) {
    this.writeMagic();
    this.writeVersion();
    this.emitTypeSection();
    this.emitExportSection();
    this.emitCodeSection();
    this.emitProgram(ast);
    let buffer = this.array.encode();
    console.log(buffer);
    return (buffer);
  }

  emitTypeSection(node) {
    this.array.writei8(0x1);
    this.array.writei8(0x7);
    this.array.writei8(0x1);
  }

  emitExportSection() {
    let array = this.array;
    array.writei8(0x07); // section code
    array.writei8(0xa);  // section size
    array.writei8(0x1);  // number of exports
    array.writeASCII("addTwo");
    array.writei8(0x0);  // export kind??
    array.writei8(0x0);  // function index
  }

  emitCodeSection() {
    let array = this.array;
    array.writei8(0xa);
    array.writei8(0x0);
    array.writei8(0x1);
  }

  emitProgram(node) {
    this.emitModule(node.body[0]);
  }

  emitModule(node) {
    this.emitBody(node.body);
  }

  emitBody(nodes) {
    let ii = 0;
    let length = nodes.length;
    for (; ii < length; ++ii) {
      this.emitNode(nodes[ii]);
    };
  }

  emitNode(node) {
    let kind = node.kind;
    switch (kind) {
      case NodeKind.Export:
        // ignore
      break;
      case NodeKind.Function:
        this.emitFunction(node);
      break;
      case NodeKind.Binary:
        this.emitBinaryExpression(node);
      break;
      case NodeKind.GetLocal:
        this.emitGetLocal(node);
      break;
      default:
        console.log(`Error: Unknown node kind ${getNameByLabel(kind)}`);
      break;
    };
  }

  emitGetLocal(node) {
    let array = this.array;
    array.writei8(0x20);
    array.writei8(idx++);
  }

  emitFunction(node) {
    let array = this.array;
    array.writei8(0x0);
    array.writei8(0x0);
    this.emitBody(node.body);
    array.writei8(0xb);
  }

  emitBinaryExpression(node) {
    let array = this.array;
    let opcode = CC.getOperatorCode(node.operator);
    array.writei8(opcode);
    this.emitNode(node.left);
    this.emitNode(node.right);
  }

}
