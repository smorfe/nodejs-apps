// https://api.nomics.com/v1/currencies/ticker?key=2018-09-demo-dont-deploy-b69315e440beb145&ids=BTC&convert=CAD

const request = require('request');
const express = require('express');
const hbs = require('hbs');
var app = express();
const _ = require('lodash');

const fs = require('fs');
app.set('view engine', 'hbs');

const GetCountryBitcoin2 = (currCode) => {
    return new Promise((resolve, reject) => {
        request({
            uri: `https://api.nomics.com/v1/currencies/ticker?key=4b7748f03401d9c8e0fa03e23df79fba&ids=ETH&convert=${currCode}`,
            json: true
        }, (error, response, body) => {
            if(response.statusCode >= 400 && response.statusCode <= 499) {
                reject('<code>Please, check the country code associated with this cryptocurrency.</code>');
            } else if(response.statusCode >= 500) {
                reject('<code>Sorry, we can\'t connect to the API.</code>');
            } else {  
               
                var info = body[0];   
                var btcCurrencyInfo = {
                    fromCurr: info.currency,
                    toCurr: currCode,
                    lastUpdated: info.price_date,
                    openNum: info.price,
                    icon: info.logo_url,
                    textIcon: info.id
                }

                resolve(btcCurrencyInfo);
                
                
                
            }
        });
    });
}

module.exports = { GetCountryBitcoin2 };