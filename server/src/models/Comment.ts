import pool from '../config/database';

export interface Comment {
  id: number;
  opportunity_id: number;
  user_id?: number;
  content: string;
  created_at: Date;
}

export interface CreateCommentDTO {
  opportunity_id: number;
  user_id?: number;
  content: string;
}

export class CommentModel {
  static async create(commentData: CreateCommentDTO): Promise<Comment> {
    const result = await pool.query(
      `INSERT INTO comments (opportunity_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [commentData.opportunity_id, commentData.user_id, commentData.content]
    );

    return result.rows[0];
  }

  static async findByOpportunity(opportunityId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT c.*, u.email as user_email, u.first_name, u.last_name
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.opportunity_id = $1
       ORDER BY c.created_at DESC`,
      [opportunityId]
    );

    return result.rows;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }
}
