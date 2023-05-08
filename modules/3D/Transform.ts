import { Vector3D } from "../math/vector.js";
import { Matrix } from "../math/matrix.js";

export class Transform {
	private m_translationMatrix: Matrix;
	private m_rotationMatrix: Matrix;
	private m_scaleMatrix: Matrix;

	constructor() {
		this.m_translationMatrix = Matrix.identity(4);
		this.m_rotationMatrix = Matrix.identity(4);
		this.m_scaleMatrix = Matrix.identity(4);
	}

	css() {
		const array = this.matrix().values();
		return `transform: matrix3d(` +
			`${array[0][0]}, ${array[1][0]}, ${array[2][0]}, ${array[3][0]}, ` +
			`${array[0][1]}, ${array[1][1]}, ${array[2][1]}, ${array[3][1]}, ` +
			`${array[0][2]}, ${array[1][2]}, ${array[2][2]}, ${array[3][2]}, ` +
			`${array[0][3]}, ${array[1][3]}, ${array[2][3]}, ${array[3][3]}` +
			`);`;
	}

	matrix() {
		return this.m_translationMatrix.multiply(this.m_rotationMatrix).multiply(this.m_scaleMatrix);
	}

	rigth(): Vector3D {
		return new Vector3D([
			this.matrix().values()[0][0],
			this.matrix().values()[0][1],
			this.matrix().values()[0][2]
		]);
	}

	up(): Vector3D {
		return new Vector3D([
			this.matrix().values()[1][0],
			this.matrix().values()[1][1],
			this.matrix().values()[1][2]
		]);
	}

	forward(): Vector3D {
		return new Vector3D([
			this.matrix().values()[2][0],
			this.matrix().values()[2][1],
			this.matrix().values()[2][2]
		]);
	}

	position(): Vector3D {
		return new Vector3D([
			this.matrix().values()[3][0],
			this.matrix().values()[3][1],
			this.matrix().values()[3][2]
		]);
	}

	translate(p_x: number, p_y: number, p_z: number): void {
		const translation_matrix = new Matrix([
			[1, 0, 0, p_x],
			[0, 1, 0, p_y],
			[0, 0, 1, p_z],
			[0, 0, 0, 1]
		]);

		this.m_translationMatrix = this.m_translationMatrix.multiply(translation_matrix);
	}

	scale(p_x: number, p_y: number, p_z: number): void {
		const scale_matrix = new Matrix([
			[p_x, 0, 0, 0],
			[0, p_y, 0, 0],
			[0, 0, p_z, 0],
			[0, 0, 0, 1]
		]);

		this.m_translationMatrix = this.m_translationMatrix.multiply(scale_matrix);
	}

	rotate(p_x: number, p_y: number, p_z: number): void {
		const z_matrix = new Matrix([
			[Math.cos(p_z), -Math.sin(p_z), 0, 0],
			[Math.sin(p_z), Math.cos(p_z), 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		]);
		const y_matrix = new Matrix([
			[Math.cos(p_y), 0, Math.sin(p_y), 0],
			[0, 1, 0, 0],
			[-Math.sin(p_y), 0, Math.cos(p_y), 0],
			[0, 0, 0, 1]
		]);
		const x_matrix = new Matrix([
			[1, 0, 0, 0],
			[0, Math.cos(p_x), -Math.sin(p_x), 0],
			[0, Math.sin(p_x), Math.cos(p_x), 0],
			[0, 0, 0, 1]
		]);

		this.m_rotationMatrix = this.m_rotationMatrix.multiply(x_matrix.multiply(y_matrix).multiply(z_matrix));
	}
}