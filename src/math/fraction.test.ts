import { describe, it, expect } from 'vitest'
import { Fraction } from './fraction'

// Shorthand: f(1n, 2n) instead of new Fraction(1n, 2n).
const f = (numerator: bigint, denominator: bigint) => new Fraction(numerator, denominator)

// Checks both stored parts at once, so a failure shows the whole fraction.
function expectFraction(actual: Fraction, numerator: bigint, denominator: bigint) {
  expect([actual.numerator, actual.denominator]).toEqual([numerator, denominator])
}

describe('Fraction constructor', () => {
  it('reduces to lowest terms', () => {
    expectFraction(f(2n, 4n), 1n, 2n)
  })

  it('moves the sign to the numerator', () => {
    expectFraction(f(1n, -2n), -1n, 2n)
  })

  it('cancels two minus signs', () => {
    expectFraction(f(-6n, -4n), 3n, 2n)
  })

  it('stores zero as 0/1', () => {
    expectFraction(f(0n, 5n), 0n, 1n)
    expectFraction(f(0n, -5n), 0n, 1n)
  })

  it('rejects a zero denominator', () => {
    expect(() => f(5n, 0n)).toThrow('Denominator cannot be zero')
  })

  it('rejects 0/0', () => {
    expect(() => f(0n, 0n)).toThrow('Denominator cannot be zero')
  })
})

describe('Fraction arithmetic', () => {
  const half = f(1n, 2n)
  const third = f(1n, 3n)

  it('adds', () => {
    expectFraction(half.add(third), 5n, 6n)
  })

  it('reduces the result of an operation', () => {
    expectFraction(half.add(half), 1n, 1n)
  })

  it('subtracts', () => {
    expectFraction(half.subtract(third), 1n, 6n)
  })

  it('multiplies', () => {
    expectFraction(half.multiply(third), 1n, 6n)
  })

  it('divides', () => {
    expectFraction(half.divide(third), 3n, 2n)
  })

  it('keeps signs right when dividing by a negative', () => {
    expectFraction(half.divide(third.negate()), -3n, 2n)
    expectFraction(half.negate().divide(third.negate()), 3n, 2n)
  })

  it('negates', () => {
    expectFraction(half.negate(), -1n, 2n)
  })

  it('rejects dividing by zero with its own message', () => {
    expect(() => half.divide(f(0n, 1n))).toThrow('Cannot divide by zero')
  })

  it('never changes the fractions it was called on', () => {
    half.add(third)
    half.negate()
    expectFraction(half, 1n, 2n)
    expectFraction(third, 1n, 3n)
  })
})

// ---- Helpers, written test-first (TDD). These fail until fraction.ts has them. ----

describe('Fraction from a whole number', () => {
  it('uses a denominator of 1 when none is given', () => {
    expectFraction(new Fraction(3n), 3n, 1n)
    expectFraction(new Fraction(-4n), -4n, 1n)
  })
})

describe('Fraction.equals', () => {
  it('is true for the same value written differently', () => {
    expect(f(1n, 2n).equals(f(2n, 4n))).toBe(true)
  })

  it('is false for different values', () => {
    expect(f(1n, 2n).equals(f(1n, 3n))).toBe(false)
  })

  it('tells a value from its negative', () => {
    expect(f(1n, 2n).equals(f(-1n, 2n))).toBe(false)
  })
})

describe('Fraction.isZero', () => {
  it('is true only for zero', () => {
    expect(f(0n, 7n).isZero()).toBe(true)
    expect(f(1n, 7n).isZero()).toBe(false)
    expect(f(-1n, 7n).isZero()).toBe(false)
  })
})

describe('Fraction.sign', () => {
  // Like Math.sign: -1, 0 or 1, as a regular number.
  it('is -1, 0 or 1', () => {
    expect(f(-3n, 4n).sign()).toBe(-1)
    expect(f(0n, 4n).sign()).toBe(0)
    expect(f(3n, -4n).sign()).toBe(-1)
    expect(f(3n, 4n).sign()).toBe(1)
  })
})

describe('Fraction.compareTo', () => {
  // -1 if this < other, 0 if equal, 1 if this > other.
  it('orders fractions with different denominators', () => {
    expect(f(1n, 3n).compareTo(f(1n, 2n))).toBe(-1)
    expect(f(1n, 2n).compareTo(f(1n, 3n))).toBe(1)
  })

  it('is 0 for equal values', () => {
    expect(f(1n, 2n).compareTo(f(2n, 4n))).toBe(0)
  })

  it('handles negatives', () => {
    expect(f(-1n, 2n).compareTo(f(1n, 3n))).toBe(-1)
    expect(f(-1n, 2n).compareTo(f(-1n, 3n))).toBe(-1)
  })

  it('works as a sort function', () => {
    const sorted = [f(1n, 2n), f(-1n, 1n), f(1n, 3n), f(0n, 1n)].sort((a, b) => a.compareTo(b))
    expect(sorted.map(x => x.toString())).toEqual(['-1', '0', '1/3', '1/2'])
  })
})

describe('Fraction.toString', () => {
  it('writes numerator/denominator', () => {
    expect(f(1n, 2n).toString()).toBe('1/2')
    expect(f(-1n, 2n).toString()).toBe('-1/2')
  })

  it('leaves out a denominator of 1', () => {
    expect(f(6n, 2n).toString()).toBe('3')
    expect(f(-3n, 1n).toString()).toBe('-3')
    expect(f(0n, 5n).toString()).toBe('0')
  })
})
