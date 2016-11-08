import {
  NodeKind,
  TokenKind as TT,
  KeywordKind as KK,
  PunctuatorKind as PP,
  getNameByLabel
} from "../labels";

/**
 * @class Scope
 * @export
 */
export default class Scope {

  /**
   * @param {Node} scope
   * @param {Node} parent
   * @constructor
   */
  constructor(scope, parent) {

    /**
     * Scope
     * @type {Node}
     */
    this.scope = scope;

    /**
     * Parent
     * @type {Node}
     */
    this.parent = parent;

    /**
     * Symbol table
     * @type {Object}
     */
    this.table = {};

  }

  /**
   * @param {String} name
   * @return {Node}
   */
  resolve(name) {
    let local = this.table[name];
    if (local !== void 0) return (local);
    else {
      if (this.parent !== null) {
        return (this.parent.resolve(name));
      }
    }
    return (null);
  }

  /**
   * @param {String} name
   * @param {Node} node
   */
  register(name, node) {
    this.table[name] = node;
  }

}
