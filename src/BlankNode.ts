import { RDFNode } from './internal'

export default class BlankNode extends RDFNode {
  type () {
    return 'blank' as 'blank'
  }

  value () {
    return ''
  }
}
