import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import 'dotenv/config';

// Import các Router
import siteRouter from './routers/site.r.js';
import authRouter from './routers/auth.r.js';
// *Lưu ý: Đảm bảo các file này nằm trong thư mục 'routers' và có đuôi .js

const app = express();
const port = 3000;

// Cấu hình đường dẫn cho module ES (import.meta.url)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// 1. CẤU HÌNH SESSION
// ============================================================
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_123',
    resave: false,
    saveUninitialized: true,
    // Nên đặt cookie maxAge nếu muốn tính năng "Ghi nhớ đăng nhập" hoạt động lâu hơn
    cookie: { secure: false } 
}));

// 2. Middleware đọc dữ liệu
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Middleware User (Truyền user xuống View)
app.use((req, res, next) => {
    // Đặt biến cục bộ để sử dụng trong Handlebars
    if (req.session.user) {
        res.locals.user = req.session.user;
        res.locals.isAuth = true;
    } else {
        res.locals.isAuth = false;
    }
    // LƯU Ý: Nếu muốn dùng Bootstrap, cần đặt path cho public/assets
    res.locals.isAuth = req.session.isAuth || false; // Dùng req.session.isAuth nếu bạn đặt nó trong auth.c.js
    next();
});

// 4. Cấu hình Handlebars
const hbs = create({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: 'main',
    helpers: {
        sum: (a, b) => a + b,
        // Helper ifEquals đã đúng, dùng cho so sánh giá trị
        ifEquals: (a, b, options) => (a == b) ? options.fn(this) : options.inverse(this),
        // Helper pages đã đúng, dùng cho phân trang
        pages: function(n, options) {
            let accum = '';
            for (let i = 1; i <= n; ++i) {
                options.data.index = i;
                options.data.first = (i === 1);
                options.data.last = (i === n);
                accum += options.fn(i);
            }
            return accum;
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'assets')));


// ============================================================
// 5. KẾT NỐI ROUTER
// ============================================================

// 5a. Router XÁC THỰC (Phải đặt trước các route cần bảo vệ)
app.use('/', authRouter); 

// 5b. Router TRANG CHỦ & CÁC ROUTE KHÁC
app.use('/', siteRouter); 


// Khởi động Server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});