import RDFNode from './RDFNode'
import GlobalGraph from './GlobalGraph'

// TODO: expand with literal types: https://www.w3.org/2011/rdf-wg/wiki/XSD_Datatypes
export type LiteralInputValue = number | string | boolean
export type LiteralType = 'number' | 'string' | 'boolean'

export default class Literal extends RDFNode {
  private storedValue: LiteralInputValue
  private valueType: LiteralType

  constructor (globalGraph: GlobalGraph, value: LiteralInputValue, type?: LiteralType) {
    super(globalGraph)
    this.storedValue = value
    this.valueType = type || this.assumeTypeFromValue(value)
  }

  private assumeTypeFromValue(value: LiteralInputValue) {
    switch (typeof value) {
      case 'string':
        return 'string'
      case 'number':
        return 'number'
      case 'boolean':
        return 'boolean'
      default:
        throw new Error(`"${value}" is not a valid literal`)
    }
  }

  type () {
    return 'literal' as 'literal'
  }

  value () {
    return `${this.value}^^xsd:${this.valueType}`
  }

  rawValue (): any {
    return this.storedValue
  }
}
