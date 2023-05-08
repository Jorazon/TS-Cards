import { Matrix } from "../math/matrix.js";

export class Vector {
	protected array: number[];

	constructor(p_array: number[])
	constructor(p_V: Vector)
	constructor(p_1) {
		if (p_1 instanceof Array<number>) {
			this.array = p_1;
		}
		else if (p_1 instanceof Vector) {
			this.array = p_1.array;
		}
	}

	dimension(): number {
		return this.array.length;
	}

	multiply(p_scalar: number): Vector {
		return new Vector(this.array.map(value => value * p_scalar));
	}

	divide(p_scalar: number): Vector {
		return this.multiply(1 / p_scalar);
	}

	add(p_other: Vector): Vector {
		let largest_size = Math.max(this.array.length, p_other.array.length);
		let temp_array = [];
		for (let index = 0; index < largest_size; index++) {
			temp_array.push((this.array[index] ?? 0) + (p_other.array[index] ?? 0));
		}
		return new Vector(temp_array);
	}

	subtract(p_other: Vector): Vector {
		return this.add(p_other.multiply(-1));
	}

	static dot(p_Va: Vector, p_Vb: Vector): number {
		if (p_Va.array.length != p_Vb.array.length) {
			throw new Error(`Dimension mismathch. Vector A is ${p_Va.array.length}D, Vector B is ${p_Vb.array.length}D.`);
		}

		let squaresum = 0;

		for (let index = 0; index < p_Va.array.length; index++) {
			squaresum += p_Va.array[index] * p_Vb.array[index];
		}

		return squaresum;
	}

	dot(p_other: Vector): number {
		return Vector.dot(this, p_other);
	}

	length(): number {
		return Math.sqrt(this.dot(this));
	}

	normalized(): Vector {
		return this.divide(this.length());
	}

	/**
	 * Distance between two points
	 * @param p_Va Vector a
	 * @param p_Vb Vector b
	 * @returns distance
	 */
	static distance(p_Va: Vector, p_Vb: Vector): number {
		return p_Vb.subtract(p_Va).length();
	}

	/**
	 * Angle between two vectors
	 * @param p_Va Vector a
	 * @param p_Vb Vector b
	 * @returns angle in radians
	 */
	static angle(p_Va: Vector, p_Vb: Vector): number {
		return Math.acos(Vector.dot(p_Va, p_Vb) / (p_Va.length() * p_Vb.length()));
	}
}

export class Vector3D extends Vector {
	constructor(p_array: number[]) {
		let three_array = new Array(3);
		for (let index = 0; index < 3; index++) {
			three_array[index] = p_array[index] ?? 0;
		}
		super(three_array);
	}

	/**
	 * Calculate perpendicular vector
	 * @param p_Va Vector a
	 * @param p_Vb Vector b
	 * @returns a vector that is perpendicular to both Va and Vb
	 */
	static cross(p_Va: Vector3D, p_Vb: Vector3D): Vector3D {
		let matrix = new Matrix([
			[1, 1, 1],
			p_Va.array,
			p_Vb.array
		]);

		return new Vector3D([
			Matrix.minor(matrix, 1, 1),
			Matrix.minor(matrix, 1, 2),
			Matrix.minor(matrix, 1, 3)
		]);
	}

	/**
	 * Calculate the volume of the parallelepiped defined by the three given vectors
	 * @param p_Va Vector a
	 * @param p_Vb Vector b
	 * @param p_Vc Vector c
	 * @returns volume
	 */
	static tripleProduct(p_Va: Vector3D, p_Vb: Vector3D, p_Vc: Vector3D): number {
		return Vector3D.dot(p_Va, Vector3D.cross(p_Vb, p_Vc));
	}
}