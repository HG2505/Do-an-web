import productM from '../models/product.m.js';

export default {
    index: async (req, res) => {
        try {
            // Lấy dữ liệu từ Model
            const list = await productM.getAll();
            
            // Render ra View (gửi kèm biến 'products')
            res.render('home', { 
                title: 'Trang chủ - PC Store',
                products: list 
            });
        } catch (err) {
            res.status(500).send('Lỗi Server: ' + err.message);
        }
    }
}   