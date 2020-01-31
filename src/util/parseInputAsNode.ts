import RDFNode from '../RDFNode'
import NamedNode from '../NamedNode'

export type InputAsNode = string | URL | RDFNode

export default function parseInputAsNode (input: InputAsNode): RDFNode {
  throw new Error('Not Implemented')
}

export function parseInputAsPredicateNode (input: InputAsNode): NamedNode {
  throw new Error('Not Implemented')
}