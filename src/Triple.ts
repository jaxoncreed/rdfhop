/**
 * TODO: consider replacing this with RDF ext
 */

import RDFNode from './RDFNode'
import NamedNode from './NamedNode'

export default class Triple {
  public readonly s: RDFNode
  public readonly p: NamedNode
  public readonly o: RDFNode
  constructor (subject: RDFNode, predicate: NamedNode, object: RDFNode) {
    this.s = subject
    this.p = predicate
    this.o = object
  }

  hash (): string {
    return `<${this.s.value()}> <${this.p.value()}> <${this.o.value()}>`
  }
}