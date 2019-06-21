const util = require('util');

const httpreq = require('httpreq');
httpreq.post = util.promisify(httpreq.post);

const storage = require('../storage');
const utils = require('../utils');
const apiTypes = require("./gen-nodejs/warehouse_types");


const logisticsHost = process.env.LOGISTICS_APP_HOST;
const logisticsPort = process.env.LOGISTICS_APP_PORT;
const logisticsOrderEndpoint = `http://${logisticsHost}:${logisticsPort}/orders`;

module.exports = {
    getManufacturerById: async (id) => {
        try {
            let manufacturer = await storage.Manufacturer.findById(id);
            if (!manufacturer) {
                throw new EntityNotFoundError(`Manufacturer with id ${id} wasn't found.`);
            }
            return manufacturer;
        } catch (err) {
            throwThriftError(err);
        }
    },

    findManufacturers: async (searchFields) => {
        try {
            utils.filterOutNullValues(searchFields);
            let manufacturers = await storage.Manufacturer.find(searchFields);
            if (!manufacturers || Array.isArray(manufacturers) &&
                                   manufacturers.length === 0) {
                throw new EntityNotFoundError(`No manufacturers found.`);
            }
            return manufacturers;
        } catch (err) {
            throwThriftError(err);
        }
    },

    insertManufacturer: async (manufacturer) => {
        try {
            utils.filterOutNullValues(manufacturer);
            let doc = await storage.Manufacturer.create(manufacturer);
            return doc._id + '';
        } catch (err) {
            throwThriftError(err);
        }
    },

    updateManufacturerById: async (id, manufacturer) => {
        try {
            utils.filterOutNullValues(manufacturer);
            let result = await storage.Manufacturer.updateOne({_id: id}, manufacturer);
            if (!result.n) {
                throw new EntityNotFoundError(`Manufacturer with id ${id} wasn't found.`);
            }
        } catch (err) {
            throwThriftError(err);
        }
    },

    deleteManufacturer: async (conditions) => {
        try {
            utils.filterOutNullValues(conditions);
            let result = await storage.Manufacturer.deleteOne(conditions);
            if (!result.n) {
                throw new EntityNotFoundError(`Manufacturer with specified conditions wasn't found.`);
            }
        } catch (err) {
            throwThriftError(err);
        }
    },

    getItemById: async (id) => {
        try {
            let item = await storage.Item.findById(id);
            if (!item) {
                throw new EntityNotFoundError(`No items found.`);
            }
            return item;
        } catch (err) {
            throwThriftError(err);
        }
    },

    findItems: async (searchFields) => {
        try {
            utils.filterOutNullValues(searchFields);
            let items = await storage.Item.find(searchFields);
            if (!items || Array.isArray(items) &&
                          items.length === 0) {
                throw new EntityNotFoundError(`No items found.`);
            }
            return items;
        } catch (err) {
            throwThriftError(err);
        }
    },

    insertItem: async (item) => {
        try {
            utils.filterOutNullValues(item);
            let doc = await storage.Item.create(item);
            return doc._id + '';
        } catch (err) {
            throwThriftError(err);
        }
    },

    updateItemById: async (id, item) => {
        try {
            utils.filterOutNullValues(item);
            let result = await storage.Item.updateOne({_id: id}, item);
            if (!result.n) {
                throw new EntityNotFoundError(`Item with id ${id} wasn't found.`);
            }
        } catch (err) {
            throwThriftError(err);
        }
    },

    deleteItem: async (conditions) => {
        try {
            utils.filterOutNullValues(conditions);
            let result = await storage.Item.deleteOne(conditions);
            if (!result.n) {
                throw new EntityNotFoundError(`Item with specified conditions wasn't found.`);
            }
        } catch (err) {
            throwThriftError(err);
        }
    },

    prepareOrder: async (user, orderedItems) => {
        try {
            user.id = user._id;
            delete user._id;

            utils.filterOutNullValues(orderedItems);
            let tasksForItemsWithInfo = orderedItems.map(async item => {
                let info = await storage.Item.findById(item._id);
                if (!info) {
                    throw new EntityNotFoundError(`Item with id ${item._id} wasn't found.`);
                }
                info.quantity -= item.quantity;
                info.markModified('quantity');
                await info.save();

                return {
                    "id": item._id,
                    "height": 10,
                    "length": 10,
                    "width": 10,
                    "price": info.price,
                    "quantity": item.quantity,
                    "weight": 100
                }
            });

            let itemsWithInfo = await Promise.all(tasksForItemsWithInfo);
            let result = await httpreq.post(logisticsOrderEndpoint, {
              json: {
                  user: user,
                  order: itemsWithInfo
              }
          });
            console.log(result);
        } catch (err) {
            throwThriftError(err);
        }
    }
};

class EntityNotFoundError extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'EntityNotFound';
    }
}

function throwThriftError(err) {
    console.error(err);

    let thriftError;
    if (err.name === 'EntityNotFound') {
        thriftError = new apiTypes.EntityNotFoundError();
    } else if (err.name === 'ValidationError' || err.code === 121) {
        thriftError = new apiTypes.ValidationError();
    } else {
        thriftError = new apiTypes.DatabaseError();
    }

    thriftError.message = err.message;
    throw thriftError;
}
