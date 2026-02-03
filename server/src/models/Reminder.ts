import pool from '../config/database';

export interface Reminder {
  id: number;
  opportunity_id: number;
  user_id: number;
  reminder_date: Date;
  message?: string;
  sent: boolean;
  created_at: Date;
}

export interface CreateReminderDTO {
  opportunity_id: number;
  user_id: number;
  reminder_date: Date;
  message?: string;
}

export class ReminderModel {
  static async create(reminderData: CreateReminderDTO): Promise<Reminder> {
    const result = await pool.query(
      `INSERT INTO reminders (opportunity_id, user_id, reminder_date, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [reminderData.opportunity_id, reminderData.user_id, reminderData.reminder_date, reminderData.message]
    );

    return result.rows[0];
  }

  static async findPendingReminders(): Promise<any[]> {
    const result = await pool.query(
      `SELECT r.*, o.name as opportunity_name, u.email as user_email, u.first_name, u.last_name
       FROM reminders r
       JOIN opportunities o ON r.opportunity_id = o.id
       JOIN users u ON r.user_id = u.id
       WHERE r.sent = FALSE AND r.reminder_date <= CURRENT_TIMESTAMP
       ORDER BY r.reminder_date`,
      []
    );

    return result.rows;
  }

  static async markAsSent(id: number): Promise<void> {
    await pool.query('UPDATE reminders SET sent = TRUE WHERE id = $1', [id]);
  }

  static async findByOpportunity(opportunityId: number): Promise<Reminder[]> {
    const result = await pool.query(
      'SELECT * FROM reminders WHERE opportunity_id = $1 ORDER BY reminder_date',
      [opportunityId]
    );

    return result.rows;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM reminders WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }
}
