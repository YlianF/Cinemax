'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Encrypt = require('../tools/encrypt');
const UserService = require('./user')

module.exports = class FavoritesService extends Service {

    async favAFilm(request) {

        const { Favorites } = this.server.models();
        const { userService } = request.services();

        const data = request.params;
        data.user_id = await userService.getId(request.auth.credentials.mail);

        try {
            return await Favorites.query().insert(data);
        } catch (error) {
            return Boom.boomify(new Error('you can\'t fav a film you already fav'), { statusCode: 400 });
        }
    }

    async unfavAFilm(request) {

        const { Favorites } = this.server.models();
        const { userService } = request.services();

        const data = request.params;
        data.user_id = await userService.getId(request.auth.credentials.mail);

        const result = await Favorites.query()
            .delete()
            .where('user_id', '=', data.user_id)
            .where('film_id', '=', data.film_id);
        
        if (result === 0) {
            return Boom.boomify(new Error('you can\'t unfav a film you haven\'t fav'), { statusCode: 400 });
        }
        return '';
    }

    async getMyFavorites(request) {

        const { Favorites } = this.server.models();

        return await Favorites.query()
            .select('film.*')
            .innerJoin('user', 'user.id', 'favorites.user_id')
            .innerJoin('film', 'film.id', 'favorites.film_id')
            .where('user.mail', '=', request.auth.credentials.mail);
    }

    async deleteFromUser(id) {

        const { Favorites } = this.server.models();

        return await Favorites.query()
            .delete()
            .where('user_id', '=', id)
    }

    async deleteFromFilm(id) {

        const { Favorites } = this.server.models();
        
        return await Favorites.query()
            .delete()
            .where('film_id', '=', id)
    }
};
