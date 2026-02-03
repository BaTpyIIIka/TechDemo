import pool from '../config/database';

export type OpportunityStage = 'screening' | 'deep_dive' | 'due_diligence' | 'signing' | 'closed';
export type OpportunityStatus = 'open' | 'won' | 'lost';

export interface Opportunity {
  id: number;
  name: string;
  company_id?: number;
  stage: OpportunityStage;
  amount?: number;
  expected_close_date?: Date;
  lead_source?: string;
  status?: OpportunityStatus;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateOpportunityDTO {
  name: string;
  company_id?: number;
  stage: OpportunityStage;
  amount?: number;
  expected_close_date?: Date;
  lead_source?: string;
  status?: OpportunityStatus;
  created_by?: number;
  contact_ids?: number[];
  tag_ids?: number[];
}

export interface UpdateOpportunityDTO {
  name?: string;
  company_id?: number;
  stage?: OpportunityStage;
  amount?: number;
  expected_close_date?: Date;
  lead_source?: string;
  status?: OpportunityStatus;
}

export interface OpportunityFilters {
  stage?: OpportunityStage;
  status?: OpportunityStatus;
  company_id?: number;
  created_by?: number;
  search?: string;
  date_from?: Date;
  date_to?: Date;
}

export class OpportunityModel {
  static async create(oppData: CreateOpportunityDTO): Promise<Opportunity> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO opportunities (name, company_id, stage, amount, expected_close_date, lead_source, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          oppData.name,
          oppData.company_id,
          oppData.stage,
          oppData.amount,
          oppData.expected_close_date,
          oppData.lead_source,
          oppData.status || 'open',
          oppData.created_by,
        ]
      );

      const opportunity = result.rows[0];

      // Add contacts
      if (oppData.contact_ids && oppData.contact_ids.length > 0) {
        for (const contactId of oppData.contact_ids) {
          await client.query(
            'INSERT INTO opportunity_contacts (opportunity_id, contact_id) VALUES ($1, $2)',
            [opportunity.id, contactId]
          );
        }
      }

      // Add tags
      if (oppData.tag_ids && oppData.tag_ids.length > 0) {
        for (const tagId of oppData.tag_ids) {
          await client.query(
            'INSERT INTO opportunity_tags (opportunity_id, tag_id) VALUES ($1, $2)',
            [opportunity.id, tagId]
          );
        }
      }

      await client.query('COMMIT');
      return opportunity;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<any | null> {
    const oppResult = await pool.query('SELECT * FROM opportunities WHERE id = $1', [id]);

    if (oppResult.rows.length === 0) {
      return null;
    }

    const opportunity = oppResult.rows[0];

    // Get company
    if (opportunity.company_id) {
      const companyResult = await pool.query('SELECT * FROM companies WHERE id = $1', [opportunity.company_id]);
      opportunity.company = companyResult.rows[0];
    }

    // Get contacts
    const contactsResult = await pool.query(
      `SELECT c.* FROM contacts c
       JOIN opportunity_contacts oc ON c.id = oc.contact_id
       WHERE oc.opportunity_id = $1`,
      [id]
    );
    opportunity.contacts = contactsResult.rows;

    // Get tags
    const tagsResult = await pool.query(
      `SELECT t.* FROM tags t
       JOIN opportunity_tags ot ON t.id = ot.tag_id
       WHERE ot.opportunity_id = $1`,
      [id]
    );
    opportunity.tags = tagsResult.rows;

    return opportunity;
  }

  static async findAll(filters?: OpportunityFilters): Promise<Opportunity[]> {
    let query = `
      SELECT o.*, c.name as company_name, u.email as created_by_email
      FROM opportunities o
      LEFT JOIN companies c ON o.company_id = c.id
      LEFT JOIN users u ON o.created_by = u.id
    `;
    const values: any[] = [];
    const conditions: string[] = [];
    let paramCount = 1;

    if (filters?.stage) {
      conditions.push(`o.stage = $${paramCount}`);
      values.push(filters.stage);
      paramCount++;
    }

    if (filters?.status) {
      conditions.push(`o.status = $${paramCount}`);
      values.push(filters.status);
      paramCount++;
    }

    if (filters?.company_id) {
      conditions.push(`o.company_id = $${paramCount}`);
      values.push(filters.company_id);
      paramCount++;
    }

    if (filters?.created_by) {
      conditions.push(`o.created_by = $${paramCount}`);
      values.push(filters.created_by);
      paramCount++;
    }

    if (filters?.search) {
      conditions.push(`o.name ILIKE $${paramCount}`);
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    if (filters?.date_from) {
      conditions.push(`o.expected_close_date >= $${paramCount}`);
      values.push(filters.date_from);
      paramCount++;
    }

    if (filters?.date_to) {
      conditions.push(`o.expected_close_date <= $${paramCount}`);
      values.push(filters.date_to);
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY o.created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id: number, oppData: UpdateOpportunityDTO): Promise<Opportunity | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (oppData.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(oppData.name);
    }
    if (oppData.company_id !== undefined) {
      updates.push(`company_id = $${paramCount++}`);
      values.push(oppData.company_id);
    }
    if (oppData.stage !== undefined) {
      updates.push(`stage = $${paramCount++}`);
      values.push(oppData.stage);
    }
    if (oppData.amount !== undefined) {
      updates.push(`amount = $${paramCount++}`);
      values.push(oppData.amount);
    }
    if (oppData.expected_close_date !== undefined) {
      updates.push(`expected_close_date = $${paramCount++}`);
      values.push(oppData.expected_close_date);
    }
    if (oppData.lead_source !== undefined) {
      updates.push(`lead_source = $${paramCount++}`);
      values.push(oppData.lead_source);
    }
    if (oppData.status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(oppData.status);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE opportunities SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM opportunities WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  static async addContact(opportunityId: number, contactId: number): Promise<void> {
    await pool.query(
      'INSERT INTO opportunity_contacts (opportunity_id, contact_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [opportunityId, contactId]
    );
  }

  static async removeContact(opportunityId: number, contactId: number): Promise<void> {
    await pool.query(
      'DELETE FROM opportunity_contacts WHERE opportunity_id = $1 AND contact_id = $2',
      [opportunityId, contactId]
    );
  }

  static async addTag(opportunityId: number, tagId: number): Promise<void> {
    await pool.query(
      'INSERT INTO opportunity_tags (opportunity_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [opportunityId, tagId]
    );
  }

  static async removeTag(opportunityId: number, tagId: number): Promise<void> {
    await pool.query(
      'DELETE FROM opportunity_tags WHERE opportunity_id = $1 AND tag_id = $2',
      [opportunityId, tagId]
    );
  }
}
