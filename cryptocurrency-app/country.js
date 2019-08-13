const request = require('request');
const _ = require('lodash');


const GetCountry = (country) => {
    return new Promise((resolve, reject) => {
        request({
            uri: `https://restcountries.eu/rest/v2/name/${country}`,
            json: true
        }, (error, response, body) => {
            if(error) {
                reject("<p>Sorry, we cannot connect to the API.</p>");

            } else if(body.status == 404) {

                reject('<code>Country ' + body.message + '</code>');

            } else {     
                var countryInfo = body[0].currencies;

                resolve(countryInfo[0].code);
            }
        });
    });
}

module.exports = { GetCountry };