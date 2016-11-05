import {
  NodeKind,
  TokenKind as TT,
  KeywordKind as KK,
  PunctuatorKind as PP,
  getNameByLabel
} from "../labels";

export function parseLiteral() {
  let kind = this.current.kind;
  if (!this.isLiteral(this.current)) {
    this.throw(`Invalid literal token ${getNameByLabel(kind)}`, this.current);
  }
  let isType = this.isTypeLiteral(this.current);
  let node = null;
  // determine if parse a type or literal
  if (isType) node = this.parseTypeLiteral();
  else node = this.parsePureLiteral();
  return (node);
}

export function parsePureLiteral() {
  let kind = this.current.kind;
  let node = this.createNode(NodeKind.Literal);
  let value = this.current.value;
  let isDollarSigned = this.isDollarSigned(this.current);
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
    this.throw(`Invalid node literal type ${getNameByLabel(kind)}`, token);
  }
  node.value = getNameByLabel(kind);
  this.next();
  return (node);
}
