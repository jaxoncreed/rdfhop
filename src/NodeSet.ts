import {
  RDFNode,
  Traversable,
  Graph,
  NodeInput
} from './internal'

// TODO: convert this to a set
export default class NodeSet extends Array<RDFNode> implements Traversable {
  constructor (...items: RDFNode[]) {
    super(...items)
  }

  private applyToAllNodes (functionToApply: (node: RDFNode) => any) {
    return NodeSet.create(...this.reduce((aggNodes: RDFNode[], node: RDFNode) => aggNodes.concat(functionToApply(node)), []))
  }

  out (predicate: NodeInput, graphs?: Graph[]): NodeSet {
    return this.applyToAllNodes((node: RDFNode) => node.out(predicate, graphs))
  }

  in (predicate: NodeInput, graphs?: Graph[]): NodeSet {
    return this.applyToAllNodes((node: RDFNode) => node.in(predicate, graphs))
  }

  outAll (graphs?: Graph[]): NodeSet {
    return this.applyToAllNodes((node: RDFNode) => node.outAll(graphs))
  }

  inAll (graphs?: Graph[]): NodeSet {
    return this.applyToAllNodes((node: RDFNode) => node.inAll(graphs))
  }

  outPredicate (graphs?: Graph[]): NodeSet {
    return this.applyToAllNodes((node: RDFNode) => node.outPredicate(graphs))
  }

  inPredicate (graphs?: Graph[]): NodeSet {
    return this.applyToAllNodes((node: RDFNode) => node.inPredicate(graphs))
  }

  addOut (predicate: NodeInput, object: NodeInput, graphs?: Graph[]): NodeSet {
    this.applyToAllNodes((node: RDFNode) => node.addOut(predicate, object, graphs))
    return this
  }

  addIn (predicate: NodeInput, subject: NodeInput, graphs?: Graph[]): NodeSet {
    this.applyToAllNodes((node: RDFNode) => node.addIn(predicate, subject, graphs))
    return this
  }

  deleteOut (predicate: NodeInput, object: NodeInput, graphs?: Graph[]): NodeSet {
    this.applyToAllNodes((node: RDFNode) => node.deleteOut(predicate, object, graphs))
    return this
  }

  deleteIn (predicate: NodeInput, subject: NodeInput, graphs?: Graph[]): NodeSet {
    this.applyToAllNodes((node: RDFNode) => node.deleteIn(predicate, subject, graphs))
    return this
  }

  one (): RDFNode | null {
    return this[0]
  }

  unique (): NodeSet {
    throw new Error('Not Implemented')
  }

  union (...set: NodeSet): NodeSet {
    throw new Error('Not Implemented')
  }

  difference (set: NodeSet): NodeSet {
    throw new Error('Not Implemented')
  }

  addNode (node: RDFNode): NodeSet {
    this.push(node)
    return this
  }

  addUniqueNode (node: RDFNode): NodeSet {
    if (!this.some((containedNode) => containedNode === node)) {
      this.push(node)
    }
    return this
  }

  static create (...items: RDFNode[]): NodeSet {
    const nodeSet: NodeSet = Object.create(NodeSet.prototype)
    items.forEach((item) => nodeSet.push(item))
    return nodeSet
  }
}
