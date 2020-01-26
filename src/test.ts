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