import {
  Graph,
  NodeInput,
  NodeSet
} from './internal'

export default interface Traversable {
  out (predicate: NodeInput, graphs?: Graph[]): NodeSet
  in (predicate: NodeInput, graphs?: Graph[]): NodeSet
  outAll (graphs?: Graph[]): NodeSet
  inAll (graphs?: Graph[]): NodeSet
  outPredicate (graphs?: Graph[]): NodeSet
  inPredicate (graphs?: Graph[]): NodeSet
  addOut (predicate: NodeInput, object: NodeInput, graphs?: Graph[]): Traversable
  addIn (predicate: NodeInput, subject: NodeInput, graphs?: Graph[]): Traversable
  deleteOut (predicate: NodeInput, object: NodeInput, graphs?: Graph[]): Traversable
  deleteIn (predicate: NodeInput, subject: NodeInput, graphs?: Graph[]): Traversable
}
