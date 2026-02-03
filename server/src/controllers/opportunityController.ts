import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { OpportunityModel } from '../models/Opportunity';
import { CommentModel } from '../models/Comment';
import { ReminderModel } from '../models/Reminder';

export const getAllOpportunities = async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      stage: req.query.stage as any,
      status: req.query.status as any,
      company_id: req.query.company_id ? parseInt(req.query.company_id as string) : undefined,
      created_by: req.query.created_by ? parseInt(req.query.created_by as string) : undefined,
      search: req.query.search as string,
      date_from: req.query.date_from ? new Date(req.query.date_from as string) : undefined,
      date_to: req.query.date_to ? new Date(req.query.date_to as string) : undefined,
    };

    const opportunities = await OpportunityModel.findAll(filters);
    res.json(opportunities);
  } catch (error: any) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const opportunity = await OpportunityModel.findById(parseInt(id));

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const comments = await CommentModel.findByOpportunity(parseInt(id));
    const reminders = await ReminderModel.findByOpportunity(parseInt(id));

    res.json({
      ...opportunity,
      comments,
      reminders,
    });
  } catch (error: any) {
    console.error('Get opportunity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const opportunityData = {
      ...req.body,
      created_by: req.user?.id,
    };

    const opportunity = await OpportunityModel.create(opportunityData);
    res.status(201).json(opportunity);
  } catch (error: any) {
    console.error('Create opportunity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const opportunity = await OpportunityModel.update(parseInt(id), req.body);

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    res.json(opportunity);
  } catch (error: any) {
    console.error('Update opportunity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await OpportunityModel.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error: any) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await CommentModel.create({
      opportunity_id: parseInt(id),
      user_id: req.user?.id,
      content,
    });

    res.status(201).json(comment);
  } catch (error: any) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addReminder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reminder_date, message } = req.body;

    const reminder = await ReminderModel.create({
      opportunity_id: parseInt(id),
      user_id: req.user?.id!,
      reminder_date: new Date(reminder_date),
      message,
    });

    res.status(201).json(reminder);
  } catch (error: any) {
    console.error('Add reminder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
