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
          this.body = null;
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

  static get TypeLiteral() {
    return (
      class TypeLiteral {
        constructor() {
          this.kind = Kind.TypeLiteral;
          this.value = null;
        }
      }
    );
  }

  static get If() {
    return (
      class If {
        constructor() {
          this.kind = Kind.If;
          this.condition = null;
          this.consequent = null;
          this.alternate = null;
        }
      }
    );
  }

  static get Return() {
    return (
      class Return {
        constructor() {
          this.kind = Kind.Return;
          this.argument = null;
        }
      }
    );
  }

  static get Select() {
    return (
      class Select {
        constructor() {
          this.kind = Kind.Select;
          this.condition = null;
          this.consequent = null;
          this.alternate = null;
        }
      }
    );
  }

  static get Call() {
    return (
      class Call {
        constructor() {
          this.kind = Kind.Call;
          this.id = null;
          this.expressions = null;
        }
      }
    );
  }

  static get Block() {
    return (
      class Block {
        constructor() {
          this.kind = Kind.Block;
          this.id = null;
          this.body = null;
        }
      }
    );
  }

  static get Loop() {
    return (
      class Loop {
        constructor() {
          this.kind = Kind.Loop;
          this.body = null;
        }
      }
    );
  }

  static get Break() {
    return (
      class Break {
        constructor() {
          this.kind = Kind.Break;
          this.id = null;
        }
      }
    );
  }

  static get BreakIf() {
    return (
      class BreakIf {
        constructor() {
          this.kind = Kind.BreakIf;
          this.id = null;
          this.condition = null;
        }
      }
    );
  }

  static get GetLocal() {
    return (
      class GetLocal {
        constructor() {
          this.kind = Kind.GetLocal;
          this.id = null;
        }
      }
    );
  }

  static get SetLocal() {
    return (
      class SetLocal {
        constructor() {
          this.kind = Kind.SetLocal;
          this.id = null;
          this.argument = null;
        }
      }
    );
  }

  static get Local() {
    return (
      class Local {
        constructor() {
          this.kind = Kind.Local;
          this.name = null;
          this.type = null;
        }
      }
    );
  }

  static get Unary() {
    return (
      class Unary {
        constructor() {
          this.kind = Kind.Unary;
          this.argument = null;
        }
      }
    );
  }

  static get Binary() {
    return (
      class Binary {
        constructor() {
          this.kind = Kind.Binary;
          this.left = null;
          this.right = null;
          this.operator = null;
        }
      }
    );
  }

  static get Constant() {
    return (
      class Constant {
        constructor() {
          this.kind = Kind.Constant;
          this.type = null;
          this.value = null;
        }
      }
    );
  }

  static get Memory() {
    return (
      class Memory {
        constructor() {
          this.kind = Kind.Memory;
          this.max = null;
          this.initial = null;
        }
      }
    );
  }

  static get Function() {
    return (
      class Function {
        constructor() {
          this.kind = Kind.Function;
          this.args = [];
          this.body = null;
          this.name = null;
          this.result = null;
        }
      }
    );
  }

  static get Export() {
    return (
      class Export {
        constructor() {
          this.kind = Kind.Export;
          this.name = null;
          this.id = null;
        }
      }
    );
  }

  static get Import() {
    return (
      class Import {
        constructor() {
          this.kind = Kind.Import;
          this.name = null;
        }
      }
    );
  }

  static get Parameter() {
    return (
      class Parameter {
        constructor() {
          this.kind = Kind.Parameter;
          this.name = null;
          this.type = null;
        }
      }
    );
  }

  static get Invoke() {
    return (
      class Invoke {
        constructor() {
          this.kind = Kind.Invoke;
          this.name = null;
        }
      }
    );
  }

  static get AssertReturn() {
    return (
      class AssertReturn {
        constructor() {
          this.kind = Kind.AssertReturn;
          this.invoke = null;
          this.argument = null;
        }
      }
    );
  }

  static get AssertTrap() {
    return (
      class AssertTrap {
        constructor() {
          this.kind = Kind.AssertTrap;
          this.message = null;
          this.argument = null;
        }
      }
    );
  }

}
