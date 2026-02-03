import express from 'express';
import { authenticate } from '../middleware/auth';
import { importData, parseFile, upload } from '../controllers/importController';

const router = express.Router();

router.use(authenticate);

router.post('/parse', upload.single('file'), parseFile);
router.post('/import', upload.single('file'), importData);

export default router;
