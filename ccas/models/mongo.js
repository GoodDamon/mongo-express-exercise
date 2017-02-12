
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orderSchema = {
	"make" : String,
	"model" : String,
	"package" : String,
	"customer_id" : Number,
	"order_id" : String
};

exports.order = mongoose.model('order', orderSchema);
