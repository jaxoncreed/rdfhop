import RDFNode from './RDFNode'
import GlobalGraph from './GlobalGraph';

export default class NamedNode extends RDFNode {
  private identifier: string
  constructor (name: string | URL, globalGraph: GlobalGraph) {
    super(globalGraph)
    if (name instanceof URL) {
      this.identifier = name.toString()
    } else {
      try {
        new URL(name)
        this.identifier = name
      } catch (err) {
        throw new Error('A named node\'s identifier must be a URL')
      }
    }
  }

  type () {
    return 'named' as 'named'
  }

  value () {
    return this.identifier
  }
}