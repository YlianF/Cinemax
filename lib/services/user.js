'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('../tools/encrypt');
const Boom = require('@hapi/boom');

module.exports = class UserService extends Service {

    create(user) {

        const { User } = this.server.models();
        user.password = Encrypt.sha1(user.password);

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
        const [userPassword] = await User.query()
            .select('password')
            .where('mail', '=', user.mail);

        if (Encrypt.compareSha1(user.password, userPassword.password)) {
            return { login: 'successful' };
        }

        return Boom.unauthorized('invalid credentials');
    }

    patch(user, params) {

        const { User } = this.server.models();

        User.query()
            .findById(params.id)
            .patch({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                password: Encrypt.sha1(user.password)
            });
        return 'success';
    }
};
