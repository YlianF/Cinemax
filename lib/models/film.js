'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Film extends Model {

    static get tableName() {

        return 'film';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(3).example('Jurassic Park').description('the film title'),
            description: Joi.string().min(3).example('Dinosaurs').description('a description of the film'),
            director: Joi.string().min(3).example('Steven Spielberg').description('the film director'),
            releaseDate: Joi.date().example('2024-06-11 0:0:0').description('the release date of the movie'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }
};
