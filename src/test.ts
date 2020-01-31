import {
  NodeSet
}, hop from './index'

const rdf = {
  label: 'https://rdf.com/label',
  type: 'https://rdf.com/type'
}

const ELEMENT_PREFIX = 'https://avatar.example/elements#'
const VOCAB_PREFIX = 'https://avatar.example/vocab#'

const elementStore = hop.graph('https://avatar.example/elements')

const elements: NodeSet = elementStore.addNodes([
  hop.namedNode(ELEMENT_PREFIX + 'water').addOut(rdf.label, hop.literal('water')),
  hop.namedNode(ELEMENT_PREFIX + 'earth').addOut(rdf.label, hop.literal('earth')),
  hop.namedNode(ELEMENT_PREFIX + 'fire').addOut(rdf.label, hop.literal('fire')),
  hop.namedNode(ELEMENT_PREFIX + 'air').addOut(rdf.label, hop.literal('air'))
]).nodes()
elements.forEach((element: NamedNode) => {
  element.addOut(rdf.type, hop.namedNode(VOCAB_PREFIX + 'Element'))
})

console.log(elementStore.toString())

// -----------------------------

const water = elementStore.getNamedNode(ELEMENT_PREFIX + "water")
const earth = elementStore.getNamedNode(ELEMENT_PREFIX + "earth")
const fire = elementStore.getNamedNode(ELEMENT_PREFIX + "fire")

console.log(fire.out(rdf.label).one().value) // "fire"

// -----------------------------

const CHARACTER_PREFIX = 'https://avatar.example/characters#'
const characterStore = new Store()

// Define Characters
[
  { name: 'Katara', elem: [water] },
  { name: 'Sokka', elem: [] },
  { name: 'Aang', elem: [water, earth, fire, air]},
  { name: 'Zuko', elem: [fire]},
  { name: 'Jet', elem: []},
  { name: 'Toph', elem: [earth]}
].forEach(({ name: string, elem: NamedNode[] }) => {
  characterStore.add(
    new NamedNode(CHARACTER_PREFIX + name)
      .addOut(rdf.type, foaf.Person)
      .addOut(new NamedNode(VOCAB_PREFIX + 'bends'), elem) // Add elements as object
      .addOut(foaf.name, new Literal(name))
  )
})

// Ensure all characters know each other
characterStore.getAllNamedNodes().forEach((personA: NamedNode) => {
  characterStore.getAllNamedNodes().forEach((personB: NamedNode) => {
    personA.addOut(foaf.knows, personB)
  })
})