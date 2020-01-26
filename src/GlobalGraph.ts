import Graph from './Graph'
import { InputAsNode } from './util/parseInputAsNode';
import NamedNode from './NamedNode';
import Literal, { LiteralInputValue } from './Literal';
import BlankNode from './BlankNode';

/**
 * A global grpah is the top level graph for a graph heirachy. It is responsible for keeping track
 * of global nodes and graphs
 */
export default class GlobalGraph extends Graph {

  constructor () {
    super('')
  }

  /**
   * Creates a graph and registers the graph name so that this is the one gloabal instance of a
   * graph with the given name.
   * @param name The graph's name
   */
  graph (name: string): Graph {

  }

  /**
   * Creates a named node and registers it so that this is the one global instance of a node with
   * a given name
   * @param name 
   */
  namedNode (name: InputAsNode): NamedNode  {

  }

  /**
   * Creates a blank node and registers it so that it can be found when searched for. Because blank
   * nodes do no have names, there is no need to ensure this is the only instance of it.
   */
  blankNode (): BlankNode {

  }

  /**
   * Creates a literal and registers it so that it is the unique instance of a literal of this value
   * @param value The real value of the literal
   */
  literal (value: LiteralInputValue): Literal {

  }
}