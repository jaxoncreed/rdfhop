import parseInputAsNode, { InputAsNode, parseInputAsPredicateNode } from './util/parseInputAsNode'
import RDFNode from './RDFNode'
import NamedNode from './NamedNode'

export default class Triple {
  public readonly s: RDFNode
  public readonly p: NamedNode
  public readonly o: RDFNode
  constructor (subject: InputAsNode, predicate: InputAsNode, object: InputAsNode) {
    this.s = parseInputAsNode(subject)
    this.p = parseInputAsPredicateNode(predicate)
    this.o = parseInputAsNode(object)
  }
}