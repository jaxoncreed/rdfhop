import Triple from './Triple'
import RDFNode from './RDFNode'

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

  constructor (name: string, parentGraph?: Graph) {
    
  }

  /**
   * Adds a given triple to the graph
   * @param triple The triple to add
   */
  addTriple (triple: Triple): Graph {

  }

  /**
   * Removes one triple from the graph. Note that there may be more that one identical triple on
   * the graph. To remove all identical triples use `removeAllTriples`
   * @param triple The tiple to remove
   */
  removeTriple (triple: Triple): Graph {

  }

  /**
   * Removes all identity triples from the graph
   * @param triple The triple to remove
   */
  removeAllTriples (triple: Triple): Graph {

  }

  /**
   * Performs a SPARQL ask query
   * @param query The ASK query
   */
  sparqlAsk (query: string): boolean {

  }

  /**
   * Performs a SPARQL select query
   * @param query The SELECT query
   */
  sparqlSelect (query: string): SPARQLSelectResult {

  }

  /**
   * Performs a SPARQL construct query
   * @param query The CONSTRUCT query
   */
  sparqlConstruct (query: string): Graph {

  }

  /**
   * Performs a SPARQL update query
   * @param query The UPDATE query
   */
  sparqlUpdate (query: string): void {

  }

  /**
   * Returns the number of times a certain triple appears in the graph
   * @param triple the triple to count
   */
  countTripleInstances (triple: Triple): number {

  }
}
