import { InputAsNode } from './util/parseInputAsNode'
import Graph from './Graph';
import NodeSet from './NodeSet';

export default interface Traversable {
  out (predicate: InputAsNode, graphs?: Graph[]): NodeSet
  in (predicate: InputAsNode, graphs?: Graph[]): NodeSet
  outAll (graphs?: Graph[]): NodeSet
  inAll (graphs?: Graph[]): NodeSet
  outPredicate (graphs?: Graph[]): NodeSet
  inPredicate (graphs?: Graph[]): NodeSet
  addOut (predicate: InputAsNode, object: InputAsNode, graphs?: Graph[]): Traversable
  addIn (predicate: InputAsNode, subject: InputAsNode, graphs?: Graph[]): Traversable
  deleteOut (predicate: InputAsNode, object: InputAsNode, graphs?: Graph[]): Traversable
  deleteIn (predicate: InputAsNode, subject: InputAsNode, graphs?: Graph[]): Traversable
}
