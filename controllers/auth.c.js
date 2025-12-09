const userModel = require('../models/user.m');
const bcrypt = require('bcryptjs');


exports.getLogin = (req, res) => {
    if (req.session.isAuthenticated) {
        return res.redirect('/'); 
    }
    res.render('login', { layout: false, title: 'Đăng nhập' });
};

exports.getRegister = (req, res) => {
    res.render('register', { layout: false, title: 'Đăng ký' });
};


exports.postRegister = async (req, res) => {
    const { username, password, email, name } = req.body;
    
    if (await userModel.oneByUsername(username)) {
        return res.render('register', {
            layout: false,
            title: 'Đăng ký',
            errMsg: 'Tên đăng nhập đã tồn tại.',
            user: req.body 
        });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    await userModel.add({
        username,
        password_hash,
        email,
        name,
        is_admin: false
    });

    res.redirect('/login');
};


exports.postLogin = async (req, res) => {
    const { username, password, remember } = req.body;
    const user = await userModel.oneByUsername(username);

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.render('login', { 
            layout: false, 
            title: 'Đăng nhập', 
            errMsg: 'Tên đăng nhập hoặc mật khẩu không đúng.',
            username: username
        });
    }

    req.session.isAuthenticated = true;
    req.session.user = { 
        id: user.id, 
        username: user.username, 
        name: user.name, 
        is_admin: user.is_admin 
    };

    if (!remember) {
        req.session.cookie.maxAge = null;
    }

    const returnUrl = req.query.returnUrl || '/';
    res.redirect(returnUrl);
};


exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.redirect('/login');
    });
};