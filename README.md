# mongo-express-exercise
A mock set of APIs and applications using Mongo and Express

## Instructions
1. Clone the repository.
2. Change directory to `ccas`, run, `npm install`, and run: `node ccas.js`.
3. Repeat step 2 for `acme` and `rainer` with different consoles (I chose to have them launched separately so that the results of supplier's API being down could be observed).
4. Use a tool like postman to test routes and posts to http://localhost:3000/order. GET requests retrieve a JSON object of current orders, along with a "success" field and a "message" field. POST requests accept these fields: `make`, `model`, `package`, `customer_id`.
5. There are four customers to choose from, with IDs ranging from 1 to 4. There are two makes to choose from as well, "ACME" and "Rainer".
5. One of the customers in the "database" (actually just the customers.json file) can't be shipped to. If you use customer_id=4, the shipment will be rejected. He lives in Siberia. It's too cold and far away to deliver there.

## Mocha
A preliminary test.js file exists. Currently, it just tests for successful POST and GET requests.

## Fun things to try
* Use a model or package that isn't provided by either supplier. Watch the console logs of the supplier for its response. For example, try an order with a package of "fake tunnel paint" from ACME, and observe the message on the ACME console.
* Turn off one of the supplier APIs. Attempt to place an order for one of its models.
