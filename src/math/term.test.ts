import { describe, it, expect } from 'vitest'
import Fraction from './fraction'
import Term from './term'

describe('Term constructor', () => {
  it('keeps the coefficient it is given', () => {
    expect(new Term(new Fraction(3n), { x: 2 }).coefficient.toString()).toBe('3')
  })

  it('drops powers of 0', () => {
    expect(new Term(new Fraction(5n), { x: 0 }).powers).toEqual({})
    expect(new Term(new Fraction(2n), { x: 1, y: 0 }).powers).toEqual({ x: 1 })
  })

  it('stores variables in alphabetical order', () => {
    expect(Object.keys(new Term(new Fraction(1n), { z: 1, x: 2, y: 3 }).powers)).toEqual(['x', 'y', 'z'])
  })

  it('is not changed when the powers object it was built from changes later', () => {
    const powers = { x: 1 }
    const term = new Term(new Fraction(1n), powers)
    powers.x = 5
    expect(term.powers).toEqual({ x: 1 })
  })
})

// compareTo returns -1 if this term comes first in a polynomial, 1 if it comes second, 0 if the powers match.
// Note the direction: higher total power comes first, so it returns -1 for the BIGGER term (unlike Fraction.compareTo).
describe('Term.compareTo', () => {
  // Shorthand: a term with coefficient 1.
  const m = (powers: Record<string, number>) => new Term(new Fraction(1n), powers)

  it('puts higher total power first', () => {
    expect(m({ x: 3 }).compareTo(m({ x: 1 }))).toBe(-1)
    expect(m({ x: 1 }).compareTo(m({ x: 3 }))).toBe(1)
  })

  it('uses total power, not the highest single power', () => {
    // xy (total 2) comes before x (total 1)
    expect(m({ x: 1, y: 1 }).compareTo(m({ x: 1 }))).toBe(-1)
    // x²y² (total 4) comes before x³ (total 3)
    expect(m({ x: 2, y: 2 }).compareTo(m({ x: 3 }))).toBe(-1)
  })

  it('puts a constant last', () => {
    expect(m({}).compareTo(m({ x: 1 }))).toBe(1)
  })

  it('breaks a tie by comparing powers of x first, more x first', () => {
    // x²y vs xy²: total 3 each, 2 beats 1
    expect(m({ x: 2, y: 1 }).compareTo(m({ x: 1, y: 2 }))).toBe(-1)
    expect(m({ x: 1, y: 2 }).compareTo(m({ x: 2, y: 1 }))).toBe(1)
  })

  it('treats a missing variable as power 0 in a tie', () => {
    // xy vs y²: total 2 each. x: 1 vs 0, so xy first
    expect(m({ x: 1, y: 1 }).compareTo(m({ y: 2 }))).toBe(-1)
    // x vs y: total 1 each. x: 1 vs 0, so x first
    expect(m({ y: 1 }).compareTo(m({ x: 1 }))).toBe(1)
  })

  it('compares by variable name, not by position', () => {
    // yz² vs x²z: total 3 each. x: 0 vs 2, so x²z first.
    // Comparing slot by slot would wrongly match y against x.
    expect(m({ y: 1, z: 2 }).compareTo(m({ x: 2, z: 1 }))).toBe(1)
    expect(m({ x: 2, z: 1 }).compareTo(m({ y: 1, z: 2 }))).toBe(-1)
  })

  it('moves on to the next variable when x ties', () => {
    // xy² vs xyz: total 3 each. x ties (1 vs 1), y: 2 vs 1, so xy² first
    expect(m({ x: 1, y: 2 }).compareTo(m({ x: 1, y: 1, z: 1 }))).toBe(-1)
  })

  it('is 0 for the same powers, whatever the coefficients', () => {
    const a = new Term(new Fraction(3n), { x: 2, y: 1 })
    const b = new Term(new Fraction(-5n), { y: 1, x: 2 })
    expect(a.compareTo(b)).toBe(0)
  })

  it('is 0 for two constants', () => {
    expect(m({}).compareTo(m({}))).toBe(0)
  })

  it('works as a sort function', () => {
    // x + y² + 3 + xy → xy, y², x, 3
    const sorted = [m({ x: 1 }), m({ y: 2 }), m({}), m({ x: 1, y: 1 })].sort((a, b) => a.compareTo(b))
    expect(sorted.map(term => term.powers)).toEqual([{ x: 1, y: 1 }, { y: 2 }, { x: 1 }, {}])
  })
})

describe('Term.multiply', () => {
  // Shorthand: t(3n, { x: 2 }) is 3x².
  const t = (coefficient: bigint, powers: Record<string, number>) => new Term(new Fraction(coefficient), powers)

  it('multiplies coefficients and adds powers of the same variable', () => {
    // 3x² · 2x = 6x³
    const product = t(3n, { x: 2 }).multiply(t(2n, { x: 1 }))
    expect(product.coefficient.toString()).toBe('6')
    expect(product.powers).toEqual({ x: 3 })
  })

  it('adds powers variable by variable', () => {
    // 3x²y · 2xy³ = 6x³y⁴
    const product = t(3n, { x: 2, y: 1 }).multiply(t(2n, { x: 1, y: 3 }))
    expect(product.coefficient.toString()).toBe('6')
    expect(product.powers).toEqual({ x: 3, y: 4 })
  })

  it('keeps variables that only one side has', () => {
    // x² · y = x²y
    expect(t(1n, { x: 2 }).multiply(t(1n, { y: 1 })).powers).toEqual({ x: 2, y: 1 })
  })

  it('stores the result in alphabetical order', () => {
    // z · x = xz
    expect(Object.keys(t(1n, { z: 1 }).multiply(t(1n, { x: 1 })).powers)).toEqual(['x', 'z'])
  })

  it('multiplies by a constant', () => {
    // 5 · 2x = 10x
    const product = t(5n, {}).multiply(t(2n, { x: 1 }))
    expect(product.coefficient.toString()).toBe('10')
    expect(product.powers).toEqual({ x: 1 })
  })

  it('keeps signs and fractions right', () => {
    // (−1/2)x · 4x = −2x²
    const product = new Term(new Fraction(-1n, 2n), { x: 1 }).multiply(t(4n, { x: 1 }))
    expect(product.coefficient.toString()).toBe('-2')
    expect(product.powers).toEqual({ x: 2 })
  })

  it('never changes the terms it was called on', () => {
    const a = t(3n, { x: 2 })
    const b = t(2n, { x: 1, y: 1 })
    a.multiply(b)
    expect([a.coefficient.toString(), a.powers]).toEqual(['3', { x: 2 }])
    expect([b.coefficient.toString(), b.powers]).toEqual(['2', { x: 1, y: 1 }])
  })
})

// The like-terms check: compareTo(other) === 0 means the same powers, whatever the coefficients.
// Polynomial's merge step relies on this.
describe('Term.compareTo for spotting like terms', () => {
  const t = (coefficient: bigint, powers: Record<string, number>) => new Term(new Fraction(coefficient), powers)

  it('is 0 when the powers were written in a different order', () => {
    expect(t(3n, { x: 2, y: 1 }).compareTo(t(3n, { y: 1, x: 2 }))).toBe(0)
  })

  it('is 0 when one side was written with a power of 0', () => {
    expect(t(5n, {}).compareTo(t(2n, { x: 0 }))).toBe(0)
    expect(t(1n, { x: 1 }).compareTo(t(1n, { x: 1, y: 0 }))).toBe(0)
  })

  it('is not 0 when a power differs', () => {
    expect(t(1n, { x: 2 }).compareTo(t(1n, { x: 3 }))).not.toBe(0)
  })

  it('is not 0 when one side has an extra variable', () => {
    // Looping over only one side's variables would miss y.
    expect(t(1n, { x: 2 }).compareTo(t(1n, { x: 2, y: 1 }))).not.toBe(0)
    expect(t(1n, { x: 2, y: 1 }).compareTo(t(1n, { x: 2 }))).not.toBe(0)
  })

  it('is not 0 for the same powers on different variables', () => {
    expect(t(1n, { x: 2 }).compareTo(t(1n, { y: 2 }))).not.toBe(0)
  })

  it('is not 0 when the totals match but the powers are split differently', () => {
    expect(t(1n, { x: 2, y: 1 }).compareTo(t(1n, { x: 1, y: 2 }))).not.toBe(0)
  })
})

describe('Term.divide', () => {
  const t = (coefficient: bigint, powers: Record<string, number>) => new Term(new Fraction(coefficient), powers)

  it('divides coefficients and subtracts powers', () => {
    // 6x³ ÷ 2x = 3x²
    const quotient = t(6n, { x: 3 }).divide(t(2n, { x: 1 }))
    expect(quotient.coefficient.toString()).toBe('3')
    expect(quotient.powers).toEqual({ x: 2 })
  })

  it('subtracts powers variable by variable', () => {
    // 6x³y⁴ ÷ 3x²y = 2xy³
    const quotient = t(6n, { x: 3, y: 4 }).divide(t(3n, { x: 2, y: 1 }))
    expect(quotient.coefficient.toString()).toBe('2')
    expect(quotient.powers).toEqual({ x: 1, y: 3 })
  })

  it('drops a power that reaches 0', () => {
    // 5x² ÷ x² = 5, with powers {} and not { x: 0 }
    expect(t(5n, { x: 2 }).divide(t(1n, { x: 2 })).powers).toEqual({})
  })

  it('keeps variables the divisor does not have', () => {
    // x²y ÷ x = xy
    expect(t(1n, { x: 2, y: 1 }).divide(t(1n, { x: 1 })).powers).toEqual({ x: 1, y: 1 })
  })

  it('divides by a constant', () => {
    // 3x² ÷ 2 = (3/2)x²
    const quotient = t(3n, { x: 2 }).divide(t(2n, {}))
    expect(quotient.coefficient.toString()).toBe('3/2')
    expect(quotient.powers).toEqual({ x: 2 })
  })

  it('gives a fraction coefficient when coefficients do not divide evenly', () => {
    // x ÷ 2x = 1/2
    const quotient = t(1n, { x: 1 }).divide(t(2n, { x: 1 }))
    expect(quotient.coefficient.toString()).toBe('1/2')
    expect(quotient.powers).toEqual({})
  })

  it('keeps signs right', () => {
    // −4x³ ÷ 2x = −2x²
    expect(t(-4n, { x: 3 }).divide(t(2n, { x: 1 })).coefficient.toString()).toBe('-2')
  })

  it('throws when a power would go negative', () => {
    // x ÷ x² would be x⁻¹, and y ÷ x would be y·x⁻¹. Neither is a term.
    expect(() => t(1n, { x: 1 }).divide(t(1n, { x: 2 }))).toThrow('Term does not divide evenly')
    expect(() => t(1n, { y: 1 }).divide(t(1n, { x: 1 }))).toThrow('Term does not divide evenly')
  })

  it('throws when dividing by a zero coefficient', () => {
    // Fraction.divide already throws this, so it can just pass through.
    expect(() => t(1n, { x: 1 }).divide(t(0n, { x: 1 }))).toThrow('Cannot divide by zero')
  })

  it('never changes the terms it was called on', () => {
    const a = t(6n, { x: 3 })
    const b = t(2n, { x: 1 })
    a.divide(b)
    expect([a.coefficient.toString(), a.powers]).toEqual(['6', { x: 3 }])
    expect([b.coefficient.toString(), b.powers]).toEqual(['2', { x: 1 }])
  })
})
