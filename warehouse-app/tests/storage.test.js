require('dotenv').config();

const sinon = require('sinon');
const chai = require('chai');
const {expect, assert} = chai;
const should = chai.should();

const thrift = require('thrift');
const mongoose = require('mongoose');
const storage = require('../src/storage');

const host = process.env.TEST_DB_HOST;
const dbName = process.env.TEST_DB_NAME;
const username = process.env.TEST_DB_USERNAME;
const password = process.env.TEST_DB_PASSWORD;

describe('Database integration', () => {

    before(async () => {
        mongoose.connect(
            `mongodb://${username}:${password}@${host}:27017/${dbName}`,
            {useNewUrlParser: true}
        );
        await storage.Manufacturer.deleteMany({});
        await storage.Item.deleteMany({});
    });

    describe('Manufacturer', () => {
        beforeEach(async () => {
            await storage.Manufacturer.create([
                {
                    name: 'manufacturer 1',
                    address: 'New York',
                    phoneNumber: '123123'
                },
                {
                    name: 'manufacturer 2',
                    address: 'Chicago',
                    phoneNumber: '321321'
                },
                {
                    name: 'manufacturer 3',
                    address: 'Podolsk',
                    phoneNumber: '111222'
                }
            ]);
        });

        afterEach(async () => {
            await storage.Manufacturer.deleteMany({});
        });

        it('saves manufacturers', async () => {
            let manufacturer = await storage.Manufacturer.create({
                name: 'manufacturer',
                address: 'asd',
                phoneNumber: '1231231'
            });
            expect(manufacturer).to.deep.include({
                name: 'manufacturer',
                address: 'asd',
                phoneNumber: '1231231'
            });
        });

        it('retrieves manufacturers', async () => {
            let myManufacturer = await storage.Manufacturer.findOne({name: 'manufacturer 1'});
            expect(myManufacturer).to.deep.include({
                name: 'manufacturer 1',
                address: 'New York',
                phoneNumber: '123123'
            });

            myManufacturer = await storage.Manufacturer.findOne({address: 'Podolsk'});
            expect(myManufacturer).to.deep.include({
                name: 'manufacturer 3',
                address: 'Podolsk',
                phoneNumber: '111222'
            });
        });

        it('updates manufacturers', async () => {
            let result = await storage.Manufacturer.updateOne(
                {name: 'manufacturer 1'},
                {address: 'Ulan Ude'}
            );
            expect(result).to.be.eql({
                n: 1,
                nModified: 1,
                ok: 1
            });

            let updatedManufacturer = await storage.Manufacturer.findOne({name: 'manufacturer 1'});
            assert(updatedManufacturer.address === 'Ulan Ude');
        });

        it('deletes manufacturers', async () => {
            let result = await storage.Manufacturer.deleteOne(
                {name: 'manufacturer 1'}
            );
            expect(result).to.be.eql({
                n: 1,
                deletedCount: 1,
                ok: 1
            });
            let deletedManufacturer = await storage.Manufacturer.findOne({name: 'manufacturer 1'});
            expect(deletedManufacturer).to.be.null;
        });
    });


    describe('Item', () => {
        const currentDate = new Date();

        beforeEach(async () => {
            await storage.Item.create([
                {
                    name: 'item 1',
                    price: 100,
                    arrivalDate: currentDate,
                    quantity: 20
                },
                {
                    name: 'item 2',
                    price: 80,
                    arrivalDate: currentDate,
                    quantity: 20
                },
                {
                    name: 'item 3',
                    price: 60,
                    arrivalDate: currentDate,
                    quantity: 20
                }
            ]);
        });

        afterEach(async () => {
            await storage.Item.deleteMany({});
        });

        it('saves items', async () => {
            const info = {
                name: 'item 4',
                price: 60,
                arrivalDate: new Date(),
                quantity: 20
            };
            let item = await storage.Item.create(info);
            assert(item.name === info.name);
            assert(+item.price === info.price);
            expect(item.arrivalDate).to.be.eql(info.arrivalDate);
            assert(+item.quantity === info.quantity);
        });

        it('retrieves items', async () => {
            let myItem = await storage.Item.findOne({name: 'item 1'});
            assert(myItem.name === 'item 1');
            assert(+myItem.price === 100);
            expect(myItem.arrivalDate).to.be.eql(currentDate);
            assert(+myItem.quantity === 20);
        });

        it('updates items', async () => {
            let result = await storage.Item.updateOne(
                {name: 'item 1'},
                {price: 123, quantity: 10}
            );
            expect(result).to.be.eql({
                n: 1,
                nModified: 1,
                ok: 1
            });

            let updatedItem = await storage.Item.findOne({name: 'item 1'});
            assert(+updatedItem.price === 123);
            assert(+updatedItem.quantity === 10);
        });

        it('deletes items', async () => {
            let result = await storage.Item.deleteOne(
                {name: 'item 1'}
            );
            expect(result).to.be.eql({
                n: 1,
                deletedCount: 1,
                ok: 1
            });
            let deletedItem = await storage.Item.findOne({name: 'item 1'});
            expect(deletedItem).to.be.null;
        });
    });
});
