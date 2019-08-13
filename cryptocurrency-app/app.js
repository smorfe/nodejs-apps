const express = require('express');
const hbs = require('hbs');
var app = express();

const fs = require('fs');
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


const _ = require('lodash');

const country = require('./country.js');
const conversion = require('./cryptocurrencyBitcoin.js');
const conversion2 = require('./cryptocurrencyEth.js');

hbs.registerHelper('formatTitle', (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
});

hbs.registerHelper('formatMoney', (n) => {
    var rounded = _.round(n, 2);
    return rounded.toLocaleString(2);
})

app.get('/country/:name', (req, res) => {
    country.GetCountry(req.params.name)
    .then((code, err) => {
        if(code) {
            res.render('nav.hbs', {
                countryName: req.params.name
            });
        } else {
            res.send(err);
        }
    })
    .catch((err) => {
        res.send(err);
    })
    

})



app.use('/country/:name/:crypto', (req, res) => {
    if(req.params.crypto == 'btc') {
        country.GetCountry(req.params.name)
        .then((code) => {
            return conversion.GetCountryBitcoin(code);
        })
        .then((data) => {
            res.render('info.hbs', {
                countryName: req.params.name,
                countryCode: data.toCurr,
                iconCode: data.icon,
                textIcon: data.textIcon,
                fromCurr: data.fromCurr,
                toCurr: data.toCurr,
                inCad: data.openNum,
                lastUpdate: data.lastUpdated,
                showHeader: true
            });
        })
        .catch((err) => {
            res.send(err);
        })
    }

    else if(req.params.crypto == 'eth') {
        country.GetCountry(req.params.name)
        .then((code) => {
            console.log(code);
            return conversion2.GetCountryBitcoin2(code);
        })
        .then((data) => {
            res.render('info.hbs', {
                countryName: req.params.name,
                countryCode: data.toCurr,
                iconCode: data.icon,
                textIcon: data.textIcon,
                fromCurr: data.fromCurr,
                toCurr: data.toCurr,
                inCad: data.openNum,
                lastUpdate: data.lastUpdated,
                showHeader: true
            });

        })
        .catch((err) => {
            res.send(err);
        })
    } 

    else {
        res.send('<p>Sorry, we can\'t find this cryptocurrency ('+ req.params.crypto +') associated with the country '+ req.params.name.toUpperCase() +'. </p>');
    }
})



app.listen('8081', () => {
    console.log('server is running');
})