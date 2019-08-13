const request = require('request');
const express = require('express');
const hbs = require('hbs');
var app = express();

const fs = require('fs');
app.set('view engine', 'hbs');


const GetCountryBitcoin = (currCode) => {
    return new Promise((resolve, reject) => {
        request({
            uri: `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=${currCode}`,
            json: true
        }, (error, response, body) => {
            if(error) {
                reject("<p>Sorry, we cannot connect to the API.</p>");

            } else if(body.Response == 'Error') {
                reject('<code>Sorry, there is no data for the currency code: <strong>'+ currCode +'</strong>. Please, try again.</code>');

            } else {     
                var rawInfo = body.RAW.BTC[currCode];
                var displayInfo = body.DISPLAY.BTC[currCode];
                var btcCurrencyInfo = {
                    fromCurr: displayInfo.FROMSYMBOL,
                    toCurr: currCode,
                    lastUpdated: displayInfo.LASTUPDATE,
                    openNum: rawInfo.OPENDAY,
                    icon: 'https://www.cryptocompare.com' + displayInfo.IMAGEURL,
                    textIcon: rawInfo.FROMSYMBOL
                }

                resolve(btcCurrencyInfo);
            }
        });
    });
}

module.exports = { GetCountryBitcoin };