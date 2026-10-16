import Term from "./term.js"

class Polynomial {
    readonly terms: Term[]

    constructor(terms: Term[]) {
        const sorted = terms.sort((a, b) => a.compareTo(b))

        for (let i = 0; i < sorted.length - 1; i++) {
            const currentTerm = sorted[i]
            let currentCoefficient = currentTerm.coefficient
            for (let j = i + 1; j < sorted.length; j++) {
                const futureTerm = sorted[j]

                if (currentTerm.compareTo(futureTerm) === 0) {
                    currentCoefficient = currentCoefficient.add(futureTerm.coefficient)
                    sorted[j] = Term.zeroTerm()
                } else break
            }

            sorted[i] = new Term(currentCoefficient, currentTerm.powers)
        }

        const noZeroTerms = sorted.filter(term => !term.coefficient.isZero())
        this.terms = noZeroTerms
    }


    isZero(): boolean {
        return this.terms.length === 0
    }

    equals(other: Polynomial): boolean {
        return this.subtract(other).isZero()
    }

    add(other: Polynomial): Polynomial {
        return new Polynomial([...this.terms, ...other.terms])
    }

    subtract(other: Polynomial): Polynomial {
        return this.add(other.negate())
    }

    negate(): Polynomial {
        return new Polynomial(this.terms.map((t) => t.negate()))
    }

    multiply(other: Polynomial): Polynomial {
        const terms: Term[] = []

        for (const a of this.terms) {
            for (const b of other.terms) {
                terms.push(a.multiply(b))
            }
        }

        return new Polynomial(terms)
    }

    degree(): number {
        if (this.terms.length == 0) return -Infinity
        return this.terms[0].totalPower()
    }

    leadingTerm(): Term {
        if (this.terms.length == 0) throw ("Zero polynomial has no leading term")
        return this.terms[0]
    }

    static zeroPolynomial(): Polynomial {
        return new Polynomial([])
    }

    divide(divisor: Polynomial): { quotient: Polynomial, remainder: Polynomial } {
        if (this.terms.length === 0)
            return { quotient: Polynomial.zeroPolynomial(), remainder: Polynomial.zeroPolynomial() }

        if (divisor.terms.length === 0) throw ("Cannot divide by zero");
        const tV = this.terms.reduce<string[]>((acc, cv) =>
            [...acc, ...Object.keys(cv.powers)]
            , [])
        if (tV.some(v => v !== tV[0])) throw ("Division supports only one variable")

        const dV = divisor.terms.reduce<string[]>((acc, cv) =>
            [...acc, ...Object.keys(cv.powers)]
            , [])
        if (dV.some(v => v !== tV[0])) throw ("Division supports only one variable")

        let quotient: Polynomial = Polynomial.zeroPolynomial()
        let remainder: Polynomial = this.add(Polynomial.zeroPolynomial())

        while (remainder.degree() >= divisor.degree()) {
            const leadDiv = remainder.leadingTerm().divide(divisor.leadingTerm())
            remainder = remainder.subtract(divisor.multiply(new Polynomial([leadDiv])))
            quotient = quotient.add(new Polynomial([leadDiv]))
        }

        return { quotient: quotient, remainder: remainder }
    }
}


export default Polynomial

