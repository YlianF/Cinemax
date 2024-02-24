'use strict';

const Boom = require('@hapi/boom');
const amqp = require('amqplib/callback_api');


function sendToMailServer(data) {

    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            const queue = 'mailer queue';

            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));

            setTimeout(function() {
                connection.close();
            }, 500);
        });
    });
}

function welcome(user) {
    const data = {
        sender: 'cinemax@cinemax.fr',
        receiver: user.mail,
        object: 'bienvenue sur cinemax !',
        content: 'fait comme chez toi, met toi à l\'aise'
    }
    sendToMailServer(data);
}

module.exports = {
    welcome
}