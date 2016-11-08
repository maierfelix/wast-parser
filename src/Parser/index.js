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
import Scope from "./scope";

import * as cmp from "./cmp";
import * as parse from "./parse";
import * as literal from "./literal";

export default class Parser {

  constructor() {
    this.idx = 0;
    this.limit = 0;
    this.scope = null;
    this.tokens = null;
    this.current = null;
  }

  parse(tokens) {
    this.idx = 0;
    this.current = tokens[0];
    this.limit = tokens.length;
    this.tokens = tokens;
    return (this.parseProgram());
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
    //node.kind = getNameByLabel(kind);
    node.kind = kind;
    return (node);
  }

  /**
   * @param {Node} node
   */
  pushScope(node) {
    let scope = new Scope(node, this.scope);
    if (node.kind === NodeKind.Program) {
      scope = this.global;
    }
    node.context = scope;
    this.scope = node.context;
  }

  popScope() {
    this.scope = this.scope.parent;
  }

}

inherit(Parser, cmp);
inherit(Parser, parse);
inherit(Parser, literal);
