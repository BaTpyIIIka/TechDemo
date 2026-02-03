import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CompanyModel } from '../models/Company';

export const getAllCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    const companies = await CompanyModel.findAll({ search: search as string });
    res.json(companies);
  } catch (error: any) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCompany = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const company = await CompanyModel.findById(parseInt(id));

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error: any) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCompany = async (req: AuthRequest, res: Response) => {
  try {
    const companyData = {
      ...req.body,
      created_by: req.user?.id,
    };

    const company = await CompanyModel.create(companyData);
    res.status(201).json(company);
  } catch (error: any) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCompany = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const company = await CompanyModel.update(parseInt(id), req.body);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error: any) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCompany = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = parseInt(id);

    const hasRelatedData = await CompanyModel.hasRelatedData(companyId);
    if (hasRelatedData) {
      return res.status(400).json({
        error: 'Cannot delete company with related contacts or opportunities'
      });
    }

    const deleted = await CompanyModel.delete(companyId);

    if (!deleted) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ message: 'Company deleted successfully' });
  } catch (error: any) {
    console.error('Delete company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
