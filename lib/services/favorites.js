'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavoritesService extends Service {

    async favAFilm(request) {

        const { Favorites } = this.server.models();
        const { userService } = request.services();

        const data = request.params;
        data.user_id = await userService.getId(request.auth.credentials.mail);

        try {
            return await Favorites.query().insert(data);
        } catch (error) {
            return Boom.boomify(new Error('you already liked that film or it doesn\'t exist'), { statusCode: 400 });
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
            return Boom.boomify(new Error('you haven\'t liked that film or it doesn\'t exist'), { statusCode: 400 });
        }
        return '';
    }

    async getMyFavorites(request) {

        const { Favorites } = this.server.models();

        try {
            return await Favorites.query()
                .select('film.*')
                .innerJoin('user', 'user.id', 'favorites.user_id')
                .innerJoin('film', 'film.id', 'favorites.film_id')
                .where('user.mail', '=', request.auth.credentials.mail)
                .throwIfNotFound({
                    message: 'The user has no favorite films...'
                });
        } catch (error) {
            return Boom.boomify(new Error(error.message), { statusCode: 400 });
        }
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
