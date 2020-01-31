# RDF Hop

An RDF library that treats graphs like graphs.

## Intallation

```bash
npm i rdfhop
```

## Usage

Graphs can represent anything in the world, and for this usage example, it will represent a story. Specifically the story of "Avatar the Last Airbender"

### Create a Graph

Let's start with some worldbuilding. Through JavaScript we can easily define a node representing each of the 4 elements. "Water", "Earth", "Fire", and "Air".

```ts
import {
  Store,
  SuperStore,
  NamedNode,
  NodeSet
} from 'rdfhop'
import rdf from 'rdfhop/vocab/rdf'
import foaf from 'rdfhop/vocab/foaf'

const ELEMENT_PREFIX = 'https://avatar.example/elements#'
const VOCAB_PREFIX = 'https://avatar.example/vocab#'

const elementStore = new Store()

const elements: NodeSet = elementStore.add([
  new NamedNode(ELEMENT_PREFIX + 'water').addOut(rdf.label, new Literal('water')),
  new NamedNode(ELEMENT_PREFIX + 'earth').addOut(rdf.label, new Literal('earth')),
  new NamedNode(ELEMENT_PREFIX + 'fire').addOut(rdf.label, new Literal('fire')),
  new NamedNode(ELEMENT_PREFIX + 'air').addOut(rdf.label, new Literal('air'))
])
elements.forEach((element: NamedNode) => {
  element.addOut(rdf.type, new NamedNode(VOCAB_PREFIX + 'Element'))
})

console.log(elementStore.toString())



import hop, {
  NamedNode,
  RDFNode
} from './index'
import rdf from 'rdfhop/vocab/rdf'
import foaf from 'rdfhop/vocab/foaf'

const ELEMENT_PREFIX = 'https://avatar.example/elements#'
const VOCAB_PREFIX = 'https://avatar.example/vocab#'

const elementGraph = hop.graph('https://avatar.example/elements')

const elements = [
  hop.namedNode(ELEMENT_PREFIX + 'water').addOut(rdf.label, hop.literal('water'), [elementGraph]),
  hop.namedNode(ELEMENT_PREFIX + 'earth').addOut(rdf.label, hop.literal('earth'), [elementGraph]),
  hop.namedNode(ELEMENT_PREFIX + 'fire').addOut(rdf.label, hop.literal('fire'), [elementGraph]),
  hop.namedNode(ELEMENT_PREFIX + 'air').addOut(rdf.label, hop.literal('air'), [elementGraph])
]

elements.forEach((element) => {
  element.addOut(rdf.type, hop.namedNode(VOCAB_PREFIX + 'Element'), [elementGraph])
})

console.log(elements.map((element) => element.toString()))
```

This will log:
```ttl
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix elements: <https://avatar.example/element#>.
@prefix vocab: https://avatar.example/vocab#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

elements:water a vocab:Element ;
  rdf:label "water"^^xsd:string .
elements:earth a vocab:Element ;
  rdf:label "earth"^^xsd:string ,
elements:fire a vocab:Element ;
  rdf:label "fire"^^xsd:string .
elements:air a vocab:Element ;
  rdf:label "air"^^xsd:string .
```

Already we can see how intuitive it is to set up an RDF graph. RDF Hop is designed to work with all the JavaScript paridigms you're used to.

### Travserse a the Graph

Now that we've defined a graph and put it into a store, we can traverse the graph.

```ts
const water = hop.namedNode(ELEMENT_PREFIX + "water")
const earth = hop.namedNode(ELEMENT_PREFIX + "earth")
const fire = hop.namedNode(ELEMENT_PREFIX + "fire")
const air = hop.namedNode(ELEMENT_PREFIX + 'air')

console.log(fire.out(rdf.label).one().value()) // "fire^^xsd:string"
```

Notice the `out` command. This will yeild all nodes that are the object of the provided predicate. Because this returns a collection of nodes, we call `one()` which picks a singular node from the collection. `value` yeilds the real string value of the literal.

```ts
const air = elementStore.getLiteral("air").in(rdf.label).one()
```

Similarly, you can use the `in` method to trace the graph backwards.

### Multiple Stores

You might want to keep graphs with overlapping data separate in the case you have multiple RDF files. To do so create a new store:

```ts
const CHARACTER_PREFIX = 'https://avatar.example/characters#'
const characterGraph = hop.graph('https://avatar.example/characters')

// Define Characters
const rawCharacterData: { name: string, elems: RDFNode[] }[] = [
  { name: 'Katara', elems: [water] },
  { name: 'Sokka', elems: [] },
  { name: 'Aang', elems: [water, earth, fire, air]},
  { name: 'Zuko', elems: [fire]},
  { name: 'Jet', elems: []},
  { name: 'Toph', elems: [earth]}
]
const characters = rawCharacterData.map(({ name, elems }) => {
    const character = hop.namedNode(CHARACTER_PREFIX + name)
      .addOut(rdf.type, foaf.Person, [characterGraph])
      .addOut(foaf.name, hop.literal(name), [characterGraph])
    elems.forEach((elem: RDFNode) => character.addOut(hop.namedNode(VOCAB_PREFIX + 'bends'), elem, [characterGraph]))
    return character
})

// Ensure all characters know each other
characters.forEach((personA: NamedNode) => {
  characters.forEach((personB: NamedNode) => {
    if (personA !== personB) {
      personA.addOut(foaf.knows, personB)
    }
  })
})

console.log(characterGraph.nodes().map(node => node.toString()))
```

Notice that despite the elements being added as an object to the characters, the `knows` predicate will not be applied to them becasue these elements are not in the characterStore, and would not be included in the set yeilded by `getAllNamedNodes()`

### Removing Data

Let's say it's mid season 2 and Toph doesn't know Zuko or Jet. We can remove her `know` connections:

```ts
const toph = hop.namedNode(CHARACTER_PREFIX + 'Toph')
const zuko = hop.namedNode(CHARACTER_PREFIX + 'Zuko')
const jet = hop.namedNode(CHARACTER_PREFIX + 'Jet')
toph.deleteOut(foaf.knows, zuko)
toph.deleteIn(foaf.knows, zuko)
toph.deleteOut(foaf.knows, jet)
toph.deleteIn(foaf.knows, jet)

console.log(characterGraph.nodes().map(node => node.toString()))
```
