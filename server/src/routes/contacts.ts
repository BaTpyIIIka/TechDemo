import express from 'express';
import { authenticate } from '../middleware/auth';
import { getAllContacts, getContact, createContact, updateContact, deleteContact } from '../controllers/contactController';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContacts);
router.get('/:id', getContact);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
