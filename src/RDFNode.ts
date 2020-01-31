import {
  Graph,
  NodeInput,
  GlobalGraph,
  NamedNode,
  Triple,
  getNode,
  NodeSet,
  Traversable
 } from './internal'

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
    const p = getNode(predicate, this.globalGraph)
    const map = (isIn) ? this.inMap : this.outMap
    let nodeList = map.get(p.value())
    if (graphs) {
      nodeList = nodeList.filter((node) => graphs.some((graph) => graph.hasNode(node)))
    }
    return NodeSet.create(...nodeList)
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
    return NodeSet.create(...predicates.reduce((aggSet: NodeSet, key) => aggSet.concat(method(key, graphs)), []))
  }

  outAll (graphs?: Graph[]): NodeSet {
    return this.traverseAllHelper(false, graphs)
  }

  inAll (graphs?: Graph[]): NodeSet {
    return this.traverseAllHelper(true, graphs)
  }

  private traversePredicateHelper (isIn: boolean, graphs?: Graph[]): NodeSet {
    const map = (isIn) ? this.inMap : this.outMap
    const predicates = Array.from(map.keys()).map(key => getNode(key, this.globalGraph))
    return NodeSet.create(...predicates)
  }

  outPredicate (graphs?: Graph[]): NodeSet {
    return this.traversePredicateHelper(false, graphs)
  }

  inPredicate (graphs?: Graph[]): NodeSet {
    return this.traversePredicateHelper(true, graphs)
  }

  private addHelper (isIn: boolean, predicate: NodeInput, subjectOrObject: NodeInput, graphs?: Graph[]): RDFNode {
    const p = getNode(predicate, this.globalGraph) as NamedNode
    const sOrO = getNode(subjectOrObject, this.globalGraph)
    const triple = (isIn) ? new Triple(sOrO, p, this) : new Triple(this, p, sOrO)
    this.reciprocateAdd(isIn, p, sOrO)
    // TODO: this is bad. it will add the same triple to the global graph is multiple graphs are provided
    if (graphs) {
      graphs.forEach(graph => graph.addTriple(triple))
    } else {
      this.globalGraph.addTriple(triple)
    }
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

  private deleteHelper (isIn: boolean, predicate: NodeInput, subjectOrObject: NodeInput, graphs?: Graph[]): RDFNode {
    const p = getNode(predicate, this.globalGraph) as NamedNode
    const sOrO = getNode(subjectOrObject, this.globalGraph)
    const triple = (isIn) ? new Triple(sOrO, p, this) : new Triple(this, p, sOrO)
    this.reciprocateDelete(isIn, p, sOrO)
    // TODO: this is bad it will delete multiple triples from global graph if more than one graph
    if (graphs) {
      graphs.forEach(graph => graph.addTriple(triple))
    } else {
      this.globalGraph.removeTriple(triple)
    }
    sOrO.reciprocateDelete(!isIn, p, this)
    return this
  }

  protected reciprocateDelete (isIn: boolean, predicate: NamedNode, subjectOrObject: RDFNode) {
    const map = (isIn) ? this.inMap : this.outMap
    if (map.has(predicate.value())) {
      const nodeIndex = map.get(predicate.value()).indexOf(subjectOrObject)
      if (nodeIndex) {
        map.get(predicate.value()).splice(nodeIndex, 1)
      }
    }
  }

  /**
   * Delete one connection to a given node using a given predicate
   * @param predicate The given predicate pointing to the given node
   * @param object The given node
   * @param graphs Optional restrict removing from a particular set of graphs
   */
  deleteOut (predicate: NodeInput, object: NodeInput, graphs?: Graph[]): RDFNode {
    return this.deleteHelper(false, predicate, object, graphs)
  }

  /**
   * Delete one connection from a given node using a given predicate
   * @param predicate The given predicate pointing from the given node
   * @param subject The given node
   * @param graphs Optinally restrict removing from a particular set of graphs
   */
  deleteIn (predicate: NodeInput, subject: NodeInput, graphs?: Graph[]): RDFNode {
    return this.deleteHelper(true, predicate, subject, graphs)
  }

  toString (): string {
    let str = `<${this.value()}>\n`
    this.outPredicate().forEach((predicate) => {
      this.out(predicate).forEach((object) => {
        str += `  <${predicate.value()}> <${object.value()}>\n`
      })
    })
    return str
  }

  /**
   * Return the value of this node
   */
  abstract value (): string

  /**
   * Get the node type
   */
  abstract type (): 'named' | 'literal' | 'blank'
}