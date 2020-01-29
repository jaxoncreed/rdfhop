import RDFNode from './RDFNode'

export default class BlankNode extends RDFNode {
  type () {
    return 'blank' as 'blank'
  }

  value () {
    return ''
  }
}
