/* Rainer dummy REST application */

/* Base requirements and config */
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid'); // Gives us nice and fairly random order IDs

/* Dummy nonce token */
const nonce_token = "ff6bfd673ab6ae03d8911";

/* Dummy storefront identifier for CCAS */
const storefront = "ccas­bb9630c04f"

/* Dummy entries for model and package */
const models = [ 'pugetsound', 'olympic' ];
const customs = [ 'mtn', 'ltd', '14k' ];

/* Create our application and models */
var app = express();

/* Configure the express app to use body-parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

/* Base API */
const api = '/r';

/* Routes. */
app.get(api + '/nonce_token', function(req, res) {
    if(req.query.storefront === storefront) {
        console.log("CCAS Request for token received.");
        res.json({success: true, nonce_token: nonce_token})
    } else {
        res.json({success: false, message: "Invalid URL or storefront."});
    }
});

app.post(api + '/request_customized_model', function(req, res) {
    if(req.body.nonce_token == nonce_token) {

        console.log("CCAS Order received");

        let model = req.body.model;
        let custom = req.body.custom;

        if(models.indexOf(model) !== -1 && customs.indexOf(custom) !== -1) {
            console.log("Item in stock. Preparing delivery.");
            res.json({
                success: true,
                message: "Item in stock. Preparing delivery",
                order_id: uuid.v4()
            });
        } else {
            console.log("Item out of stock or unavailable.");
            res.json({
                success: false,
                message: "Item out of stock or unavailable."
            });
        }
    } else {
        res.json({ success: false, message: "Invalid or nonexistent token"});
    }
});

app.listen(3051, function () {
    console.log('Rainer server operational on port 3051');
});
