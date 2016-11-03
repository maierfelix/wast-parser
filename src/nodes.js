import {
  NodeKind as Kind
} from "./labels";

export default class Node {

  constructor() {}

  static get Module() {
    return (
      class Module {
        constructor() {
          this.kind = Kind.Module;
          this.body = [];
        }
      }
    );
  }

  static get Literal() {
    return (
      class Literal {
        constructor() {
          this.kind = Kind.Literal;
          this.raw = null;
          this.type = null;
          this.value = null;
        }
      }
    );
  }

  static get IfStatement() {
    return (
      class IfStatement {
        constructor() {
          this.kind = Kind.IfStatement;
          this.condition = null;
          this.consequent = null;
          this.alternate = null;
        }
      }
    );
  }

  static get MemoryDeclaration() {
    return (
      class MemoryDeclaration {
        constructor() {
          this.kind = Kind.MemoryDeclaration;
          this.max = null;
          this.initial = null;
        }
      }
    );
  }

  static get FunctionDeclaration() {
    return (
      class FunctionDeclaration {
        constructor() {
          this.kind = Kind.FunctionDeclaration;
          this.args = [];
          this.body = [];
          this.name = null;
          this.result = null;
        }
      }
    );
  }

  static get ExportStatement() {
    return (
      class ExportStatement {
        constructor() {
          this.kind = Kind.ExportStatement;
          this.name = null;
          this.attachment = null;
        }
      }
    );
  }

}