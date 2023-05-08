import { Vector } from "../math/vector.js";

export class Matrix {
	private array: number[][];

	private static sign(number: number): number { return number % 2 == 0 ? 1 : -1; }
	private testSquare() { if (this.height() != this.width()) throw new Error("Non-square matrix"); }

	constructor(p_width: number, p_height: number)
	constructor(p_width: number, p_height: number, p_value: number)
	constructor(p_array: Array<Array<number>>)
	constructor(p_matrix: Matrix)
	constructor(p_1, p_2?, p_3?) {
		if (typeof p_1 === 'number' && typeof p_2 === 'number') {
			this.array = Array.from({ length: p_1 }, () => Array(p_2).fill(p_3 ?? 0));
		}
		else if (p_1 instanceof Array<Array<number>>) {
			this.array = p_1;
		}
		else if (p_1 instanceof Matrix) {
			this.array = p_1.array.slice();
		}
	}

	width() { return this.array[0].length; }
	height() { return this.array.length; }

	values() {
		return this.array.map((subarray) => { return subarray.slice(); });
	}

	/**
	 * Create square identity matrix
	 * @param p_size side length
	 * @returns NxN matrix with 1's on the diagonal
	 */
	static identity(p_size: number): Matrix {
		let identitymatrix = new Matrix(p_size, p_size);

		for (let i = 0; i < identitymatrix.width(); i++) {
			identitymatrix.array[i][i] = 1.0;
		}

		return identitymatrix;
	}

	/**
	 * Flip the matrix along it's diagonal
	 * @returns transposed matrix
	 */
	transpose(): Matrix {
		let transposedmatrix = new Matrix(this.height(), this.width());

		for (let m = 0; m < this.width(); m++) {
			for (let n = 0; n < this.height(); n++) {
				transposedmatrix.array[n][m] = this.array[m][n];
			}
		}

		return transposedmatrix;
	}

	multiply(p_scalar: number)
	multiply(p_M: Matrix)
	multiply(p_1): Matrix {
		if (typeof p_1 === 'number') {
			let multipliedmatrix = new Matrix(this.width(), this.height());

			for (let m = 0; m < this.width(); m++) {
				for (let n = 0; n < this.height(); n++) {
					multipliedmatrix.array[m][n] = (this.array[m][n] * p_1);
				}
			}

			return multipliedmatrix;
		}
		if (p_1 instanceof Matrix) {
			if (this.height() != p_1.width()) throw new Error("Size mismathch");

			let multipliedmatrix = new Matrix(this.height(), p_1.width());

			let p_transposed = p_1.transpose();

			for (let m = 0; m < this.height(); m++) {
				for (let n = 0; n < p_1.width(); n++) {
					multipliedmatrix.array[m][n] = Vector.dot(new Vector(this.array[m]), new Vector(p_transposed.array[n]));
				}
			}

			return multipliedmatrix;
		}
	}

	divide(p_scalar: number): Matrix
	divide(p_M: Matrix): Matrix
	divide(p_1): Matrix {
		if (typeof p_1 === 'number') {
			return this.multiply(1 / p_1);
		}
		if (p_1 instanceof Matrix)

			if (this.determinant() == 0 || p_1.determinant() == 0)
				throw new Error("Division not possible");

		return this.multiply(p_1.inverse());
	}

	add(p_M: Matrix): Matrix {
		if (this.height() != p_M.height() || this.width() != p_M.width()) throw new Error("Size mismathch");

		let sumMatrix = new Matrix(this.width(), this.height());

		for (let m = 0; m < this.height(); m++) {
			for (let n = 0; n < this.width(); n++) {
				sumMatrix.array[m][n] = this.array[m][n] + p_M.array[m][n];
			}
		}

		return sumMatrix;
	}

	subtract(p_M: Matrix): Matrix {
		return this.add(p_M.multiply(-1));
	}

	static submatrix(p_M: Matrix, p_i: number, p_j: number): Matrix {
		if (p_i > p_M.height() || p_j > p_M.width()) throw new Error("Index out of bounds");
		if (p_M.width() < 2 && p_M.height() < 2) return p_M;

		let submatrix = new Matrix(p_M.height() - 1, p_M.width() - 1);

		for (let m = 0; m < p_M.height(); m++) {
			if (m == p_i - 1) continue;
			for (let n = 0; n < p_M.width(); n++) {
				if (n == p_j - 1) continue;
				let mM = m < p_j ? m : m - 1;
				let nM = n < p_j ? n : n - 1;
				submatrix.array[mM][nM] = p_M.array[m][n];
			}
		}

		return submatrix;
	}

	submatrix(p_i: number, p_j: number): Matrix {
		return Matrix.submatrix(this, p_i, p_j);
	}

	static determinant(p_M: Matrix): number {
		p_M.testSquare();

		if (p_M.height() == 1 && p_M.width() == 1) {
			return p_M.array[0][0];
		}

		if (p_M.height() == 2 && p_M.width() == 2) {
			return p_M.array[0][0] * p_M.array[1][1] - p_M.array[1][0] * p_M.array[0][1];
		}

		let determinantSum = 0;

		for (let n = 0; n < p_M.width(); n++) {
			determinantSum += Matrix.sign(n) * p_M.array[0][n] * p_M.submatrix(1, n + 1).determinant();
		}

		return determinantSum;
	}

	determinant(): number {
		return Matrix.determinant(this);
	}

	static minor(p_M: Matrix, p_i: number, p_j: number): number {
		return p_M.submatrix(p_i, p_j).determinant();
	}

	minor(p_i: number, p_j: number): number {
		return Matrix.minor(this, p_i, p_j);
	}

	static cofactor(p_M: Matrix, p_i: number, p_j: number): number
	static cofactor(p_M: Matrix): Matrix
	static cofactor(p_M: Matrix, p_i?: number, p_j?: number): Matrix | number {
		if (p_i && p_j) {
			return Matrix.sign(p_i + p_j) * p_M.minor(p_i, p_j);
		}

		let cofactorMatrix = new Matrix(p_M.height(), p_M.width());

		for (let i = 1; i <= p_M.height(); i++) {
			for (let j = 1; j <= p_M.width(); j++) {
				cofactorMatrix.array[i - 1][j - 1] = Matrix.cofactor(p_M, i, j);
			}
		}

		return cofactorMatrix;
	}

	static adjoint(p_M: Matrix): Matrix {
		p_M.testSquare();

		return Matrix.cofactor(p_M).transpose();
	}

	adjoint(): Matrix {
		return Matrix.adjoint(this);
	}

	static inverse(p_M: Matrix): Matrix {
		p_M.testSquare();

		let determinant = p_M.determinant();

		if (determinant == 0)
			throw new Error("Inverse does not exist");

		return p_M.adjoint().divide(determinant);
	}

	inverse(): Matrix {
		return Matrix.inverse(this);
	}

	static pow(p_M: Matrix, p_power: number): Matrix {
		p_M.testSquare();

		if (p_power == 0)
			return Matrix.identity(p_M.height());

		let powermatrix: Matrix;

		if (p_power < 0) {
			powermatrix = p_M.inverse();
			p_power *= -1;
		}
		else {
			powermatrix = p_M;
		}

		for (let i = 1; i < p_power; i++) {
			powermatrix = (powermatrix.multiply(p_M));
		}

		return powermatrix;
	}

	static trace(p_M: Matrix): number {
		p_M.testSquare();

		let traceSum = 0;

		for (let i = 0; i < p_M.width(); i++) {
			traceSum += p_M.array[i][i];
		}

		return traceSum;
	}
}
