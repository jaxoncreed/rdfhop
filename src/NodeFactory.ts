import {
  RDFNode,
  NodeInput,
  GlobalGraph,
  LiteralType,
  Literal,
  NamedNode
} from './internal'

export default function getNode(nodeInput: NodeInput, globalGraph: GlobalGraph, valueType?: LiteralType): RDFNode {
  if (nodeInput instanceof RDFNode) {
    return nodeInput
  } else if (nodeInput instanceof URL) {
    return new NamedNode(nodeInput.toString(), globalGraph)
  } else if (typeof nodeInput === 'string' && !valueType) {
    try {
      new URL(nodeInput)
      return new NamedNode(nodeInput, globalGraph)
    } catch (err) {
      return new Literal(globalGraph, nodeInput, valueType)
    }
  } else {
    return new Literal(globalGraph, nodeInput, valueType)
  }
}