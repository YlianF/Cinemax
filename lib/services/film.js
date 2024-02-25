'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Encrypt = require('../tools/encrypt');
const { newFilm, patchFilm, deleteFilm } = require('../tools/mailer.js');

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

    async getFilmById(params) {

        const { Film } = this.server.models();

        return await Film.query().findById(params.id);
    }

    async patch(request) {

        const film = request.payload;
        const params = request.params;
        const { Film } = this.server.models();

        const { userService } = request.services();
        patchFilm(film, await userService.getMailsOfLikedFilm(params.id));
        return Film.query()
            .findById(params.id)
            .patch(film);
    }

    async deleteFilm(request) {

        const { Film } = this.server.models();
        const { favoritesService, userService } = request.services();
        const film = request.params;

        deleteFilm(await this.getFilmById(request.params), await userService.getMailsOfLikedFilm(request.params.id));
        await favoritesService.deleteFromFilm(film.id);
        return await Film.query().deleteById(film.id);
    }
};
