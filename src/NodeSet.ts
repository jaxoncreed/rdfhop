import RDFNode from './RDFNode'

// TODO: convert this to a set
export default class NodeSet extends Array<RDFNode> {
  constructor (...items: RDFNode[]) {
    super(...items)
  }

  unique (): NodeSet {

  }

}