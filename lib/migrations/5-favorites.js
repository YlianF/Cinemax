'use strict';

module.exports = {

    async up(knex) {
        await knex.schema.dropTableIfExists('favorites');
        await knex.schema.createTable('favorites', (table) => {
            table.integer('user_id').unsigned()
            table.foreign('user_id').references( 'user.id' );
            table.integer('film_id').unsigned()
            table.foreign('film_id').references( 'film.id' );

            table.primary(['user_id', 'film_id']);
        });
    },

    async down(knex) {
        await knex.schema.dropTableIfExists('favorites');
    }
};
