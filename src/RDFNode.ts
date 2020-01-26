import parseInputAsNode, { InputAsNode, parseInputAsPredicateNode } from './util/parseInputAsNode'
import NodeSet from './NodeSet'
import Store from './Graph'
import Triple from './Triple'

type TripleMap = { [key: string]: Triple[] } & Object

export default abstract class RDFNode {
  private outMap: TripleMap = {}
  private inMap: TripleMap = {}
  private parentStores: Store[]

  constructor () {
    
  }

  abstract canBePredicate (): boolean

  private addHelper (
    isIn: boolean,
    shouldAskPairToReciprocate: boolean,
    predicate: InputAsNode,
    subjectOrObject: InputAsNode,
    stores?: Store[]
  ): void {
    const p = parseInputAsPredicateNode(predicate)
    const sOrO = parseInputAsNode(subjectOrObject)
    const triple = (isIn) ? new Triple(sOrO, p, this) : new Triple(this, p, sOrO)
    const map = (isIn) ? this.inMap : this.outMap
    if (map[p.value()]) {
      map[p.value()].push(triple)
    } else {
      map[p.value()] = [ triple ]
    }
    const storesToUpdate = stores || this.parentStores
    storesToUpdate.forEach((store) => store.addTriple(triple))
    if (shouldAskPairToReciprocate) {
      if (isIn) {
        sOrO 
      } else {

      }
    }
  }

  protected reciprocateOut (predicate: InputAsNode, object: InputAsNode, storesCompleted: Store[]) {

  }

  protected reciprocateIn (pre)

  addOut (predicate: InputAsNode, object: InputAsNode, stores?: Store[]): RDFNode {
    this.addHelper(false, predicate, object, stores)
    return this
  }

  addIn (predicate: InputAsNode, subject: InputAsNode, stores?: Store[]): RDFNode {
    this.addHelper(true, predicate, subject, stores)
    return this
  }

  private getHelper(isIn: boolean, predicate?: InputAsNode, stores?: Store[]): NodeSet {
    const map: TripleMap = (isIn) ? this.inMap : this.outMap
    let relevantTriples: Triple[] = (predicate) ?
      map[parseInputAsPredicateNode(predicate).value()] :
      map.values().flat()
    if (stores) {
      // TODO: Bad n * m * o
      relevantTriples = relevantTriples.filter(
        (triple) => stores.some(
          (store) => store.hasTriple(triple)
        )
      )
    }
    return new NodeSet(...relevantTriples.map(t => (isIn) ? t.s : t.p))

  }

  out (predicate?: InputAsNode, stores?: Store[]): NodeSet {
    return this.getHelper(false, predicate, stores)
  }

  in (predicate?: InputAsNode, stores: Store[]): NodeSet {
    return this.getHelper(true, predicate, stores)
  }

  hasStore (store: Store): boolean {
    return this.parentStores.indexOf(store) !== -1
  }

  addStore (store: Store): RDFNode {
    if (!this.hasStore(store)) {
      this.parentStores.push(store)
    }
    if (!store.hasNode(this)) {
      store.addNode(this)
    }
    return this
  }

  abstract value (): any

}