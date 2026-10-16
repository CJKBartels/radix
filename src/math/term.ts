import Fraction from "./fraction"

function comparePowers(a: [string, number], b: [string, number]): number {
    const aKey = a[0]
    const bKey = b[0]

    if (aKey > bKey) return 1
    else if (aKey == bKey) return 0
    else return -1
}

class Term {
    readonly coefficient: Fraction
    readonly powers: Record<string, number>

    constructor(coefficient: Fraction, powers: Record<string, number>) {
        this.coefficient = coefficient
        this.powers = Object.fromEntries(Object.entries(powers).filter(([_, power]) => power !== 0).sort((a, b) => comparePowers(a, b)))
    }

    totalPower(): number {
        const power = Object.values(this.powers).reduce((sum, current) => { return sum + current }, 0)
        return power
    }

    compareTo(other: Term): number {
        const tTP = this.totalPower()
        const oTP = other.totalPower()

        if (tTP > oTP) return -1
        else if (tTP < oTP) return 1


        const tV = Object.entries(this.powers)
        const oV = Object.entries(other.powers)

        for (let i = 0; i < tV.length && i < oV.length; i++) {
            if (tV[i][0] == oV[i][0]) {
                if (tV[i][1] < oV[i][1]) return 1
                if (tV[i][1] > oV[i][1]) return -1
            } else if (tV[i][0] < oV[i][0]) return -1
            else return 1
        }

        return 0
    }

    multiply(other: Term): Term {
        const c = this.coefficient.multiply(other.coefficient)

        const powers: Record<string, number> = { ...this.powers }

        for (const entry of Object.entries(other.powers)) {
            powers[entry[0]] = (powers[entry[0]] ?? 0) + entry[1]
        }

        return new Term(c, powers)
    }

    divide(other: Term): Term {
        const c = this.coefficient.divide(other.coefficient)

        const powers: Record<string, number> = { ...this.powers }

        for (const entry of Object.entries(other.powers)) {
            powers[entry[0]] = (powers[entry[0]] ?? 0) - entry[1]
            if (powers[entry[0]] < 0) throw ('Term does not divide evenly')
        }

        return new Term(c, powers)
    }

    negate(): Term {
        return new Term(this.coefficient.negate(), this.powers)
    }

    static zeroTerm(): Term {
        return new Term(new Fraction(0n), {})
    }

}

export default Term