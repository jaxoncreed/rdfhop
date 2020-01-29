import hop, {
  NamedNode
} from './index'

const rdf = {
  label: 'https://rdf.com/label',
  type: 'https://rdf.com/type'
}

// const foaf = {
//   Person: 'https://foaf.com/person',
//   name: 'https://foaf.com/name',
//   knows: 'https://foaf.com/knows'
// }

const ELEMENT_PREFIX = 'https://avatar.example/elements#'
const VOCAB_PREFIX = 'https://avatar.example/vocab#'

const elementGraph = hop.graph('https://avatar.example/elements')

const elements = [
  hop.namedNode(ELEMENT_PREFIX + 'water').addOut(rdf.label, hop.literal('water'), [elementGraph]),
  hop.namedNode(ELEMENT_PREFIX + 'earth').addOut(rdf.label, hop.literal('earth'), [elementGraph]),
  hop.namedNode(ELEMENT_PREFIX + 'fire').addOut(rdf.label, hop.literal('fire'), [elementGraph]),
  hop.namedNode(ELEMENT_PREFIX + 'air').addOut(rdf.label, hop.literal('air'), [elementGraph])
]

elements.forEach((element: NamedNode) => {
  element.addOut(rdf.type, hop.namedNode(VOCAB_PREFIX + 'Element'), [elementGraph])
})

console.log(elementGraph.toString())

// -----------------------------

// const water = hop.namedNode(ELEMENT_PREFIX + "water")
// const earth = hop.namedNode(ELEMENT_PREFIX + "earth")
// const fire = hop.namedNode(ELEMENT_PREFIX + "fire")
// const air = hop.namedNode(ELEMENT_PREFIX + 'air')

// console.log(fire.out(rdf.label).one().value) // "fire"

// // -----------------------------

// const CHARACTER_PREFIX = 'https://avatar.example/characters#'
// const characterGraph = hop.graph('https://avatar.example/characters')

// // Define Characters
// const rawCharacterData = [
//   { name: 'Katara', elem: [water] },
//   { name: 'Sokka', elem: [] },
//   { name: 'Aang', elem: [water, earth, fire, air]},
//   { name: 'Zuko', elem: [fire]},
//   { name: 'Jet', elem: []},
//   { name: 'Toph', elem: [earth]}
// ]
// rawCharacterData.forEach(({ name, elem }) => {
//     hop.namedNode(CHARACTER_PREFIX + name)
//       .addOut(rdf.type, foaf.Person, [characterGraph])
//       .addOut(new NamedNode(VOCAB_PREFIX + 'bends'), elem, [characterGraph]) // Add elements as object
//       .addOut(foaf.name, hop.literal(name), [characterGraph])
// })

// // Ensure all characters know each other
// characterGraph.nodes().forEach((personA: NamedNode) => {
//   characterGraph.nodes().forEach((personB: NamedNode) => {
//     personA.addOut(foaf.knows, personB)
//   })
// })

// // -----------------------------
// const toph = hop.namedNode(CHARACTER_PREFIX + 'Toph')
// const zuko = hop.namedNode(CHARACTER_PREFIX + 'Zuko')
// const jet = hop.namedNode(CHARACTER_PREFIX + 'Jet')
// toph.deleteOut(foaf.knows, zuko)
// toph.deleteIn(foaf.knows, zuko)
// toph.deleteOut(foaf.knows, jet)
// toph.deleteIn(foaf.knows, jet)