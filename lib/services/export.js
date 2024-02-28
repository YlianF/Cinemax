'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const { exportFilms } = require('../tools/mailer.js');
let converter = require('json-2-csv');

module.exports = class ExportService extends Service {

    async exportFilms(request) {

        const { filmService } = request.services();

        const films = await filmService.getAllFilms();
        const csv = converter.json2csv(films);
        const mail = request.auth.credentials.mail;
        exportFilms(csv, mail);

        return '';
    }
}