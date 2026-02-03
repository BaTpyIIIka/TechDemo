import express from 'express';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/roleCheck';
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', requireAdmin, createUser);
router.put('/:id', requireAdmin, updateUser);
router.delete('/:id', requireAdmin, deleteUser);

export default router;
