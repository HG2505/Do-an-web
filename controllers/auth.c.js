import bcrypt from 'bcryptjs';
import userM from '../models/user.m.js';

export default {
    // GET: Trang đăng nhập
    login: (req, res) => {
        if (req.session.user) return res.redirect('/');
        // SỬA: Tìm file login.hbs ngay trong views/
        res.render('login', { layout: 'main' }); 
    },

    // GET: Trang đăng ký
    register: (req, res) => {
        if (req.session.user) return res.redirect('/');
        // SỬA: Tìm file register.hbs ngay trong views/
        res.render('register', { layout: 'main' });
    },

    // POST: Xử lý đăng ký
    postRegister: async (req, res) => {
        const { username, password, name, email } = req.body;
        try {
            const existingUser = await userM.oneByUsername(username);
            if (existingUser) {
                return res.render('register', { // SỬA: render 'register'
                    layout: 'main',
                    errMsg: 'Tên đăng nhập đã tồn tại!',
                    username, name, email
                });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            const newUser = { username, password: hashPassword, name, email, role: 'user' };
            
            await userM.add(newUser);
            
            // SỬA: Chuyển hướng về /login (không có /auth)
            res.redirect('/login'); 

        } catch (error) {
            console.error(error);
            res.render('register', { layout: 'main', errMsg: 'Lỗi hệ thống!' });
        }
    },

    // POST: Xử lý đăng nhập
    postLogin: async (req, res) => {
        const { username, password, remember } = req.body;
        try {
            const user = await userM.oneByUsername(username);
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.render('login', { // SỬA: render 'login'
                    layout: 'main',
                    errMsg: 'Sai tên đăng nhập hoặc mật khẩu.',
                    username
                });
            }

            delete user.password;
            req.session.user = user;

            if (remember === 'on') {
                req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
            } else {
                req.session.cookie.expires = false;
            }

            const returnUrl = req.query.returnUrl || '/';
            res.redirect(returnUrl);

        } catch (error) {
            console.error(error);
            res.render('login', { layout: 'main', errMsg: 'Lỗi đăng nhập!' });
        }
    },

    // Đăng xuất
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) console.error(err);
            res.clearCookie('connect.sid');
            // SỬA: Chuyển hướng về /login
            res.redirect('/login');
        });
    }
};