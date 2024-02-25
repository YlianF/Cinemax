'use strict';

const Joi = require('joi');

module.exports = [

    {
        // EXPORT FILMS
        method: 'post',
        path: '/export/films',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api']
        },
        handler: async (request, h) => {

            const { exportService } = request.services();

            return exportService.exportFilms(request);
        }
    }
];
