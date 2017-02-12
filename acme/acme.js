/* ACME Auto dummy REST application */

/* Base requirements and config */
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid'); // Gives us nice and fairly random order IDs

/* Dummy api_key */
const api_key = "cascade.53bce4f1dfa0fe8e7ca126f91b35d3a6";

/* Dummy entries for model and package */
const models = [ 'anvil', 'wile', 'roadrunner' ];
const packages = [ 'std', 'super', 'elite' ];

/* Create our application and models */
var app = express();

/* Configure the express app to use body-parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

/* Base API */
const api = '/acme/api/v45.1';

/* Routes. */
app.post(api + '/order', function(req, res) {
    if(req.body.api_key = api_key) {
        console.log("Wiley wants something new...");

        let model = req.body.model;
        let package = req.body.package;

        let order = {};

        if(models.indexOf(model) !== -1 && packages.indexOf(package) !== -1) {
            console.log("...and it's something we carry. Sell!");

            order = {
                success: true,
                message: "Thank you for ordering from ACME!",
                data: [
                    {
                        order: uuid.v4(),
                    }
                ]
            };
        } else {
            console.log("...and it's either out of stock or we don't sell it, which is impossible because we're ACME!");
            order = {
                success: false,
                message: "Sorry, Wile E! You'll have to catch that roadrunner some other way!"
            };
        }
        res.json(order);
    } else {
        res.json({ success: false, message: "You're not Wile E. Coyote!"});
    }
});

app.listen(3050, function () {
    console.log('ACME is readly for business!');
});
