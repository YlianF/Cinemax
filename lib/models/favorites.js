'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Favorites extends Model {

    static get tableName() {

        return 'favorites';
    }

    static get joiSchema() {

        return Joi.object({
            user_id: Joi.number().integer().greater(0),
            film_id: Joi.number().integer().greater(0),
        });
    }

    $beforeInsert(queryContext) {

    }

    $beforeUpdate(opt, queryContext) {

    }
};
