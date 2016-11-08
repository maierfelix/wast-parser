/**
 * @class BinaryArray
 */
export default class BinaryArray {

  constructor() {
    this.array = [];
  }

  push(data) {
    this.array.push(data);
  }

  get length() {
    return (this.array.length);
  }

  // append 1byte int
  writei8(value) {
    this.push(value & 0xff);
  }

  // append 2byte int
  writei16(value) {
    this.push(value & 0xff);
    this.push(value >> 8 & 0xff);
  }

  // append 4byte int
  writei32(value) {
    this.push(value & 0xff);
    this.push(value >> 8 & 0xff);
    this.push(value >> 16 & 0xff);
    this.push(value >> 24 & 0xff);
  }

  encode() {
    let uint8a = new Uint8Array(this.array);
    return (new Buffer(uint8a));
  }

  writeASCII(str) {
    let utf8 = unescape(encodeURIComponent(str));
    // write string length
    this.writeiuk(utf8.length);
    // write actual string
    let ii = 0;
    let length = utf8.length;
    for (; ii < length; ii++) {
      this.writei8(utf8.charCodeAt(ii));
    }
  }

  writeiuk(val) {
    while (true) {
      let v = val & 0xff;
      val = val >>> 7;
      if (val === 0) {
        this.writei8(v);
        break;
      }
      this.writei8(v | 0x80);
    };
  }

  beginSection(name) {
    // write section name
    this.writeASCII(name);
    let offset = this.length;
    return (offset);
  }

  endSection(offset) {
    let length = this.length - offset;
    // write section length
    this.array[offset] = length;
  }

}