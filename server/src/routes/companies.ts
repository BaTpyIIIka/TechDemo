import express from 'express';
import { authenticate } from '../middleware/auth';
import { getAllCompanies, getCompany, createCompany, updateCompany, deleteCompany } from '../controllers/companyController';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllCompanies);
router.get('/:id', getCompany);
router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

export default router;
