import {
  TokenKind as TT,
  KeywordKind as KK
} from "../labels";

// TODO: make type dependant
export function isOperator(token) {
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

export function isUnaryOperator(token) {
  let kind = token.kind;
  return (
    kind === KK.NEG ||
    kind === KK.COPYSIGN ||
    kind === KK.CEIL ||
    kind === KK.FLOOR ||
    kind === KK.TRUNC ||
    kind === KK.TRUNC_S ||
    kind === KK.TRUNC_U ||
    kind === KK.NEAREST ||
    kind === KK.CLZ ||
    kind === KK.CTZ ||
    kind === KK.POPCNT ||
    kind === KK.EQZ ||
    kind === KK.SQRT ||
    kind === KK.MIN ||
    kind === KK.MAX ||
    kind === KK.ABS ||
    kind === KK.CONVERT ||
    kind === KK.CONVERT_S ||
    kind === KK.CONVERT_U ||
    kind === KK.EXTEND ||
    kind === KK.EXTEND_S ||
    kind === KK.EXTEND_U ||
    kind === KK.DEMOTE ||
    kind === KK.PROMOTE ||
    kind === KK.REINTERPRET ||
    kind === KK.WRAP ||
    this.isLoadOperator(token) ||
    this.isStoreOperator(token)
  );
}

export function isLoadOperator(token) {
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

export function isStoreOperator(token) {
  let kind = token.kind;
  return (
    kind === KK.STORE ||
    kind === KK.STORE8 ||
    kind === KK.STORE16 ||
    kind === KK.STORE32 ||
    kind === KK.STORE64
  );
}

export function isTypeLiteral(token) {
  let kind = token.kind;
  return (
    kind === KK.I32 ||
    kind === KK.I64 ||
    kind === KK.F32 ||
    kind === KK.F64
  );
}

export function isLiteral(token) {
  let kind = token.kind;
  return (
    kind === TT.Identifier ||
    kind === TT.NumericLiteral ||
    this.isStringLiteral(token) ||
    this.isTypeLiteral(token)
  );
}

export function isStringLiteral(token) {
  return (
    token.kind === TT.StringLiteral
  );
}

export function isDollarSigned(token) {
  return (
    token.value.charCodeAt(0) === 36
  );
}
