'use strict';

module.exports = {
    scheme: 'jwt',
    options: {
        keys: 'lorem ipsum dolor sit amet dorime iterime adapare dorime, ameno ameno latire latiremo, dorime',
        verify: {
            aud: 'urn:audience:iut',
            iss: 'urn:issuer:iut',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15
        },
        validate: (artifacts, request, h) => {

            return {
                isValid: true,
                credentials: artifacts.decoded.payload
            };
        }
    }
};
