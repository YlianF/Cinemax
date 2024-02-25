'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Encrypt = require('../tools/encrypt');
const { newFilm } = require('../tools/mailer.js');

module.exports = class FilmService extends Service {

    async create(request) {

        const film = request.payload;

        const { Film } = this.server.models();
        const { userService } = request.services();

        const mails = await userService.getAllMails();
        newFilm(film, mails);

        return await Film.query().insertAndFetch(film);
    }

    getAllFilms() {

        const { Film } = this.server.models();

        return Film.query();
    }

    patch(film, params) {

        const { Film } = this.server.models();
        return Film.query()
            .findById(params.id)
            .patch(film);
    }

    async deleteFilm(request) {

        const { Film } = this.server.models();
        const { favoritesService } = request.services();
        const film = request.params;

        await favoritesService.deleteFromFilm(film.id);
        return await Film.query().deleteById(film.id);
    }
};
