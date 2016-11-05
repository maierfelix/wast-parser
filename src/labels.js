let idx = 0;

export let NodeKind = {};
export let TokenKind = {};
export let KeywordKind = {};
export let PunctuatorKind = {};

((Label) => {

  Label[Label["Module"] = ++idx] = "Module";
  Label[Label["Literal"] = ++idx] = "Literal";
  Label[Label["TypeLiteral"] = ++idx] = "TypeLiteral";

  Label[Label["If"] = ++idx] = "If";
  Label[Label["Loop"] = ++idx] = "Loop";
  Label[Label["Break"] = ++idx] = "Break";
  Label[Label["BreakIf"] = ++idx] = "BreakIf";
  Label[Label["Block"] = ++idx] = "Block";
  Label[Label["Import"] = ++idx] = "Import";
  Label[Label["Export"] = ++idx] = "Export";
  Label[Label["Return"] = ++idx] = "Return";
  Label[Label["Unary"] = ++idx] = "Unary";
  Label[Label["Binary"] = ++idx] = "Binary";
  Label[Label["DoWhile"] = ++idx] = "DoWhile";
  Label[Label["Continue"] = ++idx] = "Continue";
  Label[Label["Expression"] = ++idx] = "Expression";

  Label[Label["Call"] = ++idx] = "Call";
  Label[Label["Select"] = ++idx] = "Select";
  Label[Label["SetLocal"] = ++idx] = "SetLocal";
  Label[Label["GetLocal"] = ++idx] = "GetLocal";
  Label[Label["Sequence"] = ++idx] = "Sequence";
  Label[Label["Assignment"] = ++idx] = "Assignment";

  Label[Label["Local"] = ++idx] = "Local";
  Label[Label["Memory"] = ++idx] = "Memory";
  Label[Label["Constant"] = ++idx] = "Constant";
  Label[Label["Variable"] = ++idx] = "Variable";
  Label[Label["Function"] = ++idx] = "Function";
  Label[Label["Parameter"] = ++idx] = "Parameter";

  Label[Label["Invoke"] = ++idx] = "Invoke";
  Label[Label["AssertTrap"] = ++idx] = "AssertTrap";
  Label[Label["AssertReturn"] = ++idx] = "AssertReturn";

})(NodeKind);

((Label) => {

  Label[Label["."] = ++idx] = "DOT";
  Label[Label[","] = ++idx] = "COMMA";
  Label[Label["/"] = ++idx] = "SLASH";
  Label[Label["("] = ++idx] = "LPAREN";
  Label[Label[")"] = ++idx] = "RPAREN";

  generateKeyAccess(PunctuatorKind);

})(PunctuatorKind);

((Label) => {

  Label[Label["EOF"] = ++idx] = "EOF";
  Label[Label["Identifier"] = ++idx] = "Identifier";
  Label[Label["StringLiteral"] = ++idx] = "StringLiteral";
  Label[Label["NumericLiteral"] = ++idx] = "NumericLiteral";

})(TokenKind);

((Label) => {

  Label[Label["func"] = ++idx] = "FUNC";
  Label[Label["const"] = ++idx] = "CONST";
  Label[Label["result"] = ++idx] = "RESULT";
  Label[Label["module"] = ++idx] = "MODULE";
  Label[Label["import"] = ++idx] = "IMPORT";
  Label[Label["export"] = ++idx] = "EXPORT";
  Label[Label["invoke"] = ++idx] = "INVOKE";
  Label[Label["if"] = ++idx] = "IF";
  Label[Label["then"] = ++idx] = "THEN";
  Label[Label["else"] = ++idx] = "ELSE";

  Label[Label["nop"] = ++idx] = "NOP";
  Label[Label["drop"] = ++idx] = "DROP";
  Label[Label["goto"] = ++idx] = "GOTO";
  Label[Label["end"] = ++idx] = "END";
  Label[Label["br"] = ++idx] = "BR";
  Label[Label["br_if"] = ++idx] = "BR_IF";
  Label[Label["br_table"] = ++idx] = "BR_TABLE";
  Label[Label["grow_table"] = ++idx] = "GROW_TABLE";
  Label[Label["current_table_length"] = ++idx] = "CURRENT_TABLE_LENGTH";
  Label[Label["return"] = ++idx] = "RETURN";
  Label[Label["block"] = ++idx] = "BLOCK";
  Label[Label["break"] = ++idx] = "BREAK";
  Label[Label["local"] = ++idx] = "LOCAL";
  Label[Label["continue"] = ++idx] = "CONTINUE";

  Label[Label["loop"] = ++idx] = "LOOP";
  Label[Label["param"] = ++idx] = "PARAM";
  Label[Label["select"] = ++idx] = "SELECT";
  Label[Label["unreachable"] = ++idx] = "UNREACHABLE";

  Label[Label["call"] = ++idx] = "CALL";
  Label[Label["call_indirect"] = ++idx] = "CALL_INDIRECT";

  Label[Label["get_local"] = ++idx] = "GET_LOCAL";
  Label[Label["set_local"] = ++idx] = "SET_LOCAL";
  Label[Label["tee_local"] = ++idx] = "TEE_LOCAL";
  Label[Label["get_global"] = ++idx] = "GET_GLOBAL";
  Label[Label["set_global"] = ++idx] = "SET_GLOBAL";
  Label[Label["get_table"] = ++idx] = "GET_TABLE";
  Label[Label["set_table"] = ++idx] = "SET_TABLE";

  Label[Label["memory"] = ++idx] = "MEMORY";
  Label[Label["address_of"] = ++idx] = "ADDRESS_OF";
  Label[Label["grow_memory"] = ++idx] = "GROW_MEMORY";
  Label[Label["current_memory"] = ++idx] = "CURRENT_MEMORY";

  Label[Label["assert_return"] = ++idx] = "ASSERT_RETURN";

  Label[Label["i32"] = ++idx] = "I32";
  Label[Label["i64"] = ++idx] = "I64";
  Label[Label["f32"] = ++idx] = "F32";
  Label[Label["f64"] = ++idx] = "F64";

  Label[Label["load"] = ++idx] = "LOAD";
  Label[Label["load8"] = ++idx] = "LOAD8";
  Label[Label["load8_s"] = ++idx] = "LOAD8_S";
  Label[Label["load8_u"] = ++idx] = "LOAD8_U";
  Label[Label["load16"] = ++idx] = "LOAD16";
  Label[Label["load16_s"] = ++idx] = "LOAD16_S";
  Label[Label["load16_u"] = ++idx] = "LOAD16_U";
  Label[Label["load32"] = ++idx] = "LOAD32";
  Label[Label["load32_s"] = ++idx] = "LOAD32_S";
  Label[Label["load32_u"] = ++idx] = "LOAD32_U";
  Label[Label["load64"] = ++idx] = "LOAD64";
  Label[Label["load64_s"] = ++idx] = "LOAD64_S";
  Label[Label["load64_u"] = ++idx] = "LOAD64_U";

  Label[Label["store"] = ++idx] = "STORE";
  Label[Label["store8"] = ++idx] = "STORE8";
  Label[Label["store16"] = ++idx] = "STORE16";
  Label[Label["store32"] = ++idx] = "STORE32";
  Label[Label["store64"] = ++idx] = "STORE64";

  // binop
  Label[Label["add"] = ++idx] = "ADD";
  Label[Label["sub"] = ++idx] = "SUB";
  Label[Label["mul"] = ++idx] = "MUL";
  Label[Label["div"] = ++idx] = "DIV";
  Label[Label["div_s"] = ++idx] = "DIV_S";
  Label[Label["div_u"] = ++idx] = "DIV_U";
  Label[Label["rem_s"] = ++idx] = "REM_S";
  Label[Label["rem_u"] = ++idx] = "REM_U";
  Label[Label["and"] = ++idx] = "AND";
  Label[Label["or"] = ++idx] = "OR";
  Label[Label["xor"] = ++idx] = "XOR";
  Label[Label["shl"] = ++idx] = "SHL";
  Label[Label["shr_s"] = ++idx] = "SHR_S";
  Label[Label["shr_u"] = ++idx] = "SHR_U";
  Label[Label["rotl"] = ++idx] = "ROTL";
  Label[Label["rotr"] = ++idx] = "ROTR";

  // relop
  Label[Label["eq"] = ++idx] = "EQ";
  Label[Label["ne"] = ++idx] = "NE";
  Label[Label["lt"] = ++idx] = "LT";
  Label[Label["lt_s"] = ++idx] = "LT_S";
  Label[Label["lt_u"] = ++idx] = "LT_U";
  Label[Label["le"] = ++idx] = "LE";
  Label[Label["le_s"] = ++idx] = "LE_S";
  Label[Label["le_u"] = ++idx] = "LE_U";
  Label[Label["gt"] = ++idx] = "GT";
  Label[Label["gt_s"] = ++idx] = "GT_S";
  Label[Label["gt_u"] = ++idx] = "GT_U";
  Label[Label["ge"] = ++idx] = "GE";
  Label[Label["ge_s"] = ++idx] = "GE_S";
  Label[Label["ge_u"] = ++idx] = "GE_U";

  // unary
  Label[Label["neg"] = ++idx] = "NEG";
  Label[Label["copysign"] = ++idx] = "COPYSIGN";
  Label[Label["ceil"] = ++idx] = "CEIL";
  Label[Label["floor"] = ++idx] = "FLOOR";
  Label[Label["trunc"] = ++idx] = "TRUNC";
  Label[Label["nearest"] = ++idx] = "NEAREST";
  Label[Label["clz"] = ++idx] = "CLZ";
  Label[Label["popcnt"] = ++idx] = "POPCNT";
  Label[Label["eqz"] = ++idx] = "EQZ";
  Label[Label["sqrt"] = ++idx] = "SQRT";
  Label[Label["min"] = ++idx] = "MIN";
  Label[Label["max"] = ++idx] = "MAX";
  Label[Label["abs"] = ++idx] = "ABS";

  generateKeyAccess(KeywordKind);

})(KeywordKind);

function generateKeyAccess(label) {
  let key = 0;
  let index = 0;
  let length = Object.keys(label).length;
  while (index < length) {
    key = (index + idx) - length + 1;
    if (label[key] !== void 0) {
      label[label[key]] = key;
    }
    ++index;
  };
};

export function getNameByLabel(kind) {
  if (TokenKind[kind] !== void 0) {
    return (TokenKind[kind]);
  }
  else if (PunctuatorKind[kind] !== void 0) {
    return (PunctuatorKind[kind]);
  }
  else if (KeywordKind[kind] !== void 0) {
    return (KeywordKind[kind]);
  }
  else if (NodeKind[kind] !== void 0) {
    return (NodeKind[kind]);
  }
  return (null);
};
