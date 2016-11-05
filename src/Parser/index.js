import {
  NodeKind,
  TokenKind as TT,
  KeywordKind as KK,
  PunctuatorKind as PP,
  getNameByLabel
} from "../labels";

import {
  inherit
} from "../utils";

import Node from "../nodes";

import * as parse from "./parse";
import * as literal from "./literal";

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

  back() {
    if (this.idx >= 1) {
      // go 2 back, so we can go 1 forward
      // to simulate real back behaviour
      this.idx -= 2;
      this.next();
      return (true);
    }
    return (false);
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
      this.throw(`Expected ${getNameByLabel(kind)} but got ${getNameByLabel(this.current.kind)}`, this.current);
    }
  }

  throw(msg, token) {
    let range = token.range;
    throw new Error(msg + ` at ${range.line}:${range.start}`);
  }

  createNode(kind) {
    let node = new Node[NodeKind[kind]]();
    node.kind = getNameByLabel(kind);
    return (node);
  }

  // TODO: make type dependant
  isOperator(token) {
    let kind = token.kind;
    return (
      kind === KK.ADD ||
      kind === KK.SUB ||
      kind === KK.MUL ||
      kind === KK.DIV ||
      kind === KK.DIV_S ||
      kind === KK.DIV_U ||
      kind === KK.REM_S ||
      kind === KK.REM_U ||
      kind === KK.AND ||
      kind === KK.OR ||
      kind === KK.XOR ||
      kind === KK.SHL ||
      kind === KK.SHR_S ||
      kind === KK.SHR_U ||
      kind === KK.ROTL ||
      kind === KK.ROTR ||
      kind === KK.EQ ||
      kind === KK.NE ||
      kind === KK.LT ||
      kind === KK.LT_S ||
      kind === KK.LT_U ||
      kind === KK.LE ||
      kind === KK.LE_S ||
      kind === KK.LE_U ||
      kind === KK.GT ||
      kind === KK.GT_S ||
      kind === KK.GT_U ||
      kind === KK.GE ||
      kind === KK.GE_S ||
      kind === KK.GE_U ||
      this.isUnaryOperator(token)
    );
  }

  isUnaryOperator(token) {
    let kind = token.kind;
    return (
      kind === KK.NEG ||
      kind === KK.COPYSIGN ||
      kind === KK.CEIL ||
      kind === KK.FLOOR ||
      kind === KK.TRUNC ||
      kind === KK.NEAREST ||
      kind === KK.CLZ ||
      kind === KK.POPCNT ||
      kind === KK.EQZ ||
      kind === KK.SQRT ||
      kind === KK.MIN ||
      kind === KK.MAX ||
      kind === KK.ABS ||
      this.isLoadOperator(token) ||
      this.isStoreOperator(token)
    );
  }

  isLoadOperator(token) {
    let kind = token.kind;
    return (
      kind === KK.LOAD ||
      kind === KK.LOAD8 ||
      kind === KK.LOAD8_S ||
      kind === KK.LOAD8_U ||
      kind === KK.LOAD16 ||
      kind === KK.LOAD16_S ||
      kind === KK.LOAD16_U ||
      kind === KK.LOAD32 ||
      kind === KK.LOAD32_S ||
      kind === KK.LOAD32_U ||
      kind === KK.LOAD64 ||
      kind === KK.LOAD64_S ||
      kind === KK.LOAD64_U
    );
  }

  isStoreOperator(token) {
    let kind = token.kind;
    return (
      kind === KK.STORE ||
      kind === KK.STORE8 ||
      kind === KK.STORE16 ||
      kind === KK.STORE32 ||
      kind === KK.STORE64
    );
  }

  isTypeLiteral(token) {
    let kind = token.kind;
    return (
      kind === KK.I32 ||
      kind === KK.I64 ||
      kind === KK.F32 ||
      kind === KK.F64
    );
  }

  isLiteral(token) {
    let kind = token.kind;
    return (
      kind === TT.Identifier ||
      kind === TT.NumericLiteral ||
      this.isStringLiteral(token) ||
      this.isTypeLiteral(token)
    );
  }

  isStringLiteral(token) {
    return (
      token.kind === TT.StringLiteral
    );
  }

  isDollarSigned(token) {
    return (
      token.value.charCodeAt(0) === 36
    );
  }

}

inherit(Parser, parse);
inherit(Parser, literal);
