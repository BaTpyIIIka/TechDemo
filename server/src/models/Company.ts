import pool from '../config/database';

export interface Company {
  id: number;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCompanyDTO {
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  created_by?: number;
}

export interface UpdateCompanyDTO {
  name?: string;
  description?: string;
  industry?: string;
  website?: string;
}

export class CompanyModel {
  static async create(companyData: CreateCompanyDTO): Promise<Company> {
    const result = await pool.query(
      `INSERT INTO companies (name, description, industry, website, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        companyData.name,
        companyData.description,
        companyData.industry,
        companyData.website,
        companyData.created_by,
      ]
    );

    return result.rows[0];
  }

  static async findById(id: number): Promise<Company | null> {
    const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findAll(filters?: { search?: string }): Promise<Company[]> {
    let query = 'SELECT * FROM companies';
    const values: any[] = [];

    if (filters?.search) {
      query += ' WHERE name ILIKE $1 OR description ILIKE $1 OR industry ILIKE $1';
      values.push(`%${filters.search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id: number, companyData: UpdateCompanyDTO): Promise<Company | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (companyData.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(companyData.name);
    }
    if (companyData.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(companyData.description);
    }
    if (companyData.industry !== undefined) {
      updates.push(`industry = $${paramCount++}`);
      values.push(companyData.industry);
    }
    if (companyData.website !== undefined) {
      updates.push(`website = $${paramCount++}`);
      values.push(companyData.website);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE companies SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM companies WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  static async hasRelatedData(id: number): Promise<boolean> {
    const contactsResult = await pool.query('SELECT COUNT(*) FROM contacts WHERE company_id = $1', [id]);
    const opportunitiesResult = await pool.query('SELECT COUNT(*) FROM opportunities WHERE company_id = $1', [id]);

    return parseInt(contactsResult.rows[0].count) > 0 || parseInt(opportunitiesResult.rows[0].count) > 0;
  }
}
