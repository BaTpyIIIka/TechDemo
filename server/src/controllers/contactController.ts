import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ContactModel } from '../models/Contact';

export const getAllContacts = async (req: AuthRequest, res: Response) => {
  try {
    const { search, company_id } = req.query;
    const contacts = await ContactModel.findAll({
      search: search as string,
      company_id: company_id ? parseInt(company_id as string) : undefined,
    });
    res.json(contacts);
  } catch (error: any) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getContact = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const contact = await ContactModel.findById(parseInt(id));

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error: any) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createContact = async (req: AuthRequest, res: Response) => {
  try {
    const contactData = {
      ...req.body,
      created_by: req.user?.id,
    };

    const contact = await ContactModel.create(contactData);
    res.status(201).json(contact);
  } catch (error: any) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateContact = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const contact = await ContactModel.update(parseInt(id), req.body);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error: any) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteContact = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await ContactModel.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error: any) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
