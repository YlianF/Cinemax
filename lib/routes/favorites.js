'use strict';

const Joi = require('joi');

module.exports = [

    {
        // FAV A FILM
        method: 'post',
        path: '/favorite/{film_id}',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    film_id: Joi.number()
                })
            }
        },
        handler: async (request, h) => {

            const { favoritesService } = request.services();

            return await favoritesService.favAFilm(request);
        }
    },

    {
        // FAV A FILM
        method: 'post',
        path: '/unfavorite/{film_id}',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    film_id: Joi.number()
                })
            }
        },
        handler: async (request, h) => {

            const { favoritesService } = request.services();

            return await favoritesService.unfavAFilm(request);
        }
    }
];
