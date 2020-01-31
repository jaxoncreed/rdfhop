import {
  Graph,
  NamedNode,
  Literal,
  LiteralInputValue,
  LiteralType,
  BlankNode
} from './internal'

/**
 * A global grpah is the top level graph for a graph heirachy. It is responsible for keeping track
 * of global nodes and graphs
 */
export default class GlobalGraph extends Graph {
  private graphs: Map<string, Graph> = new Map<string, Graph>()
  private namedNodes: Map<string, NamedNode> = new Map<string, NamedNode>()
  private literals: Map<string, Literal> = new Map<string, Literal>()

  constructor () {
    super('')
  }

  /**
   * Creates a graph and registers the graph name so that this is the one gloabal instance of a
   * graph with the given name.
   * @param name The graph's name
   */
  graph (name: string): Graph {
    if (this.graphs.get(name)) {
      return this.graphs.get(name)
    }
    const graph = new Graph(name, this, this)
    this.graphs.set(name, graph)
    return graph
  }

  /**
   * Creates a named node and registers it so that this is the one global instance of a node with
   * a given name
   * @param name 
   */
  namedNode (nodeIdentifier: string | URL): NamedNode  {
    const potentialNode = new NamedNode(nodeIdentifier, this)
    if (this.namedNodes.has(potentialNode.value())) {
      return this.namedNodes.get(potentialNode.value())
    }
    this.namedNodes.set(potentialNode.value(), potentialNode)
    return potentialNode
  }

  /**
   * Creates a blank node and registers it so that it can be found when searched for. Because blank
   * nodes do no have names, there is no need to ensure this is the only instance of it.
   */
  blankNode (): BlankNode {
    return new BlankNode(this)
  }

  /**
   * Creates a literal and registers it so that it is the unique instance of a literal of this value
   * @param value The real value of the literal
   */
  literal (value: LiteralInputValue, type?: LiteralType): Literal {
    const potentialNode = new Literal(this, value, type)
    if (this.literals.has(potentialNode.value())) {
      return this.literals.get(potentialNode.value())
    }
    this.literals.set(potentialNode.value(), potentialNode)
    return potentialNode
  }
}