// Import file db.js cùng thư mục
import db from './db.js';

const TBL_USERS = 'users';

export default {
    // Tìm user bằng username
    oneByUsername: async (username) => {
        const user = await db(TBL_USERS)
            .where('username', username)
            .first();
        return user;
    },

    // Thêm user mới (Đăng ký)
    add: async (user) => {
        // Trả về ID vừa tạo
        const result = await db(TBL_USERS).insert(user).returning('id');
        return result[0].id;
    }
};