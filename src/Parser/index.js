import {
  NodeKind,
  TokenKind as TT,
  KeywordKind as KK,
  PunctuatorKind as PP,
  getNameByLabel
} from "../labels";

import Node from "../nodes";

export default class Parser {

  constructor() {
    this.idx = 0;
    this.limit = 0;
    this.tokens = null;
    this.current = null;
  }

  parse(tokens) {
    this.idx = 0;
    this.current = tokens[0];
    this.limit = tokens.length;
    this.tokens = tokens;
    return (this.parseModule());
  }

  eat(kind) {
    if (this.peek(kind)) {
      this.next();
      return (true);
    } else {
      return (false);
    }
  }

  peek(kind) {
    return (
      this.current.kind !== TT.EOF &&
      this.current.kind === kind
    );
  }

  next() {
    if (this.idx < this.limit) {
      this.current = this.tokens[++this.idx];
      return (true);
    } else {
      return (false);
    }
  }

  expect(kind) {
    if (this.peek(kind)) {
      this.next();
    } else {
      throw new Error(`Expected ${getNameByLabel(kind)} but got ${getNameByLabel(this.current.kind)}`);
    }
  }

  createNode(kind) {
    let node = new Node[NodeKind[kind]]();
    return (node);
  }

  parseModule() {
    let node = this.createNode(NodeKind.Module);
    this.expect(PP.LPAREN);
    this.expect(KK.MODULE);
    node.body = this.parseBlock();
    this.expect(PP.RPAREN);
    return (node);
  }

  parseBlock() {
    let nodes = [];
    let node = null;
    while (true) {
      if (!this.peek(PP.LPAREN)) break;
      node = this.parseModuleField();
      if (node === null) break;
      nodes.push(node);
    };
    return (nodes);
  }

  /**
    WASM_MODULE_FIELD_TYPE_FUNC,
    WASM_MODULE_FIELD_TYPE_GLOBAL,
    WASM_MODULE_FIELD_TYPE_IMPORT,
    WASM_MODULE_FIELD_TYPE_EXPORT,
    WASM_MODULE_FIELD_TYPE_FUNC_TYPE,
    WASM_MODULE_FIELD_TYPE_TABLE,
    WASM_MODULE_FIELD_TYPE_ELEM_SEGMENT,
    WASM_MODULE_FIELD_TYPE_MEMORY,
    WASM_MODULE_FIELD_TYPE_DATA_SEGMENT,
    WASM_MODULE_FIELD_TYPE_START
  */
  parseModuleField() {
    this.expect(PP.LPAREN);
    let kind = this.current.kind;
    let node = null;
    switch (kind) {
      case KK.FUNC:
        node = this.parseFunctionDeclaration();
      break;
      case KK.MEMORY:
        node = this.parseMemoryStatement();
      break;
      case KK.IMPORT:
        node = this.parseImportStatement();
      break;
      case KK.EXPORT:
        node = this.parseExportStatement();
      break;
      default:
        throw new Error(`Invalid statement kind ${getNameByLabel(kind)}`);
      break;
    };
    this.expect(PP.RPAREN);
    return (node);
  }

  /**
    WASM_EXPR_TYPE_BINARY,
    WASM_EXPR_TYPE_BLOCK,
    WASM_EXPR_TYPE_BR,
    WASM_EXPR_TYPE_BR_IF,
    WASM_EXPR_TYPE_BR_TABLE,
    WASM_EXPR_TYPE_CALL,
    WASM_EXPR_TYPE_CALL_INDIRECT,
    WASM_EXPR_TYPE_COMPARE,
    WASM_EXPR_TYPE_CONST,
    WASM_EXPR_TYPE_CONVERT,
    WASM_EXPR_TYPE_CURRENT_MEMORY,
    WASM_EXPR_TYPE_DROP,
    WASM_EXPR_TYPE_GET_GLOBAL,
    WASM_EXPR_TYPE_GET_LOCAL,
    WASM_EXPR_TYPE_GROW_MEMORY,
    WASM_EXPR_TYPE_IF,
    WASM_EXPR_TYPE_LOAD,
    WASM_EXPR_TYPE_LOOP,
    WASM_EXPR_TYPE_NOP,
    WASM_EXPR_TYPE_RETURN,
    WASM_EXPR_TYPE_SELECT,
    WASM_EXPR_TYPE_SET_GLOBAL,
    WASM_EXPR_TYPE_SET_LOCAL,
    WASM_EXPR_TYPE_STORE,
    WASM_EXPR_TYPE_TEE_LOCAL,
    WASM_EXPR_TYPE_UNARY,
    WASM_EXPR_TYPE_UNREACHABLE
  */
  parseExpression() {

  }

  parseFunctionDeclaration() {
    this.expect(KK.FUNC);
    let node = this.createNode(NodeKind.FunctionDeclaration);
    node.name = this.parseLiteral();
    // parameter or result
    if (this.peek(PP.LPAREN)) {
      
    }
    return (node);
  }

  parseMemoryStatement() {
    this.expect(KK.MEMORY);
    let node = this.createNode(NodeKind.MemoryDeclaration);
    if (this.peek(TT.NumericLiteral)) {
      node.initial = this.parseLiteral();
    }
    if (node.initial !== null && this.peek(TT.NumericLiteral)) {
      node.max = this.parseLiteral();
    }
    return (node);
  }

  parseImportStatement() {
    this.expect(KK.IMPORT);
    console.log(this.current);
  }

  parseExportStatement() {
    this.expect(KK.EXPORT);
    let node = this.createNode(NodeKind.ExportStatement);
    if (this.peek(TT.StringLiteral)) {
      node.name = this.parseLiteral();
    }
    if (this.peek(TT.Identifier)) {
      node.attachment = this.parseLiteral();
    }
    return (node);
  }

  parseLiteral() {
    if (
      !this.peek(TT.Identifier) &&
      !this.peek(TT.StringLiteral) &&
      !this.peek(TT.NumericLiteral)
    ) throw new Error(`Invalid literal token ${getNameByLabel(this.current.kind)}`);
    let node = this.createNode(NodeKind.Literal);
    let value = this.current.value;
    node.type = this.current.kind;
    node.raw = value;
    node.value = node.type === TT.NumericLiteral ? parseFloat(value) : value;
    this.next();
    return (node);
  }

}