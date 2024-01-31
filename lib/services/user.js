'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class UserService extends Service {

    create(user) {

        const { User } = this.server.models();

        return User.query().insertAndFetch(user);
    }

    getAllUsers() {

        const { User } = this.server.models();

        return User.query();
    }

    getUserById(user) {

        const { User } = this.server.models();

        return User.query().findById(user.id);
    }

    deleteUserById(user) {
        const { User } = this.server.models();

        return User.query().deleteById(user.id);
    }
};
