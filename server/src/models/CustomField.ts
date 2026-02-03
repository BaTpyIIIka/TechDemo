import pool from '../config/database';

export type EntityType = 'opportunity' | 'company' | 'contact';
export type FieldType = 'text' | 'number' | 'date' | 'select';

export interface CustomField {
  id: number;
  entity_type: EntityType;
  field_name: string;
  field_type: FieldType;
  options?: string[];
  created_at: Date;
}

export interface CreateCustomFieldDTO {
  entity_type: EntityType;
  field_name: string;
  field_type: FieldType;
  options?: string[];
}

export interface CustomFieldValue {
  id: number;
  custom_field_id: number;
  entity_id: number;
  value: string;
  created_at: Date;
  updated_at: Date;
}

export class CustomFieldModel {
  static async create(fieldData: CreateCustomFieldDTO): Promise<CustomField> {
    const result = await pool.query(
      `INSERT INTO custom_fields (entity_type, field_name, field_type, options)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [fieldData.entity_type, fieldData.field_name, fieldData.field_type, fieldData.options]
    );

    return result.rows[0];
  }

  static async findByEntityType(entityType: EntityType): Promise<CustomField[]> {
    const result = await pool.query(
      'SELECT * FROM custom_fields WHERE entity_type = $1 ORDER BY created_at',
      [entityType]
    );

    return result.rows;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM custom_fields WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  static async setValue(customFieldId: number, entityId: number, value: string): Promise<CustomFieldValue> {
    const result = await pool.query(
      `INSERT INTO custom_field_values (custom_field_id, entity_id, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (custom_field_id, entity_id) DO UPDATE SET value = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [customFieldId, entityId, value]
    );

    return result.rows[0];
  }

  static async getValues(entityId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT cfv.*, cf.field_name, cf.field_type, cf.entity_type
       FROM custom_field_values cfv
       JOIN custom_fields cf ON cfv.custom_field_id = cf.id
       WHERE cfv.entity_id = $1`,
      [entityId]
    );

    return result.rows;
  }

  static async deleteValue(customFieldId: number, entityId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM custom_field_values WHERE custom_field_id = $1 AND entity_id = $2',
      [customFieldId, entityId]
    );
    return result.rowCount! > 0;
  }
}
