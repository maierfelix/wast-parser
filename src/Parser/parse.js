import {
  NodeKind,
  TokenKind as TT,
  KeywordKind as KK,
  PunctuatorKind as PP,
  getNameByLabel
} from "../labels";

export function parseModule() {
  let node = this.createNode(NodeKind.Module);
  this.expect(PP.LPAREN);
  this.expect(KK.MODULE);
  node.body = this.parseModuleList();
  this.expect(PP.RPAREN);
  return (node);
}

export function parseModuleList() {
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

export function parseFieldList() {
  let nodes = [];
  let node = null;
  while (true) {
    if (!this.peek(PP.LPAREN)) break;
    node = this.parseField();
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
export function parseModuleField() {
  this.expect(PP.LPAREN);
  let kind = this.current.kind;
  let node = null;
  switch (kind) {
    case KK.FUNC:
      node = this.parseFunction();
    break;
    case KK.MEMORY:
      node = this.parseMemory();
    break;
    case KK.IMPORT:
      node = this.parseImport();
    break;
    case KK.EXPORT:
      node = this.parseExport();
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
export function parseField() {
  this.expect(PP.LPAREN);
  let kind = this.current.kind;
  let node = null;
  switch (kind) {
    case KK.IF:
      node = this.parseIf();
    break;
    case KK.LOCAL:
      node = this.parseLocal();
    break;
    case KK.RETURN:
      node = this.parseReturn();
    break;
    case KK.SELECT:
      node = this.parseSelect();
    break;
    case KK.GET_LOCAL:
      node = this.parseGetLocal();
    break;
    case KK.SET_LOCAL:
      node = this.parseSetLocal();
    break;
    case KK.TEE_LOCAL:
      node = this.parseTeeLocal();
    break;
    default:
      if (this.isTypeLiteral(this.current)) {
        node = this.parseExpression();
      }
      else throw new Error(`Invalid expression kind ${getNameByLabel(kind)}`);
    break;
  };
  this.expect(PP.RPAREN);
  return (node);
}

export function parseExpression() {
  let type = this.parseTypeLiteral();
  this.expect(PP.DOT);
  if (this.eat(KK.CONST)) {
    let node = this.createNode(NodeKind.Constant);
    node.type = type;
    node.value = this.parseLiteral();
    return (node);
  }
  if (this.isOperator(this.current)) {
    let node = this.createNode(NodeKind.Binary);
    node.operator = this.current.value;
    this.next();
    node.left = this.parseField();
    node.right = this.parseField();
    return (node);
  }
  else {
    throw new Error(`Sth went prty wrong bru`);
  }
}

export function parseGetLocal() {
  this.expect(KK.GET_LOCAL);
  let node = this.createNode(NodeKind.GetLocal);
  node.id = this.parseLiteral();
  return (node);
}

export function parseSetLocal() {
  this.expect(KK.SET_LOCAL);
  let node = this.createNode(NodeKind.SetLocal);
  node.id = this.parseLiteral();
  node.argument = this.parseField();
  return (node);
}

export function parseIf() {
  this.expect(KK.IF);
  let node = this.createNode(NodeKind.If);
  node.condition = this.parseField();
  node.consequent = this.parseField();
  node.alternate = this.parseField();
  return (node);
}

export function parseSelect() {
  this.expect(KK.SELECT);
  let node = this.createNode(NodeKind.Select);
  node.condition = this.parseField();
  node.consequent = this.parseField();
  node.alternate = this.parseField();
  return (node);
}

export function parseReturn() {
  this.expect(KK.RETURN);
  let node = this.createNode(NodeKind.Return);
  node.argument = this.parseField();
  return (node);
}

export function parseLocal() {
  this.expect(KK.LOCAL);
  let node = this.createNode(NodeKind.Local);
  node.name = this.parseLiteral();
  node.type = this.parseTypeLiteral();
  return (node);
}

export function parseFunction() {
  this.expect(KK.FUNC);
  let node = this.createNode(NodeKind.Function);
  node.name = this.parseLiteral();
  while (!this.peek(PP.RPAREN)) {
    this.expect(PP.LPAREN);
    // parameter
    if (this.eat(KK.PARAM)) {
      let param = this.createNode(NodeKind.Parameter);
      param.name = this.parseLiteral();
      param.type = this.parseTypeLiteral();
      node.args.push(param);
    }
    // func result type
    else if (this.eat(KK.RESULT)) {
      node.result = this.parseTypeLiteral();
    }
    // func body
    else {
      this.back();
      node.body = this.parseFieldList();
      break;
    }
    this.expect(PP.RPAREN);
  };
  return (node);
}

export function parseMemory() {
  this.expect(KK.MEMORY);
  let node = this.createNode(NodeKind.Memory);
  if (this.peek(TT.NumericLiteral)) {
    node.initial = this.parseLiteral();
  }
  if (node.initial !== null && this.peek(TT.NumericLiteral)) {
    node.max = this.parseLiteral();
  }
  return (node);
}

export function parseImport() {
  this.expect(KK.IMPORT);
  console.log(this.current);
}

export function parseExport() {
  this.expect(KK.EXPORT);
  let node = this.createNode(NodeKind.Export);
  if (this.peek(TT.StringLiteral)) {
    node.name = this.parseLiteral();
  }
  if (this.peek(TT.Identifier)) {
    node.id = this.parseLiteral();
  }
  return (node);
}

export function parseLiteral() {
  let kind = this.current.kind;
  if (
    !this.peek(TT.Identifier) &&
    !this.peek(TT.StringLiteral) &&
    !this.peek(TT.NumericLiteral)
  ) throw new Error(`Invalid literal token ${getNameByLabel(kind)}`);
  let node = this.createNode(NodeKind.Literal);
  let value = this.current.value;
  let isDollarSigned = value.charCodeAt(0) === 36;
  node.type = kind;
  node.raw = value;
  node.value = (
    node.type === TT.NumericLiteral ? parseFloat(value) :
    isDollarSigned ? value.substring(1) : value
  );
  this.next();
  return (node);
}

export function parseTypeLiteral() {
  let token = this.current;
  let kind = token.kind;
  let node = this.createNode(NodeKind.TypeLiteral);
  if (!this.isTypeLiteral(token)) {
    throw new Error(`Invalid node literal type ${getNameByLabel(kind)}`);
  }
  node.value = getNameByLabel(kind);
  this.next();
  return (node);
}