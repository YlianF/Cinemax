'use strict';

require('dotenv').config();
const { Service } = require('@hapipal/schmervice');
const Encrypt = require('../tools/encrypt');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');
const { welcome, ban, accountModified, terminateAccount } = require('../tools/mailer.js');

module.exports = class UserService extends Service {

    async create(user) {

        const { User } = this.server.models();
        
        const [userData] = await User.query()
            .where('mail', '=', user.mail);
            
        if (userData) {
            return Boom.boomify(new Error('this email address is already used'), { statusCode: 400 })
        } else {
            user.password = Encrypt.sha1(user.password);
            welcome(user);
            return User.query().insertAndFetch(user);
        }
    }

    async getAllUsers() {

        const { User } = this.server.models();

        return await User.query();
    }

    async getUserById(params) {

        const { User } = this.server.models();

        try {
            return await User.query()
                .findById(params.id)
                .throwIfNotFound({
                    message: 'No user correspond to this id'
                });
        } catch (error) {
            return Boom.boomify(new Error(error.message), { statusCode: 400 });
        }
    }

    async deleteUserById(request) {

        const { User } = this.server.models();
        const { favoritesService } = request.services();
        const user = request.params;

        ban(await this.getUserById(user));
        await favoritesService.deleteFromUser(user.id)
        try {
            return await User.query()
                .deleteById(user.id)
                .throwIfNotFound({
                    message: 'No user correspond to this id'
                });
        } catch (error) {
            return Boom.boomify(new Error(error.message), { statusCode: 400 });
        }
    }

    async deleteLoggedAccount(request) {

        const { User } = this.server.models();
        const mail = request.auth.credentials.mail;

        terminateAccount(mail);
        try {
            return await User.query()
                .where('mail', '=', mail)
                .delete()
                .throwIfNotFound({
                    message: 'No user correspond to this id'
                });
        } catch (error) {
            return Boom.boomify(new Error(error.message), { statusCode: 400 });
        }
    }

    async login(user) {

        const { User } = this.server.models();
        
        try {
            const [userData] = await User.query()
                .where('mail', '=', user.mail)
                .throwIfNotFound({
                    message: 'No user correspond to this mail'
                });

            if (Encrypt.compareSha1(user.password, userData.password)) {
                return this.generateToken(userData);
            } else {
                return Boom.unauthorized('invalid credentials');
            }
        } catch (error) {
            return Boom.boomify(new Error(error.message), { statusCode: 400 });
        }
    }

    async patch(user, params) {

        const { User } = this.server.models();

        accountModified(user);
        try {
            return await User.query()
                .findById(params.id)
                .patch({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    password: Encrypt.sha1(user.password),
                    role: user.role
                })
                .throwIfNotFound({
                    message: 'No user correspond to this id'
                });
        } catch (error) {
            return Boom.boomify(new Error(error.message), { statusCode: 400 });
        }
    }

    async patchLoggedAccount(request) {

        const user = request.payload;
        const { User } = this.server.models();

        try {
            return await User.query()
                .where('mail', '=', request.auth.credentials.mail)
                .patch({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    password: Encrypt.sha1(user.password),
                })
                .throwIfNotFound({
                    message: 'No user correspond to this mail'
                });
        } catch (error) {
            return Boom.boomify(new Error(error.message), { statusCode: 400 });
        }
    }

    async getId(mail) {

        const { User } = this.server.models();

        try {
            const [user_id] = await User.query()
                .select('id')
                .where('mail', '=', mail)
                .throwIfNotFound({
                    message: 'No user correspond to this mail'
                });
            
            return user_id.id;
        } catch (error) {
            return Boom.boomify(new Error(error.message), { statusCode: 400 });
        }
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
                key: process.env.JWT_KEY,
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );
    }
};
