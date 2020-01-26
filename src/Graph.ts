import RDFNode from './RDFNode'
import NodeSet from './NodeSet'
import Triple from './Triple'

export default class Graph {
  protected childNodes: NodeSet = new NodeSet()
  protected triples: Triple[] = []

  constructor () {

  }

  hasNode(node: RDFNode) {
    // return this.childNodes.indexOf(node) !== -1
  }

  addNode (node: RDFNode): Store {
    // if (!this.hasNode(node)) {
    //   this.childNodes.push(node)
    // }
    // if (!node.hasStore(this)) {
    //   node.addStore(this)
    // }
    // return this
  }

  addNodes (nodes: RDFNode[]): Store {
    // nodes.forEach((node) => this.addNode(node))
    // return this
  }

  nodes (): NodeSet {
    // return this.childNodes
  }

  addTriple (triple: Triple): Store {
    // this.triples.push(triple)
    // return this
  }

  hasTriple (triple: Triple): boolean {
    // TODO: bad. lots of looping
    // return this.triples.some((t) => t === triple)
  }

  
}
