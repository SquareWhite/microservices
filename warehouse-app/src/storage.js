const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Data types
const ObjectId = mongoose.Schema.Types.ObjectId;
const ISODate = mongoose.Schema.Types.Date;
const NumberInt = require('mongoose-int32');
const Double = require('@mongoosejs/double');


let manufacturer = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    }
});

let item = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: ObjectId
    },
    price: {
        type: Double,
        required: true
    },
    arrivalDate: {
        type: ISODate,
        required: true,
        default: Date.now
    },
    quantity: {
        type: NumberInt,
        required: true
    }
});

let Manufacturer = mongoose.model('manufacturer', manufacturer);
let Item = mongoose.model('item', item);

module.exports = {
    Manufacturer,
    Item
};


