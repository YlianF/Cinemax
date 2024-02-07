'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Encrypt = require('../tools/encrypt');

module.exports = class FilmService extends Service {

    create(film) {

        const { Film } = this.server.models();
        return Film.query().insertAndFetch(film);
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

    deleteFilm(film) {

        const { Film } = this.server.models();

        return Film.query().deleteById(film.id);
    }
};
