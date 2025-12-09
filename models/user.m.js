const knex = require('../utils/db'); 

const TBL_USERS = 'users';

module.exports = {
    async oneByUsername(username) {
        return knex(TBL_USERS)
            .where('username', username)
            .first(); 
    },

    async add(user) {
        const result = await knex(TBL_USERS).insert(user).returning('id');
        return result[0].id;
    },
};