'use strict';

const Joi = require('joi');

module.exports = [

    {
        // FAV A FILM
        method: 'post',
        path: '/favorite/add/{film_id}',
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
        path: '/favorite/remove/{film_id}',
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
    },

    {
        // FAV A FILM
        method: 'get',
        path: '/favorite/myFavorites',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
        },
        handler: async (request, h) => {

            const { favoritesService } = request.services();

            return await favoritesService.getMyFavorites(request);
        }
    }
];
