/* Central Cascade Automotive Sales REST application */

/* Base requirements and config */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
const mocha = require('mocha');
const request = require('request');

/* Customer database */
const customers = require('./customers.json');

/* Create our application and models */
var app = express();
var models = require("./models/mongo.js");
var order = models.order;

/* Configure the express app to use body-parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

/* Mongoose/Mockgoose */
mockgoose(mongoose).then(function() {
    mongoose.connect('mongodb://localhost/TestingDB', function(err) {
        if(err) {
            throw err;
        }
    });
});

/* Our generous suppliers */
const acme = {
    api_key: 'cascade.53bce4f1dfa0fe8e7ca126f91b35d3a6',
    base_url: 'http://localhost:3050/acme/api/v45.1',
    placeOrder: function(neworder, res) {
        request.post(this.base_url + '/order', {form:{ "model": neworder.model, "package": neworder.package, "api_key": this.api_key } }, function(err, response, body) {
            if(err) {
                console.log(err);
                res.json({success: false, message: 'ACME products are unavailable at this time.'});
            } else {
                let result = JSON.parse(body);

                if(result.success) {
                    saveOrder(neworder, result.data[0].order, res);
                } else {
                    rejectOrder(res);
                }
            }
        });
    }
};

const rainer = {
    storefront: 'ccas­bb9630c04f',
    base_url: 'http://localhost:3051/r',
    placeOrder: function(neworder, res) {
        request.get({ url: this.base_url + '/nonce_token', qs:{storefront: this.storefront}}, function(err, response, body) {
            if(err) {
                console.log(err);
                res.json({success: false, message: 'Rainer products are unavailable at this time.'});
            } else {
                let result = JSON.parse(body);
                let nonce_token = result.nonce_token;

                request.post(rainer.base_url + '/request_customized_model', {form:{ "model": neworder.model, "custom": neworder.package, "nonce_token": nonce_token } }, function(err, response, body) {
                    if(err) {
                        console.log(err);
                        res.json({success: false, message: 'Rainer products are unavailable at this time.'});
                    } else {
                        let result = JSON.parse(body);

                        if(result.success) {
                            saveOrder(neworder, result.order_id, res);
                        } else {
                            rejectOrder(res);
                        }
                    }
                });
            }
        });
    }
};

/* Utilities for saving or rejecting an order */
const saveOrder = function(neworder, order_id, res) {
    neworder.order_id = order_id;
    neworder.save(function(err, data) {
        if(err) {
            console.log(err);
            res.json({ success: false, message: 'Error recording order.' });
            throw err;
        } else {
            console.log("Order complete.")
            res.json({
                success: true,
                message: 'Order successfully placed.'
            });
        }
    });
};

const rejectOrder = function(res) {
    res.json({
        success: false,
        message: 'This model, package, or thingamajig is not available from our supplier at this time.'
    });
};

/* Routes. */
app.post('/order', function(req, res) {
    console.log("New order incoming...");

    let neworder = new order({
        make: req.body.make,
        model: req.body.model,
        package: req.body.package,
        customer_id: req.body.customer_id
    });

    let customer = customers.find(function(entry, index) {
        return entry.customer_id == req.body.customer_id;
    });

    if(!customer.shippable) {
        res.json({
            success: false,
            message: "Order cannot be delivered to Siberia. It's just too cold."
        });
    } else {
        if(neworder.make === 'ACME') {
            acme.placeOrder(neworder, res);
        } else if(neworder.make === 'Rainer') {
            rainer.placeOrder(neworder, res);
        } else {
            res.json({ success: false, message: 'We only carry ACME and Rainer automobiles and/or cartoon mayhem tools.' });
        }
    }
});

app.get('/order', function(req, res) {
    let query = order.find({});

    query.exec(function(err, data) {
        if(err) {
            console.log(err);
            res.json({success: false, message: 'Order history is currently unavailable.'});
        } else {
            let result = {
                success: true,
                message: 'Orders retrieved',
                data: [data]
            };
            res.json(result);
        }
    });
});

app.listen(3000, function () {
    console.log('Ready to take and display orders on port 3000!');
});
