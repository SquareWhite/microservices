require('dotenv').config();

const sinon = require('sinon');
const chai = require('chai');
const {expect, assert} = chai;
const should = chai.should();

const thrift = require('thrift');
const mongoose = require('mongoose');
const storage = require('../../src/storage');
const Warehouse = require('../../src/api/gen-nodejs/Warehouse');


describe('Thrift server', () => {
    const someManufacturer = new storage.Manufacturer({
        name: 'manufacturer',
        address: 'asd',
        phoneNumber: '1231231'
    });
    const someItem = new storage.Item({
        name: 'some name',
        price: 100,
        arrivalDate: new Date(),
        quantity: 10
    });
    let server, connection, client;

    before(() => {
        // Start thrift server
        server = require('../../src/api/warehouse');
        const port = process.env.API_PORT;
        server.listen(port);

        // Initialize client
        const transport = thrift.TBufferedTransport;
        const protocol = thrift.TBinaryProtocol;
        connection = thrift.createConnection("localhost", port, {transport, protocol});
        client = thrift.createClient(Warehouse, connection);

        // Mock database functions
        sinon.stub(storage.Manufacturer, 'findById').callsFake(() => someManufacturer);
        sinon.stub(storage.Manufacturer, 'find').callsFake(() => [someManufacturer]);
        sinon.stub(storage.Manufacturer, 'create').callsFake(() => someManufacturer);
        sinon.stub(storage.Manufacturer, 'updateOne').callsFake(() => {return {n: 1}});
        sinon.stub(storage.Manufacturer, 'deleteOne').callsFake(() => {return {n: 1}});
        sinon.stub(storage.Item, 'findById').callsFake(() => someItem);
        sinon.stub(storage.Item, 'find').callsFake(() => [someItem]);
        sinon.stub(storage.Item, 'create').callsFake(() => someItem);
        sinon.stub(storage.Item, 'updateOne').callsFake(() => {return {n: 1}});
        sinon.stub(storage.Item, 'deleteOne').callsFake(() => {return {n: 1}});
    });

    after(() => {
        sinon.restore();
        connection.end();
    });

    it('getManufacturerById', async () => {
        let manufacturer = await client.getManufacturerById('asd');
        assert(manufacturer._id === someManufacturer._id + '');
        assert(manufacturer.name === someManufacturer.name);
        assert(manufacturer.address === someManufacturer.address);
        assert(manufacturer.phoneNumber === someManufacturer.phoneNumber);
    });

    it('findManufacturers', async () => {
        let manufacturers = await client.findManufacturers({_id: 'asd'});
        expect(manufacturers).to.be.an('array');
        assert(manufacturers[0]._id === someManufacturer._id + '');
        assert(manufacturers[0].name === someManufacturer.name);
        assert(manufacturers[0].address === someManufacturer.address);
        assert(manufacturers[0].phoneNumber === someManufacturer.phoneNumber);
    });

    it('insertManufacturer', async () => {
        let id = await client.insertManufacturer({name: 'asd'});
        expect(id).to.be.a('string');
        assert(id === someManufacturer._id + '');
    });

    it('updateManufacturerById', async () => {
        let result = await client.updateManufacturerById('123', {name: 'asd'});
        expect(result).to.be.undefined;
    });

    it('deleteItem', async () => {
        let result = await client.deleteItem({_id: 'asd'});
        expect(result).to.be.undefined;
    });

    it('getItemById', async () => {
        let item = await client.getItemById('asd');
        assert(item._id === someItem._id + "");
        assert(item.name === someItem.name);
        assert(item.price === +someItem.price);
        assert(item.arrivalDate === someItem.arrivalDate.toISOString());
        assert(item.quantity === +someItem.quantity);
    });

    it('findItems', async () => {
        let items = await client.findItems({_id: 'asd'});
        expect(items).to.be.an('array');
        assert(items[0]._id === someItem._id + '');
        assert(items[0].name === someItem.name);
        assert(items[0].price === +someItem.price);
        assert(items[0].arrivalDate === someItem.arrivalDate.toISOString());
        assert(items[0].quantity === someItem.quantity);
    });

    it('insertItem', async () => {
        let id = await client.insertItem({name: 'asd'});
        expect(id).to.be.a('string');
        assert(id === someItem._id + '');
    });

    it('updateItemById', async () => {
        let result = await client.updateItemById('123', {name: 'asd'});
        expect(result).to.be.undefined;
    });

    it('deleteItem', async () => {
        let result = await client.deleteItem({_id: 'asd'});
        expect(result).to.be.undefined;
    });

});
