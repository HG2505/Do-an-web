import express from 'express';
import siteController from '../controllers/site.c.js';

const router = express.Router();

// Khi vào trang chủ (/) thì gọi controller index
router.get('/', siteController.index);

export default router;