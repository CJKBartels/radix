import { describe, it, expect } from 'vitest'
import Fraction from './fraction'
import Polynomial from './polynomial'
import Term from './term'

// Shorthand for one term: t(3n, { x: 2, y: 1 }) is 3x²y. A Fraction works too: t(new Fraction(1n, 2n), { x: 1 }) is x/2.
function t(coefficient: bigint | Fraction, powers: Record<string, number> = {}): Term {
  const c = typeof coefficient === 'bigint' ? new Fraction(coefficient) : coefficient
  return new Term(c, powers)
}

// Shorthand for a polynomial: p(t(1n, { x: 1 }), t(1n)) is x + 1.
const p = (...terms: Term[]) => new Polynomial(terms)

// Checks the stored terms in order, so a failure shows the whole polynomial.
// Each term becomes [coefficient as text, powers], e.g. ['3', { x: 2, y: 1 }].
function expectTerms(actual: Polynomial, expected: [string, Record<string, number>][]) {
  expect(actual.terms.map(term => [term.coefficient.toString(), term.powers])).toEqual(expected)
}

describe('Polynomial constructor', () => {
  it('stores the terms it is given', () => {
    expectTerms(p(t(3n, { x: 2, y: 1 }), t(-1n, { x: 1 }), t(5n)), [
      ['3', { x: 2, y: 1 }],
      ['-1', { x: 1 }],
      ['5', {}],
    ])
  })

  it('drops terms with coefficient 0', () => {
    expectTerms(p(t(0n, { x: 2 }), t(4n, { x: 1 })), [['4', { x: 1 }]])
  })

  it('stores the zero polynomial as an empty list', () => {
    expectTerms(p(), [])
    expectTerms(p(t(0n)), [])
  })

  it('drops powers of 0', () => {
    expectTerms(p(t(5n, { x: 0 })), [['5', {}]])
    expectTerms(p(t(2n, { x: 1, y: 0 })), [['2', { x: 1 }]])
  })

  it('merges like terms', () => {
    expectTerms(p(t(1n, { x: 1 }), t(1n, { x: 1 })), [['2', { x: 1 }]])
  })

  it('merges like terms whose powers are written in a different order', () => {
    expectTerms(p(t(1n, { x: 2, y: 1 }), t(2n, { y: 1, x: 2 })), [['3', { x: 2, y: 1 }]])
  })

  it('merges a constant with a power-0 term', () => {
    // Needs powers of 0 dropped before merging.
    expectTerms(p(t(5n), t(3n, { x: 0 })), [['8', {}]])
  })

  it('drops terms that cancel when merged', () => {
    // 2x + 3 − 2x = 3. Needs zero coefficients dropped after merging.
    expectTerms(p(t(2n, { x: 1 }), t(3n), t(-2n, { x: 1 })), [['3', {}]])
  })

  it('sorts by total power, highest first', () => {
    expectTerms(p(t(7n), t(1n, { x: 1 }), t(3n, { x: 4 })), [
      ['3', { x: 4 }],
      ['1', { x: 1 }],
      ['7', {}],
    ])
  })

  it('breaks ties by comparing powers in alphabetical order of variables', () => {
    // x + y² + 3 + xy → xy, y², x, 3
    expectTerms(p(t(1n, { x: 1 }), t(1n, { y: 2 }), t(3n), t(1n, { x: 1, y: 1 })), [
      ['1', { x: 1, y: 1 }],
      ['1', { y: 2 }],
      ['1', { x: 1 }],
      ['3', {}],
    ])
  })

  it('puts the term with more x first in a tie', () => {
    // x²y and xy² both have total power 3. Compare x first: 2 beats 1.
    expectTerms(p(t(1n, { x: 1, y: 2 }), t(1n, { x: 2, y: 1 })), [
      ['1', { x: 2, y: 1 }],
      ['1', { x: 1, y: 2 }],
    ])
  })

  it('compares powers by variable name, not by position, when the variables differ', () => {
    // xy² and x²z both have total power 3. Compare x first: 2 beats 1, so x²z goes first.
    expectTerms(p(t(1n, { x: 1, y: 2 }), t(1n, { x: 2, z: 1 })), [
      ['1', { x: 2, z: 1 }],
      ['1', { x: 1, y: 2 }],
    ])
  })

  it('merges like terms that a wrong tie-break would separate', () => {
    // x²y + xy² + x²y = 2x²y + xy². The two x²y terms only meet if ties are sorted correctly.
    expectTerms(p(t(1n, { x: 2, y: 1 }), t(1n, { x: 1, y: 2 }), t(1n, { x: 2, y: 1 })), [
      ['2', { x: 2, y: 1 }],
      ['1', { x: 1, y: 2 }],
    ])
  })

  it('puts x before y in a tie', () => {
    expectTerms(p(t(1n, { y: 1 }), t(1n, { x: 1 })), [
      ['1', { x: 1 }],
      ['1', { y: 1 }],
    ])
  })

  it('is not changed when the array it was built from changes later', () => {
    const input = [t(1n, { x: 1 })]
    const poly = new Polynomial(input)
    input.push(t(5n))
    expectTerms(poly, [['1', { x: 1 }]])
  })
})

describe('Polynomial.isZero and equals', () => {
  it('isZero is true only for the zero polynomial', () => {
    expect(p().isZero()).toBe(true)
    expect(p(t(1n, { x: 1 }), t(-1n, { x: 1 })).isZero()).toBe(true)
    expect(p(t(5n)).isZero()).toBe(false)
  })

  it('equals is true for the same polynomial written differently', () => {
    const a = p(t(1n, { x: 1 }), t(2n))
    const b = p(t(1n), t(1n, { x: 1 }), t(1n))
    expect(a.equals(b)).toBe(true)
  })

  it('equals is false when a coefficient differs', () => {
    expect(p(t(1n, { x: 1 })).equals(p(t(2n, { x: 1 })))).toBe(false)
  })

  it('equals is false when a power differs', () => {
    expect(p(t(1n, { x: 2 })).equals(p(t(1n, { x: 2, y: 1 })))).toBe(false)
  })

  it('equals is false when one has an extra term', () => {
    expect(p(t(1n, { x: 1 })).equals(p(t(1n, { x: 1 }), t(1n)))).toBe(false)
  })
})

describe('Polynomial arithmetic', () => {
  it('adds', () => {
    // (2x + 1) + (3x − 1) = 5x
    const sum = p(t(2n, { x: 1 }), t(1n)).add(p(t(3n, { x: 1 }), t(-1n)))
    expectTerms(sum, [['5', { x: 1 }]])
  })

  it('subtracts', () => {
    // (x² + x) − (x + 1) = x² − 1
    const difference = p(t(1n, { x: 2 }), t(1n, { x: 1 })).subtract(p(t(1n, { x: 1 }), t(1n)))
    expectTerms(difference, [
      ['1', { x: 2 }],
      ['-1', {}],
    ])
  })

  it('gives zero when subtracting a polynomial from itself', () => {
    const a = p(t(3n, { x: 2, y: 1 }), t(-1n, { x: 1 }), t(5n))
    expect(a.subtract(a).isZero()).toBe(true)
  })

  it('negates', () => {
    expectTerms(p(t(1n, { x: 1 }), t(-2n)).negate(), [
      ['-1', { x: 1 }],
      ['2', {}],
    ])
  })

  it('multiplies two terms by multiplying coefficients and adding powers', () => {
    // 3x²y · 2xy³ = 6x³y⁴
    expectTerms(p(t(3n, { x: 2, y: 1 })).multiply(p(t(2n, { x: 1, y: 3 }))), [['6', { x: 3, y: 4 }]])
  })

  it('multiplies every term by every term', () => {
    // (x + 1)(x − 1) = x² − 1
    expectTerms(p(t(1n, { x: 1 }), t(1n)).multiply(p(t(1n, { x: 1 }), t(-1n))), [
      ['1', { x: 2 }],
      ['-1', {}],
    ])
  })

  it('multiplies with two variables', () => {
    // (x + y)² = x² + 2xy + y²
    const xPlusY = p(t(1n, { x: 1 }), t(1n, { y: 1 }))
    expectTerms(xPlusY.multiply(xPlusY), [
      ['1', { x: 2 }],
      ['2', { x: 1, y: 1 }],
      ['1', { y: 2 }],
    ])
  })

  it('gives zero when multiplying by zero', () => {
    expect(p(t(1n, { x: 1 }), t(1n)).multiply(p()).isZero()).toBe(true)
  })

  it('never changes the polynomials it was called on', () => {
    const a = p(t(1n, { x: 1 }), t(1n))
    const b = p(t(1n, { x: 1 }), t(-1n))
    a.add(b)
    a.multiply(b)
    a.negate()
    expectTerms(a, [
      ['1', { x: 1 }],
      ['1', {}],
    ])
    expectTerms(b, [
      ['1', { x: 1 }],
      ['-1', {}],
    ])
  })
})

describe('Polynomial.degree and leadingTerm', () => {
  it('degree is the highest power in one variable', () => {
    // 3x⁴ − x + 7
    expect(p(t(3n, { x: 4 }), t(-1n, { x: 1 }), t(7n)).degree()).toBe(4)
  })

  it('degree is the total power of the leading term in several variables', () => {
    // x²y³ + x
    expect(p(t(1n, { x: 2, y: 3 }), t(1n, { x: 1 })).degree()).toBe(5)
  })

  it('degree of a nonzero constant is 0', () => {
    expect(p(t(5n)).degree()).toBe(0)
  })

  it('degree of the zero polynomial is -Infinity', () => {
    expect(p().degree()).toBe(-Infinity)
  })

  it('leadingTerm is the first term in sorted order', () => {
    const lead = p(t(7n), t(-2n, { x: 3 }), t(1n, { x: 1 })).leadingTerm()
    expect([lead.coefficient.toString(), lead.powers]).toEqual(['-2', { x: 3 }])
  })

  it('leadingTerm of the zero polynomial throws', () => {
    expect(() => p().leadingTerm()).toThrow('Zero polynomial has no leading term')
  })
})

describe('Polynomial.divide', () => {
  it('divides exactly', () => {
    // (x² + 3x + 2) ÷ (x + 1) = x + 2, remainder 0
    const { quotient, remainder } = p(t(1n, { x: 2 }), t(3n, { x: 1 }), t(2n)).divide(p(t(1n, { x: 1 }), t(1n)))
    expectTerms(quotient, [
      ['1', { x: 1 }],
      ['2', {}],
    ])
    expect(remainder.isZero()).toBe(true)
  })

  it('leaves a remainder, with missing terms in the dividend', () => {
    // (x³ − 2) ÷ (x − 1) = x² + x + 1, remainder −1
    const { quotient, remainder } = p(t(1n, { x: 3 }), t(-2n)).divide(p(t(1n, { x: 1 }), t(-1n)))
    expectTerms(quotient, [
      ['1', { x: 2 }],
      ['1', { x: 1 }],
      ['1', {}],
    ])
    expectTerms(remainder, [['-1', {}]])
  })

  it('gives fraction coefficients when leading coefficients do not divide evenly', () => {
    // (x² − 1) ÷ (2x + 2) = x/2 − 1/2, remainder 0
    const { quotient, remainder } = p(t(1n, { x: 2 }), t(-1n)).divide(p(t(2n, { x: 1 }), t(2n)))
    expectTerms(quotient, [
      ['1/2', { x: 1 }],
      ['-1/2', {}],
    ])
    expect(remainder.isZero()).toBe(true)
  })

  it('gives quotient 0 when the divisor has a higher degree', () => {
    // (x + 1) ÷ x² = 0, remainder x + 1
    const { quotient, remainder } = p(t(1n, { x: 1 }), t(1n)).divide(p(t(1n, { x: 2 })))
    expect(quotient.isZero()).toBe(true)
    expectTerms(remainder, [
      ['1', { x: 1 }],
      ['1', {}],
    ])
  })

  it('divides by a constant', () => {
    // (x² + 1) ÷ 2 = x²/2 + 1/2, remainder 0. The remainder reaches degree −∞ and the loop stops.
    const { quotient, remainder } = p(t(1n, { x: 2 }), t(1n)).divide(p(t(2n)))
    expectTerms(quotient, [
      ['1/2', { x: 2 }],
      ['1/2', {}],
    ])
    expect(remainder.isZero()).toBe(true)
  })

  it('divides zero by anything', () => {
    const { quotient, remainder } = p().divide(p(t(1n, { x: 1 }), t(1n)))
    expect(quotient.isZero()).toBe(true)
    expect(remainder.isZero()).toBe(true)
  })

  it('satisfies dividend = quotient · divisor + remainder', () => {
    // 2x³ − x² − 4x + 2 ÷ (x² + 1)
    const dividend = p(t(2n, { x: 3 }), t(-1n, { x: 2 }), t(-4n, { x: 1 }), t(2n))
    const divisor = p(t(1n, { x: 2 }), t(1n))
    const { quotient, remainder } = dividend.divide(divisor)
    expect(quotient.multiply(divisor).add(remainder).equals(dividend)).toBe(true)
    expect(remainder.degree()).toBeLessThan(divisor.degree())
  })

  it('throws when dividing by zero', () => {
    expect(() => p(t(1n, { x: 1 })).divide(p())).toThrow('Cannot divide by zero')
  })

  it('throws when more than one variable is involved', () => {
    // (x + y) ÷ x would loop forever. Multi-variable division waits for phase 7.
    expect(() => p(t(1n, { x: 1 }), t(1n, { y: 1 })).divide(p(t(1n, { x: 1 })))).toThrow(
      'Division supports only one variable',
    )
    expect(() => p(t(1n, { x: 2 })).divide(p(t(1n, { y: 1 })))).toThrow('Division supports only one variable')
  })

  it('never changes the polynomials it was called on', () => {
    const dividend = p(t(1n, { x: 3 }), t(-2n))
    const divisor = p(t(1n, { x: 1 }), t(-1n))
    dividend.divide(divisor)
    expectTerms(dividend, [
      ['1', { x: 3 }],
      ['-2', {}],
    ])
    expectTerms(divisor, [
      ['1', { x: 1 }],
      ['-1', {}],
    ])
  })
})
