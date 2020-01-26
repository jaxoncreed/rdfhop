import RDFNode from './RDFNode'

export default class NamedNode extends RDFNode {
  constructor (name: string | URL) {

  }

  canBePredicate () {
    return true
  }
}