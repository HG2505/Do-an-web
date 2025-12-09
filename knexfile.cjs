// knexfile.cjs
require('dotenv').config();

// Kiểm tra xem biến môi trường có đọc được không
if (!process.env.DB_HOST) {
    console.error("❌ LỖI: Không tìm thấy file .env hoặc chưa cấu hình DB_HOST");
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // Lưu ý: Nếu chạy localhost thì bỏ dòng ssl đi hoặc để false
      ssl: { rejectUnauthorized: false }
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './db/migrations', // <-- Dòng này quan trọng nhất để sửa lỗi của bạn
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};