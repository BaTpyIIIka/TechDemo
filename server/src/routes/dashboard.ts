import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getFunnelData,
  getConversionData,
  getTimelineData,
  getTopManagers,
  getOverview,
} from '../controllers/dashboardController';

const router = express.Router();

router.use(authenticate);

router.get('/funnel', getFunnelData);
router.get('/conversion', getConversionData);
router.get('/timeline', getTimelineData);
router.get('/top-managers', getTopManagers);
router.get('/overview', getOverview);

export default router;
