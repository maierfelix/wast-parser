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
  [✓] WASM_MODULE_FIELD_TYPE_FUNC,
  [☓] WASM_MODULE_FIELD_TYPE_GLOBAL,
  [☓] WASM_MODULE_FIELD_TYPE_IMPORT,
  [✓] WASM_MODULE_FIELD_TYPE_EXPORT,
  [☓] WASM_MODULE_FIELD_TYPE_FUNC_TYPE,
  [☓] WASM_MODULE_FIELD_TYPE_TABLE,
  [☓] WASM_MODULE_FIELD_TYPE_ELEM_SEGMENT,
  [✓] WASM_MODULE_FIELD_TYPE_MEMORY,
  [☓] WASM_MODULE_FIELD_TYPE_DATA_SEGMENT,
  [☓] WASM_MODULE_FIELD_TYPE_START
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
      this.throw(`Invalid statement kind ${getNameByLabel(kind)}`, this.current);
    break;
  };
  this.expect(PP.RPAREN);
  return (node);
}

/**
  [✓] WASM_EXPR_TYPE_BINARY,
  [☓] WASM_EXPR_TYPE_BLOCK,
  [☓] WASM_EXPR_TYPE_BR,
  [☓] WASM_EXPR_TYPE_BR_IF,
  [☓] WASM_EXPR_TYPE_BR_TABLE,
  [☓] WASM_EXPR_TYPE_CALL,
  [☓] WASM_EXPR_TYPE_CALL_INDIRECT,
  [☓] WASM_EXPR_TYPE_COMPARE,
  [✓] WASM_EXPR_TYPE_CONST,
  [☓] WASM_EXPR_TYPE_CONVERT,
  [☓] WASM_EXPR_TYPE_CURRENT_MEMORY,
  [☓] WASM_EXPR_TYPE_DROP,
  [☓] WASM_EXPR_TYPE_GET_GLOBAL,
  [✓] WASM_EXPR_TYPE_GET_LOCAL,
  [☓] WASM_EXPR_TYPE_GROW_MEMORY,
  [✓] WASM_EXPR_TYPE_IF,
  [☓] WASM_EXPR_TYPE_LOAD,
  [☓] WASM_EXPR_TYPE_LOOP,
  [☓] WASM_EXPR_TYPE_NOP,
  [✓] WASM_EXPR_TYPE_RETURN,
  [☓] WASM_EXPR_TYPE_SELECT,
  [☓] WASM_EXPR_TYPE_SET_GLOBAL,
  [✓] WASM_EXPR_TYPE_SET_LOCAL,
  [☓] WASM_EXPR_TYPE_STORE,
  [☓] WASM_EXPR_TYPE_TEE_LOCAL,
  [☓] WASM_EXPR_TYPE_UNARY,
  [☓] WASM_EXPR_TYPE_UNREACHABLE
 */
export function parseField() {
  this.expect(PP.LPAREN);
  let kind = this.current.kind;
  let node = null;
  switch (kind) {
    case KK.BLOCK:
      node = this.parseBlock();
    break;
    case KK.LOOP:
      node = this.parseLoop();
    break;
    case KK.CALL:
      node = this.parseCall();
    break;
    case KK.IF:
      node = this.parseIf();
    break;
    case KK.BR:
      node = this.parseBreak();
    break;
    case KK.BR_IF:
      node = this.parseBreakIf();
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
    case KK.INVOKE:
      node = this.parseInvoke();
    break;
    case KK.ASSERT_TRAP:
      node = this.parseAssertTrap();
    break;
    case KK.ASSERT_RETURN:
      node = this.parseAssertReturn();
    break;
    case KK.ELSE:
    case KK.THEN:
      node = this.parseElse();
    break;
    default:
      if (this.isTypeLiteral(this.current)) {
        node = this.parseExpression();
      }
      else this.throw(`Invalid expression kind ${getNameByLabel(kind)}`, this.current);
    break;
  };
  this.expect(PP.RPAREN);
  return (node);
}

export function parseInvoke() {
  this.expect(KK.INVOKE);
  let node = this.createNode(NodeKind.Invoke);
  node.name = this.parseLiteral();
  node.expressions = this.parseFieldList();
  return (node);
}

export function parseAssertTrap() {
  this.expect(KK.ASSERT_RETURN);
  let node = this.createNode(NodeKind.AssertTrap);
  node.argument = this.parseField();
  node.message = this.parseLiteral();
  return (node);
}

export function parseAssertReturn() {
  this.expect(KK.ASSERT_RETURN);
  let node = this.createNode(NodeKind.AssertReturn);
  node.invoke = this.parseInvoke();
  node.argument = this.parseField();
  return (node);
}

export function parseCall() {
  this.expect(KK.CALL);
  let node = this.createNode(NodeKind.Call);
  node.id = this.parseLiteral();
  node.expressions = this.parseFieldList();
  return (node);
}

export function parseBreak() {
  this.expect(KK.BR);
  let node = this.createNode(NodeKind.Break);
  node.id = this.parseLiteral();
  return (node);
}

export function parseBreakIf() {
  this.expect(KK.BR_IF);
  let node = this.createNode(NodeKind.BreakIf);
  node.id = this.parseLiteral();
  node.body = this.parseFieldList();
  return (node);
}

export function parseBlock() {
  this.expect(KK.BLOCK);
  let node = this.createNode(NodeKind.Block);
  if (this.isLiteral(this.current)) {
    node.name = this.parseLiteral();
  }
  node.body = this.parseFieldList();
  return (node);
}

export function parseLoop() {
  this.expect(KK.LOOP);
  let node = this.createNode(NodeKind.Loop);
  if (this.isLiteral(this.current)) {
    node.name = this.parseLiteral();
  }
  node.body = this.parseFieldList();
  return (node);
}

export function parseExpression() {
  let type = this.parseLiteral();
  this.expect(PP.DOT);
  if (this.eat(KK.CONST)) {
    let node = this.createNode(NodeKind.Constant);
    node.type = type;
    node.value = this.parseLiteral();
    return (node);
  }
  if (this.isOperator(this.current)) {
    let isUnary = this.isUnaryOperator(this.current);
    let isLoad = this.isLoadOperator(this.current);
    let isStore = !isLoad && this.isStoreOperator(this.current);
    let node = this.createNode(isUnary ? NodeKind.Unary : NodeKind.Binary);
    node.operator = this.current.value;
    this.next();
    if (isStore || isLoad) {
      node.argument = this.parseField();
      if (this.current.kind === PP.LPAREN) {
        node.offset = this.parseField();
      }
    }
    else if (isUnary) {
      node.argument = this.parseField();
    } else {
      if (this.peek(PP.LPAREN)) node.left = this.parseField();
      if (this.peek(PP.LPAREN)) node.right = this.parseField();
    }
    return (node);
  } else {
    this.throw(`Sth went prty wrong bru`, this.current);
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
  if (this.peek(PP.LPAREN)) {
    node.argument = this.parseField();
  }
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
  node.type = this.parseLiteral();
  return (node);
}

export function parseFunction() {
  this.expect(KK.FUNC);
  let node = this.createNode(NodeKind.Function);
  // TODO: is this really export?
  if (this.peek(TT.StringLiteral)) {
    node.export = this.parseLiteral();
  }
  if (this.isLiteral(this.current)) {
    node.name = this.parseLiteral();
  }
  while (!this.peek(PP.RPAREN)) {
    this.expect(PP.LPAREN);
    // parameter
    if (this.eat(KK.PARAM)) {
      let param = this.createNode(NodeKind.Parameter);
      param.name = this.parseLiteral();
      // optional
      if (this.isLiteral(this.current)) {
        param.type = this.parseLiteral();
      }
      node.args.push(param);
    }
    // func result type
    else if (this.eat(KK.RESULT)) {
      node.result = this.parseLiteral();
    }
    else if (this.eat(KK.EXPORT)) {
      node.export = this.parseLiteral();
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
  let node = this.createNode(NodeKind.Import);
  if (this.isStringLiteral(this.current)) {
    node.name = this.parseLiteral();
  }
  return (node);
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
