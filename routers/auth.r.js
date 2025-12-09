import express from 'express';
import authController from '../controllers/auth.c.js';

const router = express.Router();

// --- Định nghĩa các đường dẫn (Route) ---

// 1. Đăng nhập (GET để hiện form, POST để xử lý)
router.get('/login', authController.login);
router.post('/login', authController.postLogin);

// 2. Đăng ký (GET để hiện form, POST để xử lý)
router.get('/register', authController.register);
router.post('/register', authController.postRegister);

// 3. Đăng xuất
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);

export default router;