const express = require('express');
var app = express();
const hbs = require('hbs');
app.set('view engine', 'hbs');

var utils = require('./utils');
app.listen('8085', () => {
    console.log('Server is Running');

    utils.init();
});

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('form.hbs');
})

const { check, validationResult } = require('express-validator');


app.post('/', [
    check('firstName', 'First name should contain only letters').isAlpha(),
    check('userEmail', 'Please enter a valid email.').isEmail(),
    check('courseID', 'Course ID should only contain numbers').isNumeric(),
    check('courseID', 'Course ID should be exactly 4 digits').isLength({ min: 4, max: 4 })
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        
        res.render('form.hbs', {errorMsgs: errors.errors});
        
        return;
    } else {
        var db = utils.getDb();
        db.collection('users').insertOne({
            name: req.body.firstName,
            courseID: req.body.courseID,
            email: req.body.userEmail
        }, (err, result) => {
            if(err) {
                res.send('Unable to add student');
            }

            res.redirect('/user/' + result.ops[0].name + '/course/' + result.ops[0].courseID);
        })
    }

    
})


app.get('/user/:name/course/:courseID', (req, res) => {
    var db = utils.getDb();
    db.collection('users').find().toArray((err, students) => {
        if(err) res.send('Sorry, we can\'t find the students.');

        res.render('student.hbs', {studentsData: students});
    })
});

app.get('*', (req, res, next) => {
    if (req.url === '/' || req.url === '/user/:name/course/:courseID') {
        next();
    }

    res.send('<h4>Oppss, sorry! Nothing to see here.</h4>');
})