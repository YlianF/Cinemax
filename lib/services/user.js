'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('../tools/encrypt');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');
const { welcome } = require('../tools/mailer.js');

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

    deleteUserById(user) {

        const { User } = this.server.models();

        return User.query().deleteById(user.id);
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
