import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session'; // Import session
import 'dotenv/config';

// Import Router
import siteRouter from './routers/site.r.js'; 

const app = express();
const port = 3000;

// Cấu hình đường dẫn
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Cấu hình Session (Quan trọng cho chức năng Đăng nhập sau này)
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // false khi chạy localhost
}));

// 2. Middleware để đọc dữ liệu từ Form và JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Middleware truyền thông tin User xuống View (Để hiển thị tên trên Menu)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
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
        // Helper so sánh (Dùng function thường để giữ context 'this')
        ifEquals: function (a, b, options) {
            return (a == b) ? options.fn(this) : options.inverse(this);
        },
        // Helper tạo vòng lặp số trang (Cho chức năng Phân trang của Member 3)
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

// Cấu hình file tĩnh (CSS, Ảnh, JS)
app.use(express.static(path.join(__dirname, 'assets')));

// 5. Kết nối Router (Thay thế cho route test cũ)
app.use('/', siteRouter);

// Khởi động Server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});