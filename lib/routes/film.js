'use strict';

const Joi = require('joi');

module.exports = [
    {
        // CREATE FILM
        method: 'post',
        path: '/film',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(3).example('Jurassic Park').description('the film title'),
                    description: Joi.string().min(3).example('Dinosaurs').description('a description of the film'),
                    director: Joi.string().min(3).example('Steven Spielberg').description('the film director'),
                    releaseDate: Joi.date().example('2024-06-11 0:0:0').description('the release date of the movie')
                })
            }
        },
        handler: (request, h) => {

            const { filmService } = request.services();

            return filmService.create(request.payload);
        }
    },

    {
        // GET ALL FILMS
        method: 'get',
        path: '/films',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api']
        },
        handler: async (request, h) => {

            const { filmService } = request.services();

            return await filmService.getAllFilms();
        }
    },

    {
        // PATCH FILM
        method: 'patch',
        path: '/film/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(3).example('Jurassic Park').description('the film title'),
                    description: Joi.string().min(3).example('Dinosaurs').description('a description of the film'),
                    director: Joi.string().min(3).example('Steven Spielberg').description('the film director'),
                    releaseDate: Joi.date().example('2024-06-11 0:0:0').description('the release date of the movie')
                }),
                params: Joi.object({
                    id: Joi.number()
                })
            }
        },
        handler: async (request, h) => {

            const { filmService } = request.services();

            return await filmService.patch(request.payload, request.params);
        }
    },

    {
        // DELETE FILM
        method: 'delete',
        path: '/film/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number()
                })
            }
        },
        handler: async (request, h) => {

            const { filmService } = request.services();

            await filmService.deleteFilm(request);
            return '';
        }
    }

];

