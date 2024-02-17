'use strict';

const nodemailer = require('nodemailer');
const amqp = require('amqplib/callback_api');

function sendMail(data) {

    // Generate SMTP service account from ethereal.email
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'bertha88@ethereal.email',
                pass: 'zWQMETVVvrBeUGvfHh'
            }
        });

        // Message object
        const message = {
            from: data.sender,
            to: data.receiver,
            subject: data.objet,
            text: data.content,
            html: '<p>' + data.content + '</p>'
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }

            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
}


amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        let queue = 'mailer queue';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            const mail = JSON.parse(msg.content);
            sendMail(mail);
        }, {
            noAck: true
        });
    });
});