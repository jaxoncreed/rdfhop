import RDFNode from './RDFNode'
import Traversable from './Traversable'
import { InputAsNode } from './util/parseInputAsNode'
import Graph from './Graph'

// TODO: convert this to a set
export default class NodeSet extends Array<RDFNode> implements Traversable {
  constructor (...items: RDFNode[]) {
    super(...items)
  }

  out (predicate: InputAsNode, graphs?: Graph[]): NodeSet {

  }

  in (predicate: InputAsNode, graphs?: Graph[]): NodeSet {

  }

  outAll (graphs?: Graph[]): NodeSet {

  }

  inAll (graphs?: Graph[]): NodeSet {

  }

  outPredicate (graphs?: Graph[]): NodeSet {

  }

  inPredicate (graphs?: Graph[]): NodeSet {
    
  }

  addOut (predicate: InputAsNode, object: InputAsNode, graphs?: Graph[]): NodeSet {

  }

  addIn (predicate: InputAsNode, subject: InputAsNode, graphs?: Graph[]): NodeSet {

  }

  deleteOut (predicate: InputAsNode, object: InputAsNode, graphs?: Graph[]): NodeSet {

  }

  deleteIn (predicate: InputAsNode, subject: InputAsNode, graphs?: Graph[]): NodeSet {

  }

  one (): RDFNode {

  }

  unique (): NodeSet {

  }

  union (...set: NodeSet): NodeSet {

  }

  difference (set: NodeSet): NodeSet {

  }
}