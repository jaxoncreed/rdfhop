import GlobalGraph from './GlobalGraph'
export {default as Hopper} from './GlobalGraph'
export {default as Graph} from './Graph';
export {default as NodeSet} from './NodeSet'
export {default as Literal} from './Literal'
export {default as NamedNode} from './NamedNode'
export {default as BlankNode} from './BlankNode'
export {default as RDFNode} from './RDFNode'

const hop: GlobalGraph = new GlobalGraph()

export default hop
