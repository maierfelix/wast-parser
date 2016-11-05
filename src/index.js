import Lexer from "./Lexer";
import Parser from "./Parser";

import * as labels from "./labels";

let lexer = new Lexer();
let parser = new Parser();
let parse = (str) => {

  let tokens = lexer.lex(str);
  //console.log(tokens);
  let ast = parser.parse(tokens);

  return (ast);

};

let fs = require("fs");
let path = "main.wast";
let input = fs.readFileSync(process.cwd() + "/" + path, "utf8");

((str) => {

  let ast = parse(str);
  //console.log(ast);
  fs.writeFileSync(path.replace("wast", "json"), JSON.stringify(ast, null, 2), "utf8");

})(input);

export default {
  Lexer: Lexer,
  Parser: Parser,
  parse: parse,
  labels: labels
};
