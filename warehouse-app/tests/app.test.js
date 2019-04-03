require('dotenv').config();

const sinon = require('sinon');
const chai = require('chai');
const {expect, assert} = chai;
const should = chai.should();
const thrift = require('thrift');
const mongoose = require('mongoose');

const storage = require('../src/storage');
const Warehouse = require('../src/api/gen-nodejs/Warehouse');

const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const port = process.env.API_PORT;

describe('Service test', () => {
    let server, connection, client;

    before(async () => {
        // Start thrift server
        require('../src/app');

        // Initialize client
        const transport = thrift.TBufferedTransport;
        const protocol = thrift.TBinaryProtocol;
        connection = thrift.createConnection("localhost", port, {transport, protocol});
        client = thrift.createClient(Warehouse, connection);

        // Clear db
        await storage.Manufacturer.deleteMany({});
        await storage.Item.deleteMany({});
    });

    after(() => {
        sinon.restore();
        connection.end();
    });

    it('manufacturer path', async () => {
        let newGuyName = 'manufacturer';
        let newGuyId = await client.insertManufacturer({name: newGuyName});
        let manufacturer = await client.getManufacturerById(newGuyId);
        let found = await client.findManufacturers({name: manufacturer.name});
        await client.updateManufacturerById(found[0]._id, {name: 'updated name'});
        await client.deleteManufacturer({name: 'updated name'});
    });

    it('item path', async () => {
        let newItem = {name: 'asd', price: 100, quantity: 1};
        let newItemId = await client.insertItem(newItem);
        let item = await client.getItemById(newItemId);
        let foundItems = await client.findItems({name: item.name});
        await client.updateItemById(foundItems[0]._id, {name: 'updated name'});
        await client.deleteItem({name: 'updated name'});
    });
});
