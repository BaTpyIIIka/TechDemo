import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../config/database';

export const getFunnelData = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        stage,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM opportunities
      WHERE status = 'open'
      GROUP BY stage
      ORDER BY
        CASE stage
          WHEN 'screening' THEN 1
          WHEN 'deep_dive' THEN 2
          WHEN 'due_diligence' THEN 3
          WHEN 'signing' THEN 4
          WHEN 'closed' THEN 5
        END
    `);

    res.json(result.rows);
  } catch (error: any) {
    console.error('Get funnel data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConversionData = async (req: AuthRequest, res: Response) => {
  try {
    const stages = ['screening', 'deep_dive', 'due_diligence', 'signing', 'closed'];
    const conversions = [];

    for (let i = 0; i < stages.length - 1; i++) {
      const currentStage = stages[i];
      const nextStage = stages[i + 1];

      const currentResult = await pool.query(
        'SELECT COUNT(*) FROM opportunities WHERE stage = $1',
        [currentStage]
      );

      const nextResult = await pool.query(
        'SELECT COUNT(*) FROM opportunities WHERE stage = $1',
        [nextStage]
      );

      const currentCount = parseInt(currentResult.rows[0].count);
      const nextCount = parseInt(nextResult.rows[0].count);

      const conversionRate = currentCount > 0 ? (nextCount / currentCount) * 100 : 0;

      conversions.push({
        from: currentStage,
        to: nextStage,
        conversion_rate: conversionRate.toFixed(2),
        from_count: currentCount,
        to_count: nextCount,
      });
    }

    res.json(conversions);
  } catch (error: any) {
    console.error('Get conversion data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTimelineData = async (req: AuthRequest, res: Response) => {
  try {
    const { period = 'month' } = req.query;

    let dateFormat = '%Y-%m';
    if (period === 'quarter') {
      dateFormat = '%Y-Q';
    } else if (period === 'year') {
      dateFormat = '%Y';
    }

    const result = await pool.query(`
      SELECT
        TO_CHAR(created_at, $1) as period,
        status,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM opportunities
      WHERE stage = 'closed'
      GROUP BY period, status
      ORDER BY period DESC
      LIMIT 12
    `, [dateFormat]);

    res.json(result.rows);
  } catch (error: any) {
    console.error('Get timeline data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTopManagers = async (req: AuthRequest, res: Response) => {
  try {
    const countResult = await pool.query(`
      SELECT
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        COUNT(o.id) as opportunity_count
      FROM users u
      LEFT JOIN opportunities o ON u.id = o.created_by
      GROUP BY u.id, u.email, u.first_name, u.last_name
      ORDER BY opportunity_count DESC
      LIMIT 10
    `);

    const amountResult = await pool.query(`
      SELECT
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        COALESCE(SUM(o.amount), 0) as total_amount
      FROM users u
      LEFT JOIN opportunities o ON u.id = o.created_by
      WHERE o.status = 'won'
      GROUP BY u.id, u.email, u.first_name, u.last_name
      ORDER BY total_amount DESC
      LIMIT 10
    `);

    res.json({
      by_count: countResult.rows,
      by_amount: amountResult.rows,
    });
  } catch (error: any) {
    console.error('Get top managers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOverview = async (req: AuthRequest, res: Response) => {
  try {
    const totalOppsResult = await pool.query('SELECT COUNT(*) FROM opportunities');
    const openOppsResult = await pool.query('SELECT COUNT(*) FROM opportunities WHERE status = \'open\'');
    const wonOppsResult = await pool.query('SELECT COUNT(*) FROM opportunities WHERE status = \'won\'');
    const lostOppsResult = await pool.query('SELECT COUNT(*) FROM opportunities WHERE status = \'lost\'');
    const totalValueResult = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM opportunities WHERE status = \'won\'');

    res.json({
      total_opportunities: parseInt(totalOppsResult.rows[0].count),
      open_opportunities: parseInt(openOppsResult.rows[0].count),
      won_opportunities: parseInt(wonOppsResult.rows[0].count),
      lost_opportunities: parseInt(lostOppsResult.rows[0].count),
      total_value_won: parseFloat(totalValueResult.rows[0].total),
    });
  } catch (error: any) {
    console.error('Get overview error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
