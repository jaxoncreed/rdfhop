import RDFNode from './RDFNode'

// TODO: expand with literal types: https://www.w3.org/2011/rdf-wg/wiki/XSD_Datatypes
export type LiteralInputValue = number | string | boolean
export type LiteralType = 'number' | 'string' | 'boolean'

export default class Literal extends RDFNode {
  constructor (value: LiteralInputValue, type?: LiteralType) {

  }

  canBePredicate () {
    return false
  }
}
