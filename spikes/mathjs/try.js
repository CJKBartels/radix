// Spike: what tree does math.js produce for a given input?
//
// Usage:  node try.js "3(x+1) = 2x"
//
// This script only shows you what comes back. Judging whether the result is
// usable for the converter is the research, and that's yours.

import { create, all } from 'mathjs'

const config = {
  number: 'Fraction'
}

const math = create(all, config)
const input = process.argv[2]
if (input === undefined) {
  console.log('Usage: node try.js "<expression>"')
  process.exit(1)
}

console.log(`Input:   ${input}`)

let tree
try {
  // parse() turns text into a tree of "nodes" without calculating anything.
  // Each node has a `type`, such as OperatorNode (+, *, ^), SymbolNode (x),
  // or ConstantNode (3).
  tree = math.parse(input)
} catch (err) {
  // A parse failure is a result too: it tells you what math.js rejects.
  console.log(`ERROR:   ${err.message}`)
  process.exit(0)
}

// toString() prints the tree back as text, with math.js's own choices made
// visible (for example, where it inserted an implicit multiplication).
console.log(`Printed: ${tree.toString()}`)
console.log('Tree:')
printNode(tree, 1)

// Prints one node per line, indented by depth, showing its type plus the field
// that identifies it. node.forEach(callback) calls callback on each direct
// child, which is how we walk down the tree.
function printNode(node, depth) {
  console.log('  '.repeat(depth) + describe(node))
  node.forEach((child) => printNode(child, depth + 1))
}

function describe(node) {
  switch (node.type) {
    case 'OperatorNode':
      // `fn` is math.js's internal name for the operation (e.g. "multiply").
      // `implicit` is true when the input had no written "*", as in "2x".
      return `OperatorNode  op="${node.op}"  fn="${node.fn}"` +
        (node.implicit ? '  (implicit)' : '')
    case 'ConstantNode':
      // Shows which type the number came back as: a plain JS number, or an
      // object such as math.js's Fraction (printed as numerator/denominator).
      if (typeof node.value === 'object') {
        const shown = node.value.toFraction?.() ?? String(node.value)
        return `ConstantNode  value=${shown}  (${node.value.constructor.name})`
      }
      return `ConstantNode  value=${node.value}  (${typeof node.value})`
    case 'SymbolNode':
      return `SymbolNode    name="${node.name}"`
    case 'ParenthesisNode':
      return 'ParenthesisNode'
    case 'FunctionNode':
      return `FunctionNode  name="${node.fn.name ?? node.fn}"`
    default:
      // Any other node type gets printed by name so nothing is hidden.
      return node.type
  }
}
