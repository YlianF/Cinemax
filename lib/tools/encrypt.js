'use strict';

const crypto = require('crypto');

function sha1(message) {
    return crypto.createHash('sha1').update(message, 'binary').digest('hex');
}

function compareSha1(plainPassword, encryptedPassword) {
    return sha1(plainPassword) === encryptedPassword;
}

module.exports = {
    sha1,
    compareSha1
};
