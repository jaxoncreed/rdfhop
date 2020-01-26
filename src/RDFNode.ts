import Graph from './Graph'
import NodeSet from './NodeSet'
import { InputAsNode } from './util/parseInputAsNode'
import Traversable from './Traversable'

/**
 * An abstract RDF node
 */
export default abstract class RDFNode implements Traversable {
  /**
   * The global graph with which this node is registered
   */
  private globalGraph: Graph

  constructor (globalGraph: Graph) {
    this.globalGraph = globalGraph
  }

  /**
   * Get all nodes that are the objects of the given predicate with this node
   * @param predicate The predicate pointing to the object
   * @param graphs Optionally restrict traversal to a particular set of graphs
   */
  out (predicate: InputAsNode, graphs?: Graph[]): NodeSet {

  }

  /**
   * Get all the nodes that point to this node via a certain predicate
   * @param predicate The predicate pointing to this node
   * @param graphs Optionally restrict traversal to a particular set of graphs
   */
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

  /**
   * Point to a given node from this node using a given predicate
   * @param predicate The predicate pointing to the given node
   * @param object The given node
   * @param graphs Optional restrict adding to a particular set of graphs
   */
  addOut (predicate: InputAsNode, object: InputAsNode, graphs?: Graph[]): RDFNode {

  }

  /**
   * Point from a given node to this node using a given predicate
   * @param predicate The predicate pointing to this node
   * @param subject The given node
   * @param graphs Optional restrict adding to a particular set of graphs
   */
  addIn (predicate: InputAsNode, subject: InputAsNode, graphs?: Graph[]): RDFNode {

  }

  /**
   * Delete one connection to a given node using a given predicate
   * @param predicate The given predicate pointing to the given node
   * @param object The given node
   * @param graphs Optional restrict removing from a particular set of graphs
   */
  deleteOut (predicate: InputAsNode, object: InputAsNode, graphs?: Graph[]): RDFNode {

  }

  /**
   * Delete one connection from a given node using a given predicate
   * @param predicate The given predicate pointing from the given node
   * @param subject The given node
   * @param graphs Optinally restrict removing from a particular set of graphs
   */
  deleteIn (predicate: InputAsNode, subject: InputAsNode, graphs?: Graph[]): RDFNode {
    
  }

  /**
   * Return the value of this node
   */
  abstract value (): any

  /**
   * Get the node type
   */
  abstract type (): 'named' | 'literal' | 'blank'


}