'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('../tools/encrypt');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');
const { welcome, ban, accountModified } = require('../tools/mailer.js');

module.exports = class UserService extends Service {

    create(user) {

        const { User } = this.server.models();
        user.password = Encrypt.sha1(user.password);
        welcome(user);

        return User.query().insertAndFetch(user);
    }

    getAllUsers() {

        const { User } = this.server.models();

        return User.query();
    }

    getUserById(params) {

        const { User } = this.server.models();

        return User.query().findById(params.id);
    }

    async deleteUserById(request) {

        const { User } = this.server.models();
        const { favoritesService } = request.services();
        const user = request.params;

        ban(await this.getUserById(user));
        await favoritesService.deleteFromUser(user.id)
        return User.query().deleteById(user.id);
    }

    deleteLoggedAccount(request) {

        const { User } = this.server.models();

        return User.query()
            .where('mail', '=', request.auth.credentials.mail)
            .delete();
    }

    async login(user) {

        const { User } = this.server.models();
        const [userData] = await User.query()
            .where('mail', '=', user.mail);

        if (Encrypt.compareSha1(user.password, userData.password)) {
            return this.generateToken(userData);
        }

        return Boom.unauthorized('invalid credentials');
    }

    patch(user, params) {

        const { User } = this.server.models();

        accountModified(user);
        return User.query()
            .findById(params.id)
            .patch({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                password: Encrypt.sha1(user.password),
                role: user.role
            });
    }

    patchLoggedAccount(request) {

        const user = request.payload;
        const { User } = this.server.models();

        return User.query()
            .where('mail', '=', request.auth.credentials.mail)
            .patch({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                password: Encrypt.sha1(user.password),
            });
    }

    async getId(mail) {

        const { User } = this.server.models();

        const [user_id] = await User.query()
            .select('id')
            .where('mail', '=', mail);

        return user_id.id;
    }

    async getAllMails() {

        const { User } = this.server.models();

        const mails = await User.query()
            .select('mail');
        
        return mails.map(element => element.mail);
    }

    async getMailsOfLikedFilm(film_id) {

        const { User } = this.server.models();

        const mails = await User.query()
            .select('mail')
            .innerJoin('favorites', 'user.id', 'favorites.user_id')
            .where('favorites.film_id', '=', film_id);
        
            return mails.map(element => element.mail);
    }

    generateToken(userData) {

        return Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                mail: userData.mail,
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                scope: userData.role
            },
            {
                key: 'lorem ipsum dolor sit amet dorime iterime adapare dorime, ameno ameno latire latiremo, dorime',
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );
    }
};
