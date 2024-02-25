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

function newFilm(film, mails) {
    const data = {
        sender: 'cinemax@cinemax.fr',
        receiver: mails,
        subject: 'Un nouveau film ! ' + film.title,
        content: 'Y a un super film qui vient de sortir ! \n'
            + film.title + '\n'
            + film.description + '\n'
            + 'fait par ' + film.director
    }
    sendToMailServer(data);
}

function ban(user) {
    const data = {
        sender: 'cinemax@cinemax.fr',
        receiver: user.mail,
        object: 'Tu a été banni :(',
        content: 'Un admin à supprimé ton compte, cheh'
    }
    sendToMailServer(data);
}

function accountModified(user) {
    const data = {
        sender: 'cinemax@cinemax.fr',
        receiver: user.mail,
        object: 'Ton compte à été modifié !',
        content: 'Un admin à modifié ton compte'
    }
    sendToMailServer(data);
}

function patchFilm(film, mails) {
    const data = {
        sender: 'cinemax@cinemax.fr',
        receiver: mails,
        object: 'Un film que tu aime à été modifié !',
        content: 'le film ' + film.title + ' à été modifié\n'
            + film.description + '\n'
            + 'fait par ' + film.director
    }
    sendToMailServer(data);
}

function deleteFilm(film, mails) {
    const data = {
        sender: 'cinemax@cinemax.fr',
        receiver: mails,
        object: 'Un film que tu aime à été supprimé !',
        content: 'le film ' + film.title + ' à été supprimé :('
    }
    sendToMailServer(data);
}

module.exports = {
    welcome, newFilm, accountModified, ban, patchFilm, deleteFilm
}