import {
  TokenKind,
  KeywordKind,
  PunctuatorKind
} from "../labels";

class Range {
  constructor(line, start, end) {
    this.line = line;
    this.start = start;
    this.end = end;
  }
}

class Token {
  constructor(kind, value, range) {
    this.kind = kind;
    this.value = value;
    this.range = range;
  }
}

export default class Lexer {

  constructor() {
    this.idx = 0;
    this.line = 0;
    this.column = 0;
    this.out = [];
    this.src = null;
    this.length = 0;
  }

  reset() {
    this.idx = -1;
    this.line = 1;
    this.column = 0;
    this.out = [];
  }

  lex(src) {
    this.reset();
    this.src = src;
    this.length = src.length;
    let cc = 0;
    while (cc = this.next()) {
      if (this.isWhitespace(cc) !== false) continue;
      // ignore token, increment line and reset column idx
      if (this.isLineTerminator(cc) !== false) {
        this.next();
        this.line++;
        this.column = 0;
        continue;
      }
      this.scanToken(cc);
    };
    this.pushEOF();
    return (this.out);
  }

  scanToken(cc) {
    // alpha most common, so placed here
    if (this.isAlpha(cc) || this.isDollar(cc)) {
      this.scanAlpha(cc);
    }
    // numeric, allow dollar sign at begin
    else if (this.isNumeric(cc) || this.isNumericPreSign(cc) || this.isDollar(cc)) {
      this.scanDigit(cc);
    }
    // punctuator
    else if (this.isPunctuator(String.fromCharCode(cc))) {
      this.scanPunctuator(cc);
    }
    // quoted string
    else if (this.isQuote(cc)) {
      this.scanString(cc);
    }
    // comment
    else if (this.isSemicolon(cc)) {
      this.scanComment(cc);
    }
    // unexpected
    else {
      throw new Error(`Unexpected token ${String.fromCharCode(cc)}`);
    }
  }

  scanAlpha(cc) {
    let start = this.idx;
    while (cc = this.next()) {
      if (this.isNonAlpha(cc)) break;
    };
    let value = this.src.slice(start, this.idx);
    let kind = this.isKeyword(value) ? KeywordKind[value] : TokenKind.Identifier;
    this.column--;
    this.pushToken(kind, start, value);
    this.idx--;
  }

  scanDigit(cc) {
    let start = this.idx;
    let isHex = this.src[this.idx+1] === "x" ? true && ++this.idx : false;
    let dotCounter = 0;
    while (cc = this.next()) {
      if (!this.isDigit(cc) && !this.isNumericPreSign(cc) && cc !== 101) {
        // allow one dot for non hex digits
        if (this.isDot(cc) && !isHex && dotCounter <= 0) {
          dotCounter++;
        }
        else break;
      }
    };
    let kind = TokenKind.NumericLiteral;
    let value = this.src.slice(start, this.idx);
    this.pushToken(kind, start, value);
    this.idx--;
  }

  scanPunctuator(cc) {
    let ch = String.fromCharCode(cc);
    if (this.isPunctuator(ch)) {
      let kind = PunctuatorKind[ch];
      this.pushToken(kind, this.idx-1, ch);
    }
  }

  scanString(cc) {
    let start = this.idx;
    while (cc = this.next()) {
      if (this.isQuote(cc)) break;
    };
    let kind = TokenKind.StringLiteral;
    let value = this.src.slice(start+1, this.idx);
    this.pushToken(kind, start, value);
  }

  scanComment(cc) {
    cc = this.next();
    if (!this.isSemicolon(cc)) {
      throw new Error("Invalid comment");
    }
    while (cc = this.next()) {
      if (this.isLineTerminator(cc)) break;
    };
    this.line++;
    this.idx--;
  }

  next() {
    if (++this.idx < this.length) {
      this.column++;
      return (this.src[this.idx].charCodeAt(0) | 0);
    } else {
      return (0);
    }
  }

  isKeyword(str) {
    return (KeywordKind[str] !== void 0);
  }

  isPunctuator(str) {
    return (PunctuatorKind[str] !== void 0);
  }

  isNonAlpha(cc) {
    return (
      this.isWhitespace(cc) ||
      this.isLineTerminator(cc) ||
      this.isQuote(cc) ||
      this.isSemicolon(cc) ||
      this.isPunctuator(String.fromCharCode(cc))
    );
  }

  isDot(cc) {
    return (
      cc === 46
    );
  }

  isDollar(cc) {
    return (
      cc === 36
    );
  }

  isSemicolon(cc) {
    return (
      cc === 59
    );
  }

  isAlpha(cc) {
    return (
      cc >= 65 && cc <= 90 ||
      cc >= 97 && cc <= 122 ||
      cc === 95
    );
  }

  isNumeric(cc) {
    return (
      cc >= 48 && cc <= 57
    );
  }

  isNumericPreSign(cc) {
    return (
      cc === 45 ||
      cc === 43
    );
  }

  isDigit(cc) {
    return (
      this.isNumeric(cc) ||
      cc >= 65 && cc <= 70 ||
      cc >= 97 && cc <= 102
    );
  }

  isQuote(cc) {
    return (
      cc === 34
    );
  }

  isWhitespace(cc) {
    return (
      cc === 9 ||
      cc === 11 ||
      cc === 12 ||
      cc === 32 ||
      cc === 160
    );
  }

  isLineTerminator(cc) {
    return (
      cc === 10 ||
      cc === 13
    );
  }

  pushToken(kind, start, value) {
    let length = (this.idx - start)-1;
    let begin = (this.column - length);
    let end = begin + length;
    let range = new Range(this.line, begin-1, end);
    let token = new Token(kind, value, range);
    this.out.push(token);
  }

  pushEOF() {
    let kind = TokenKind.EOF;
    let value = null;
    this.pushToken(kind, 0, value);
  }

}
