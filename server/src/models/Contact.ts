import pool from '../config/database';

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position?: string;
  company_id?: number;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateContactDTO {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position?: string;
  company_id?: number;
  created_by?: number;
}

export interface UpdateContactDTO {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  company_id?: number;
}

export class ContactModel {
  static async create(contactData: CreateContactDTO): Promise<Contact> {
    const result = await pool.query(
      `INSERT INTO contacts (first_name, last_name, email, phone, position, company_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        contactData.first_name,
        contactData.last_name,
        contactData.email,
        contactData.phone,
        contactData.position,
        contactData.company_id,
        contactData.created_by,
      ]
    );

    return result.rows[0];
  }

  static async findById(id: number): Promise<Contact | null> {
    const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findAll(filters?: { search?: string; company_id?: number }): Promise<Contact[]> {
    let query = `
      SELECT c.*, comp.name as company_name
      FROM contacts c
      LEFT JOIN companies comp ON c.company_id = comp.id
    `;
    const values: any[] = [];
    const conditions: string[] = [];
    let paramCount = 1;

    if (filters?.search) {
      conditions.push(`(c.first_name ILIKE $${paramCount} OR c.last_name ILIKE $${paramCount} OR c.email ILIKE $${paramCount})`);
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    if (filters?.company_id) {
      conditions.push(`c.company_id = $${paramCount}`);
      values.push(filters.company_id);
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY c.created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id: number, contactData: UpdateContactDTO): Promise<Contact | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (contactData.first_name !== undefined) {
      updates.push(`first_name = $${paramCount++}`);
      values.push(contactData.first_name);
    }
    if (contactData.last_name !== undefined) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(contactData.last_name);
    }
    if (contactData.email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(contactData.email);
    }
    if (contactData.phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(contactData.phone);
    }
    if (contactData.position !== undefined) {
      updates.push(`position = $${paramCount++}`);
      values.push(contactData.position);
    }
    if (contactData.company_id !== undefined) {
      updates.push(`company_id = $${paramCount++}`);
      values.push(contactData.company_id);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE contacts SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  static async findByCompany(companyId: number): Promise<Contact[]> {
    const result = await pool.query('SELECT * FROM contacts WHERE company_id = $1 ORDER BY created_at DESC', [companyId]);
    return result.rows;
  }
}
