import {
  NodeKind,
  TokenKind as TT,
  KeywordKind as KK,
  PunctuatorKind as PP,
  getNameByLabel
} from "../labels";

export function parseProgram() {
  let node = this.createNode(NodeKind.Program);
  node.body = this.parseModuleList();
  return (node);
}

export function parseModule() {
  this.expect(KK.MODULE);
  let node = this.createNode(NodeKind.Module);
  node.body = this.parseModuleList();
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
    case KK.MODULE:
      node = this.parseModule();
    break;
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
    case KK.ASSERT_TRAP:
      node = this.parseAssertTrap();
    break;
    case KK.ASSERT_RETURN:
      node = this.parseAssertReturn();
    break;
    case KK.ASSERT_INVALID:
      node = this.parseAssertInvalid();
    break;
    default:
      this.throw(`Invalid statement kind ${getNameByLabel(kind)}:${this.current.value}`, this.current);
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
    case KK.MODULE:
      node = this.parseModule();
    break;
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
    case KK.ELSE:
      node = this.parseElse();
    break;
    case KK.THEN:
      node = this.parseThen();
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
    case KK.GROW_MEMORY:
      node = this.parseGrowMemory();
    break;
    case KK.RESIZE_MEMORY:
      node = this.parseResizeMemory();
    break;
    case KK.CURRENT_MEMORY:
      node = this.parseCurrentMemory();
    break;
    case KK.NOP:
      node = this.parseNop();
    break;
    case KK.DROP:
      node = this.parseDrop();
    break;
    case KK.UNREACHABLE:
      node = this.parseUnreachable();
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

export function parseUnreachable() {
  this.expect(KK.UNREACHABLE);
  let node = this.createNode(NodeKind.Unreachable);
  return (node);
}

export function parseDrop() {
  this.expect(KK.DROP);
  let node = this.createNode(NodeKind.Drop);
  node.argument = this.parseField();
  return (node);
}

export function parseNop() {
  this.expect(KK.NOP);
  let node = this.createNode(NodeKind.Nop);
  return (node);
}

export function parseCurrentMemory() {
  this.expect(KK.CURRENT_MEMORY);
  let node = this.createNode(NodeKind.CurrentMemory);
  return (node);
}

export function parseResizeMemory() {
  this.expect(KK.RESIZE_MEMORY);
  let node = this.createNode(NodeKind.ResizeMemory);
  node.argument = this.parseField();
  return (node);
}

export function parseGrowMemory() {
  this.expect(KK.GROW_MEMORY);
  let node = this.createNode(NodeKind.GrowMemory);
  node.argument = this.parseField();
  return (node);
}

export function parseIf() {
  this.expect(KK.IF);
  let node = this.createNode(NodeKind.If);
  this.pushScope(node);
  if (this.peek(PP.LPAREN)) {
    // TODO: condition always in same line?
    //console.log(this.tokens[this.idx-1], this.tokens[this.idx]);
    if (this.tokens[this.idx-1].range.line === this.tokens[this.idx+1].range.line) {
      node.condition = this.parseField();
    }
  }
  node.body = this.parseFieldList();
  //console.log(node);
  this.popScope();
  return (node);
}

export function parseThen() {
  this.expect(KK.THEN);
  let node = this.createNode(NodeKind.Then);
  if (this.isLiteral(this.current)) {
    node.id = this.parseLiteral();
  }
  node.argument = this.parseField();
  return (node);
}

export function parseElse() {
  this.expect(KK.ELSE);
  let node = this.createNode(NodeKind.Else);
  if (this.isLiteral(this.current)) {
    node.id = this.parseLiteral();
  }
  node.body = this.parseFieldList();
  return (node);
}

export function parseInvoke() {
  this.expect(KK.INVOKE);
  let node = this.createNode(NodeKind.Invoke);
  node.name = this.parseLiteral();
  node.body = this.parseFieldList();
  return (node);
}

export function parseAssertInvalid() {
  this.expect(KK.ASSERT_INVALID);
  let node = this.createNode(NodeKind.AssertInvalid);
  node.argument = this.parseField();
  node.message = this.parseLiteral();
  return (node);
}

export function parseAssertTrap() {
  this.expect(KK.ASSERT_TRAP);
  let node = this.createNode(NodeKind.AssertTrap);
  node.invoke = this.parseField();
  node.message = this.parseLiteral();
  return (node);
}

export function parseAssertReturn() {
  this.expect(KK.ASSERT_RETURN);
  let node = this.createNode(NodeKind.AssertReturn);
  node.invoke = this.parseField();
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
  if (this.isTypeLiteral(this.current)) {
    node.type = this.parseLiteral();
  }
  node.body = this.parseFieldList();
  return (node);
}

export function parseLoop() {
  this.expect(KK.LOOP);
  let node = this.createNode(NodeKind.Loop);
  if (this.isLiteral(this.current)) {
    node.id = this.parseLiteral();
  }
  if (this.isTypeLiteral(this.current)) {
    node.type = this.parseLiteral();
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
    node.operator = KK[this.current.value];
    this.next();
    if (isStore || isLoad) {
      node.argument = this.parseField();
      if (this.current.kind === PP.LPAREN) {
        node.offset = this.parseField();
      }
    }
    else if (isUnary) {
      if (this.eat(PP.SLASH)) {
        node.type = this.parseLiteral();
      }
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
  // return sth or void
  if (this.peek(PP.LPAREN)) {
    node.argument = this.parseField();
  }
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
  if (this.peek(TT.StringLiteral)) {
    node.name = this.parseLiteral();
  }
  if (this.peek(TT.Identifier)) {
    node.id = this.parseLiteral();
  }
  return (node);
}

export function parseExport() {
  this.expect(KK.EXPORT);
  let node = this.createNode(NodeKind.Export);
  if (this.peek(TT.StringLiteral)) {
    node.name = this.parseLiteral();
  }
  if (this.peek(PP.LPAREN)) {
    node.argument = this.parseModuleField();
  }
  return (node);
}
