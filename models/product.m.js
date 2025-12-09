
import db from './db.js';

export default {
    // Lấy tất cả sản phẩm
    getAll: async () => {
        try {
            const products = await db('products').select('*');
            return products;
        } catch (error) {
            console.error("Lỗi lấy danh sách sản phẩm:", error);
            throw error;
        }
    },
    
    // Lấy sản phẩm nổi bật (ví dụ lấy 8 cái mới nhất)
    getTopNew: async () => {
         return await db('products')
            .select('*')
            .orderBy('id', 'desc')
            .limit(8);
    }
}