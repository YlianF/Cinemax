'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
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
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            tags: ['api']
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.getAllUsers();
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number()
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            await userService.deleteUserById(request.params);
            return '';
        }
    },
    {
        method: 'get',
        path: '/user/{id}',
        options: {
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
        method: 'post',
        path: '/user/login',
        options: {
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
        method: 'patch',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    mail: Joi.string().required().min(3).example('john.doe@gmail.com').description('Mail of the user'),
                    username: Joi.string().required().min(3).example('JohnD').description('Username of the user'),
                    password: Joi.string().required().min(8).example('12345678').description('Password of the user')
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
    }
];

