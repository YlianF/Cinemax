'use strict';

const Joi = require('joi');

module.exports = [
    {
        // CREATE USER
        method: 'post',
        path: '/user',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    mail: Joi.string().required().min(3).example('john.doe@gmail.com').description('Mail of the user'),
                    username: Joi.string().required().min(3).example('JohnD').description('Username of the user'),
                    password: Joi.string().required().min(8).example('12345678').description('Password of the user')
                })
            }
        },
        handler: (request, h) => {

            const { userService } = request.services();

            return userService.create(request.payload);
        }
    },

    {
        // LOGIN
        method: 'post',
        path: '/user/login',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    mail: Joi.string().required().min(3).example('john.doe@gmail.com').description('Mail of the user'),
                    password: Joi.string().required().min(8).example('12345678').description('Password of the user')
                })
            }
        },
        handler: (request, h) => {

            const { userService } = request.services();

            return userService.login(request.payload);
        }
    },

    {
        // GET USER
        method: 'get',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number()
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.getUserById(request.params);
        }
    },

    {
        // GET ALL USERS
        method: 'get',
        path: '/users',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api']
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.getAllUsers();
        }
    },

    {
        // PATCH USER
        method: 'patch',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    mail: Joi.string().required().min(3).example('john.doe@gmail.com').description('Mail of the user'),
                    username: Joi.string().required().min(3).example('JohnD').description('Username of the user'),
                    password: Joi.string().required().min(8).example('12345678').description('Password of the user'),
                    role: Joi.string().required().example('user').description('Role of the user')
                }),
                params: Joi.object({
                    id: Joi.number()
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.patch(request.payload, request.params);
        }
    },

    {
        // PATCH MY ACCOUNT
        method: 'patch',
        path: '/user/modify',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    username: Joi.string().required().min(3).example('JohnD').description('Username of the user'),
                    password: Joi.string().required().min(8).example('12345678').description('Password of the user'),
                }),
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.patchLoggedAccount(request);
        }
    },

    {
        // DELETE USER
        method: 'delete',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number()
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.deleteUserById(request);
        }
    },

    {
        // DELETE USER
        method: 'delete',
        path: '/user/delete',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api']
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            await userService.deleteLoggedAccount(request);
            return '';
        }
    }

];

