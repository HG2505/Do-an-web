/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // 1. Bảng USERS
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('username', 50).notNullable().unique();
    t.string('password', 255).notNullable();
    t.string('name', 100).notNullable();
    t.string('email', 100).notNullable().unique();
    t.string('role', 20).defaultTo('user');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // 2. Bảng CATEGORIES
  await knex.schema.createTable('categories', (t) => {
    t.increments('id').primary();
    t.string('title', 100).notNullable();
  });

  // 3. Bảng PRODUCTS
  await knex.schema.createTable('products', (t) => {
    t.increments('id').primary();
    t.string('title', 255).notNullable();
    t.decimal('price', 15, 0).notNullable();
    t.text('description');
    t.string('image', 255);
    t.string('brand', 50);
    t.integer('stock').defaultTo(0);
    
    // Khóa ngoại
    t.integer('category_id')
     .unsigned()
     .references('id')
     .inTable('categories')
     .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('users');
};