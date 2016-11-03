import Lexer from "./Lexer";
import Parser from "./Parser";

import * as labels from "./labels";

let lexer = new Lexer();
let parser = new Parser();
let parse = (str) => {

  let tokens = lexer.lex(str);
  let ast = parser.parse(tokens);
  console.log(ast);

  return (ast);

};

let path = "main.wast";
let input = require("fs").readFileSync(process.cwd() + "/" + path, "utf8");

((str) => {

  module.exports = {
    Lexer: Lexer,
    Parser: Parser,
    parse: parse,
    labels: labels
  };

  let ast = parse(str);

})(input);