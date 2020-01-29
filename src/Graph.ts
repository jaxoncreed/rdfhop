import Triple from './Triple'
import RDFNode from './RDFNode'
import NodeSet from './NodeSet'

export type SPARQLSelectResult = { [key: string]: RDFNode }[]

/**
 * A class to represent RDF Graphs. Graphs contain an adjecency list made up of triples. In RDFHop,
 * a graph is aware of all subject nodes, predicate nodes, and object nodes it contains.
 */
export default class Graph {
  /**
   * The name of the graph
   */
  public readonly name: string
  /**
   * The parent graph for this graph
   */
  private parentGraph?: Graph
  /**
   * The global graph with which this graph is registered. It may or may not be the parent graph for
   * this graph
   */
  private globalGraph?: Graph
  private tripleCount: Map<string, { triple: Triple, count: number }> = new Map<string, { triple: Triple, count: number }>()

  constructor (name?: string, globalGraph?: Graph, parentGraph?: Graph) {
    this.name = name
    this.globalGraph = globalGraph
    this.parentGraph = parentGraph
  }

  /**
   * Adds a given triple to the graph
   * @param triple The triple to add
   */
  addTriple (triple: Triple): Graph {
    this.parentGraph.addTriple(triple)
    const tripleHash = triple.hash()
    if (this.tripleCount.get(tripleHash)) {
      this.tripleCount.get(tripleHash).count++
    } else {
      this.tripleCount.set(tripleHash, { triple, count: 1 })
    }
    return this
  }

  /**
   * Removes one triple from the graph. Note that there may be more that one identical triple on
   * the graph. To remove all identical triples use `removeAllTriples`
   * @param triple The tiple to remove
   */
  removeTriple (triple: Triple): Graph {
    this.parentGraph.removeTriple(triple)
    const tripleHash = triple.hash() 
    this.tripleCount.get(tripleHash).count--
    if (this.tripleCount.get(tripleHash).count <= 0) {
      this.tripleCount.delete(tripleHash)
    }
    return this
  }

  /**
   * Removes all identity triples from the graph
   * @param triple The triple to remove
   */
  removeAllTriples (triple: Triple): Graph {
    this.tripleCount.forEach(({ triple, count }, key) => {
      this.tripleCount.delete(key)
      for (let i = 0; i < count; i++) {
        this.parentGraph.removeTriple(triple)
      }
    })
    return this
  }

  /**
   * Performs a SPARQL ask query
   * @param query The ASK query
   */
  sparqlAsk (query: string): boolean {
    throw new Error('Not Implemented')
  }

  /**
   * Performs a SPARQL select query
   * @param query The SELECT query
   */
  sparqlSelect (query: string): SPARQLSelectResult {
    throw new Error('Not Implemented')
  }

  /**
   * Performs a SPARQL construct query
   * @param query The CONSTRUCT query
   */
  sparqlConstruct (query: string): Graph {
    throw new Error('Not Implemented')
  }

  /**
   * Performs a SPARQL update query
   * @param query The UPDATE query
   */
  sparqlUpdate (query: string): void {
    throw new Error('Not Implemented')
  }

  /**
   * Returns the number of times a certain triple appears in the graph
   * @param triple the triple to count
   */
  countTripleInstances (triple: Triple): number {
    return this.tripleCount.get(triple.hash()).count
  }

  nodes (): NodeSet {
    const nodeSet = new NodeSet()
    this.tripleCount.forEach(({ triple }) => {
      nodeSet.addUniqueNode(triple.s)
      nodeSet.addUniqueNode(triple.o)
    })
    return nodeSet
  }

  hasNode (rdfNode: RDFNode): boolean {
    return Array.from(this.tripleCount.entries()).some(([key, { triple }]) => {
      return rdfNode === triple.o || rdfNode === triple.s
    })
  }
}
