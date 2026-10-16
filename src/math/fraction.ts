function absBig(value: bigint): bigint {
    return value < 0n ? -value : value;
}

function gcdBig(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
        const c = a;
        a = b;
        b = absBig(c) % b
    }

    return a;
}

class Fraction {
    readonly numerator: bigint;
    readonly denominator: bigint;

    constructor(numerator: bigint, denominator: bigint = 1n) {
        if (denominator === 0n) {
            throw new Error("Denominator cannot be zero");
        }

        const a = absBig(numerator);
        const b = absBig(denominator);
        const g = gcdBig(a, b);

        if (denominator < 0n) {
            numerator = -numerator;
            denominator = -denominator;
        }

        this.numerator = numerator / g;
        this.denominator = denominator / g;
    }

    negate(): Fraction {
        return new Fraction(-this.numerator, this.denominator);
    }

    add(other: Fraction): Fraction {
        const numerator = this.numerator * other.denominator + other.numerator * this.denominator;
        const denominator = this.denominator * other.denominator;
        return new Fraction(numerator, denominator);
    }

    subtract(other: Fraction): Fraction {
        return this.add(other.negate());
    }

    multiply(other: Fraction): Fraction {
        const numerator = this.numerator * other.numerator;
        const denominator = this.denominator * other.denominator;
        return new Fraction(numerator, denominator);
    }

    divide(other: Fraction): Fraction {
        if (other.numerator === 0n) {
            throw new Error("Cannot divide by zero");
        }

        const numerator = this.numerator * other.denominator;
        const denominator = this.denominator * other.numerator;
        return new Fraction(numerator, denominator);
    }

    equals(other: Fraction): boolean {
        return this.numerator === other.numerator && this.denominator === other.denominator;
    }

    isZero(): boolean {
        return this.numerator === 0n;
    }

    sign(): number {
        if (this.numerator === 0n) {
            return 0;
        } else if (this.numerator > 0n) {
            return 1;
        } else {
            return -1;
        }
    }

    compareTo(other: Fraction): number {
        const left = this.numerator * other.denominator;
        const right = other.numerator * this.denominator;

        if (left < right) {
            return -1;
        } else if (left > right) {
            return 1;
        } else {
            return 0;
        }
    }

    toString(): string {
        if (this.denominator === 1n) {
            return this.numerator.toString();
        } else {
            return `${this.numerator}/${this.denominator}`;
        }
    }
}

export default Fraction;