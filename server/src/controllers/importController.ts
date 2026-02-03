import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { importService } from '../services/importService';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: '/tmp/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  },
});

export const importData = async (req: AuthRequest, res: Response) => {
  try {
    const { entity_type, column_mapping } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!entity_type || !column_mapping) {
      return res.status(400).json({ error: 'entity_type and column_mapping are required' });
    }

    const mapping = JSON.parse(column_mapping);
    const result = await importService.importFile(file.path, entity_type, mapping, req.user?.id);

    res.json(result);
  } catch (error: any) {
    console.error('Import error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const parseFile = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const columns = await importService.parseHeaders(file.path);

    res.json({ columns });
  } catch (error: any) {
    console.error('Parse file error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
