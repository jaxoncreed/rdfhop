import Graph from './Graph'
import NodeSet from './NodeSet'
import Traversable from './Traversable'
import NodeInput from './NodeInput'
import NamedNode from './NamedNode'
import Literal, { LiteralType } from './Literal'
import GlobalGraph from './GlobalGraph'
import Triple from './Triple'

/**
 * An abstract RDF node
 */
export default abstract class RDFNode implements Traversable {
  /**
   * The global graph with which this node is registered
   */
  private globalGraph: GlobalGraph
  private inMap: Map<string, RDFNode[]> = new Map<string, RDFNode[]>()
  private outMap: Map<string, RDFNode[]> = new Map<string, RDFNode[]>()

  constructor (globalGraph: GlobalGraph) {
    this.globalGraph = globalGraph
  }

  private traverseHelper (isIn: boolean, predicate: NodeInput, graphs?: Graph[]): NodeSet {
    const p = RDFNode.fromNodeInput(predicate, this.globalGraph)
    const map = (isIn) ? this.inMap : this.outMap
    let nodeList = map.get(p.value())
    if (graphs) {
      nodeList = nodeList.filter((node) => graphs.some((graph) => graph.hasNode(node)))
    }
    return new NodeSet(...nodeList)
  }

  /**
   * Get all nodes that are the objects of the given predicate with this node
   * @param predicate The predicate pointing to the object
   * @param graphs Optionally restrict traversal to a particular set of graphs
   */
  out (predicate: NodeInput, graphs?: Graph[]): NodeSet {
    return this.traverseHelper(false, predicate, graphs) 
  }

  /**
   * Get all the nodes that point to this node via a certain predicate
   * @param predicate The predicate pointing to this node
   * @param graphs Optionally restrict traversal to a particular set of graphs
   */
  in (predicate: NodeInput, graphs?: Graph[]): NodeSet {
    return this.traverseHelper(true, predicate, graphs)
  }

  private traverseAllHelper (isIn: boolean, graphs?: Graph[]): NodeSet {
    const map = (isIn) ? this.inMap : this.outMap
    const method = (isIn) ? this.in : this.out
    const predicates = Array.from(map.keys())
    return new NodeSet(...predicates.reduce((aggSet: NodeSet, key) => aggSet.concat(method(key, graphs)), []))
  }

  outAll (graphs?: Graph[]): NodeSet {
    return this.traverseAllHelper(false, graphs)
  }

  inAll (graphs?: Graph[]): NodeSet {
    return this.traverseAllHelper(true, graphs)
  }

  private traversePredicateHelper (isIn: boolean, graphs?: Graph[]): NodeSet {
    const map = (isIn) ? this.inMap : this.outMap
    const predicates = Array.from(map.keys()).map(key => RDFNode.fromNodeInput(key, this.globalGraph))
    return new NodeSet(...predicates)
  }

  outPredicate (graphs?: Graph[]): NodeSet {
    return this.traversePredicateHelper(false, graphs)
  }

  inPredicate (graphs?: Graph[]): NodeSet {
    return this.traversePredicateHelper(true, graphs)
  }

  private addHelper (isIn: boolean, predicate: NodeInput, subjectOrObject: NodeInput, graphs?: Graph[]): RDFNode {
    const p = RDFNode.fromNodeInput(predicate, this.globalGraph) as NamedNode
    const sOrO = RDFNode.fromNodeInput(subjectOrObject, this.globalGraph)
    const triple = (isIn) ? new Triple(sOrO, p, this) : new Triple(this, p, sOrO)
    this.reciprocateAdd(isIn, p, sOrO)
    this.globalGraph.addTriple(triple)
    sOrO.reciprocateAdd(!isIn, p, this)
    return this
  }

  protected reciprocateAdd (isIn: boolean, predicate: NamedNode, subjectOrObject: RDFNode) {
    const map = (isIn) ? this.inMap : this.outMap
    if (!map.has(predicate.value())) {
      map.set(predicate.value(), [ subjectOrObject ])
    } else {
      map.get(predicate.value()).push(subjectOrObject)
    }
  }

  /**
   * Point to a given node from this node using a given predicate
   * @param predicate The predicate pointing to the given node
   * @param object The given node
   * @param graphs Optional restrict adding to a particular set of graphs
   */
  addOut (predicate: NodeInput, object: NodeInput, graphs?: Graph[]): RDFNode {
    return this.addHelper(false, predicate, object, graphs)
  }

  /**
   * Point from a given node to this node using a given predicate
   * @param predicate The predicate pointing to this node
   * @param subject The given node
   * @param graphs Optional restrict adding to a particular set of graphs
   */
  addIn (predicate: NodeInput, subject: NodeInput, graphs?: Graph[]): RDFNode {
    return this.addHelper(true, predicate, subject, graphs)
  }

  /**
   * Delete one connection to a given node using a given predicate
   * @param predicate The given predicate pointing to the given node
   * @param object The given node
   * @param graphs Optional restrict removing from a particular set of graphs
   */
  deleteOut (predicate: NodeInput, object: NodeInput, graphs?: Graph[]): RDFNode {
    throw new Error('Not Implemented')
  }

  /**
   * Delete one connection from a given node using a given predicate
   * @param predicate The given predicate pointing from the given node
   * @param subject The given node
   * @param graphs Optinally restrict removing from a particular set of graphs
   */
  deleteIn (predicate: NodeInput, subject: NodeInput, graphs?: Graph[]): RDFNode {
    throw new Error('Not Implemented')
  }

  /**
   * Return the value of this node
   */
  abstract value (): string

  /**
   * Get the node type
   */
  abstract type (): 'named' | 'literal' | 'blank'

  static fromNodeInput(nodeInput: NodeInput, globalGraph: GlobalGraph, valueType?: LiteralType) {
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


}