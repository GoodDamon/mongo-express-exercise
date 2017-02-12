var assert = require('assert');
const request = require('request');
const ccas = require('./ccas.js');
const url = 'http://localhost:3000/order';

describe("Central Cascade Automotive Sales application", function() {
    // First test: Post a dummy order
    describe("POST an order for ACME stuff", function() {
        it("returns status: 200 and 'success: true'", function(done) {
            request.post(url, {form:{
                customer_id:3,
                make: "ACME",
                model: "anvil",
                package: "elite"
            }}, function(error, response, body) {
                let result = JSON.parse(body);
                assert.equal(200, response.statusCode);
                assert.ok(result.success);
                done();
            });
        });
    });

    // Second test: Retrieve the list of orders. Should include the dummy.
    describe("GET all orders", function() {
        it("successfully retrieves the current orders", function(done) {
            request.get(url, function(error, response, body) {
                let result = JSON.parse(body);
                assert.equal(200, response.statusCode);
                assert.ok(result.success);
                done();
            });
        });
    });
});
