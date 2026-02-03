import pool from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  first_name?: string;
  last_name?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  role: 'admin' | 'user';
  first_name?: string;
  last_name?: string;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
  first_name?: string;
  last_name?: string;
}

export class UserModel {
  static async create(userData: CreateUserDTO): Promise<User> {
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userData.email, passwordHash, userData.role, userData.first_name, userData.last_name]
    );

    return result.rows[0];
  }

  static async findById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findAll(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  static async update(id: number, userData: UpdateUserDTO): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (userData.email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(userData.email);
    }
    if (userData.password !== undefined) {
      const passwordHash = await bcrypt.hash(userData.password, 10);
      updates.push(`password_hash = $${paramCount++}`);
      values.push(passwordHash);
    }
    if (userData.role !== undefined) {
      updates.push(`role = $${paramCount++}`);
      values.push(userData.role);
    }
    if (userData.first_name !== undefined) {
      updates.push(`first_name = $${paramCount++}`);
      values.push(userData.first_name);
    }
    if (userData.last_name !== undefined) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(userData.last_name);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
