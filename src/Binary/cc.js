import {
  KeywordKind as KK
} from "../labels";

let getOperatorCode = (kind) => {
  switch (kind) {
    case KK.ADD:
      return (0x6a);
    break;
  };
};

export default {
  getOperatorCode,
  WASM_MAGIC_COOKIE: 0x6d736100,
  WASM_BINARY_VERSION: 13
}
