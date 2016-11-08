import Reader from "./Reader";
import Writer from "./Writer";

class Binary {
  constructor() {
    this.reader = new Reader();
    this.writer = new Writer();
  }
  read(ast) {
    return (this.reader.read(ast));
  }
  write(ast) {
    return (this.writer.write(ast));
  }
} Binary = new Binary();

export default Binary;
