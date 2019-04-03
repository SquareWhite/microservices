const sinon = require('sinon');
const chai = require('chai');
const {expect, assert} = chai;
const should = chai.should();

const warehouseMethods = require('../../src/api/warehouseMethods');
const storage = require('../../src/storage');
const apiTypes = require("../../src/api/gen-nodejs/warehouse_types");

describe('Warehouse API', () => {
    describe('Manufacturer', () => {

        before(() => {
            sinon.stub(console, 'error');
        });

        after(() => {
            sinon.restore();
        });

        describe('getManufacturerById', () => {
            const EXISTENT_MANUFACTURER = new storage.Manufacturer({
                name: 'some name'
            });
            const NON_EXISTENT_ID = 'non_existent';
            const BAD_ID = 'bad';
            let dbMethodStub;

            before(() => {
                dbMethodStub = sinon.stub(storage.Manufacturer, 'findById').callsFake((id) => {
                    switch (id) {
                        case EXISTENT_MANUFACTURER._id:
                            return EXISTENT_MANUFACTURER;
                        case NON_EXISTENT_ID:
                            return null;
                        case BAD_ID:
                            throw new Error('cant cast to ObjectId!');
                    }
                });
            });

            after(() => {
                dbMethodStub.restore();
            });

            it('returns Manufacturer, when found', async () => {
                let manufacturer = await warehouseMethods.getManufacturerById(EXISTENT_MANUFACTURER._id);
                assert(manufacturer._id === EXISTENT_MANUFACTURER._id);
                assert(manufacturer.name === EXISTENT_MANUFACTURER.name);
                assert(manufacturer.address === EXISTENT_MANUFACTURER.address);
                assert(manufacturer.phoneNumber === EXISTENT_MANUFACTURER.phoneNumber);
            });

            it('returns EntityNotFoundError, when manufacturer was not found', async () => {
                try {
                    await warehouseMethods.getManufacturerById(NON_EXISTENT_ID);
                } catch (err) {
                    assert(err instanceof apiTypes.EntityNotFoundError);
                    return;
                }
                assert.fail();
            });

            it('returns DatabaseError, when an error happens', async () => {
                try {
                    await warehouseMethods.getManufacturerById(BAD_ID);
                } catch (err) {
                    assert(err instanceof apiTypes.DatabaseError);
                    return;
                }
                assert.fail();
            });
        });

        describe('findManufacturers', () => {
            const EXISTENT_MANUFACTURER = new storage.Manufacturer({
                name: 'some name'
            });
            const NON_EXISTENT_ID = 'non_existent';
            const BAD_ID = 'bad';
            let dbMethodStub;

            before(() => {
                dbMethodStub = sinon.stub(storage.Manufacturer, 'find').callsFake((conditions) => {
                    switch (conditions._id) {
                        case EXISTENT_MANUFACTURER._id:
                            return [EXISTENT_MANUFACTURER];
                        case NON_EXISTENT_ID:
                            return [];
                        case BAD_ID:
                            throw new Error('cant cast to ObjectId!');
                    }
                });
            });

            after(() => {
                dbMethodStub.restore();
            });

            it('returns Manufacturers, when found', async () => {
                let manufacturers = await warehouseMethods.findManufacturers({
                    _id: EXISTENT_MANUFACTURER._id
                });
                expect(manufacturers).to.be.an('array');
                assert(manufacturers[0]._id === EXISTENT_MANUFACTURER._id);
                assert(manufacturers[0].name === EXISTENT_MANUFACTURER.name);
                assert(manufacturers[0].address === EXISTENT_MANUFACTURER.address);
                assert(manufacturers[0].phoneNumber === EXISTENT_MANUFACTURER.phoneNumber);
            });

            it('returns EntityNotFoundError, when manufacturers were not found', async () => {
                try {
                    await warehouseMethods.findManufacturers({_id: NON_EXISTENT_ID});
                } catch (err) {
                    assert(err instanceof apiTypes.EntityNotFoundError);
                    return;
                }
                assert.fail();
            });

            it('returns DatabaseError, when an error happens', async () => {
                try {
                    await warehouseMethods.findManufacturers({_id: BAD_ID});
                } catch (err) {
                    assert(err instanceof apiTypes.DatabaseError);
                    return;
                }
                assert.fail();
            });
        });

        describe('insertManufacturer', () => {
            const INSERTED_DOCS_ID = 'id';
            let dbMethodStub;

            before(() => {
                dbMethodStub = sinon.stub(storage.Manufacturer, 'create')
                    .callsFake(async (manufacturer) => {
                        if (!manufacturer.name) {
                            let error = new Error();
                            error.name = 'ValidationError';
                            throw error;
                        }
                        return {_id: INSERTED_DOCS_ID};
                    });
            });

            after(() => {
                dbMethodStub.restore();
            });

            it('returns id of inserted manufacturer, when operations is successful', async () => {
                let id = await warehouseMethods.insertManufacturer({name: 'ads'});
                expect(id).to.be.a('string');
                assert(id === INSERTED_DOCS_ID);
            });

            it('returns ValidationError, when wrong object is inserted', async () => {
                try {
                    await warehouseMethods.insertManufacturer({whoa: 'no name!'});
                } catch (err) {
                    assert(err instanceof apiTypes.ValidationError);
                    return;
                }
                assert.fail();
            });

            it('returns DatabaseError, when an error happens', async () => {
                try {
                    dbMethodStub.throws(new Error());
                    await warehouseMethods.insertManufacturer({name: 'hello'});
                } catch (err) {
                    assert(err instanceof apiTypes.DatabaseError);
                    return;
                }
                assert.fail();
            });
        });

        describe('updateManufacturerById', () => {
            const EXISTENT_ID = 'here';
            const NON_EXISTENT_ID = 'not here';
            const BAD_ID = 'bad';
            let dbMethodStub;

            before(() => {
                dbMethodStub = sinon.stub(storage.Manufacturer, 'updateOne')
                    .callsFake((conditions, manufacturer) => {
                        if (conditions._id === EXISTENT_ID) {
                            return {
                                n: 1,
                                nModified: 1,
                                ok: 1
                            }
                        } else if (conditions._id === BAD_ID) {
                            throw new Error('Cant cast to ObjectId!');
                        } else {
                            return {
                                n: 0,
                                nModified: 0,
                                ok: 1
                            }
                        }
                    });
            });

            after(() => {
                dbMethodStub.restore();
            });

            it('returns void, if update is successful', async () => {
                let result = await warehouseMethods.updateManufacturerById(EXISTENT_ID, {name: 'asd'});
                expect(result).to.be.undefined;
            });

            it('returns EntityNotFoundError, when manufacturer was not found', async () => {
                try {
                    await warehouseMethods.updateManufacturerById(NON_EXISTENT_ID, {name: 'asd'});
                } catch (err) {
                    assert(err instanceof apiTypes.EntityNotFoundError);
                    return;
                }
                assert.fail();
            });

            it('returns DatabaseError, when an error happens', async () => {
                try {
                    await warehouseMethods.updateManufacturerById(BAD_ID, {name: 'asd'});
                } catch (err) {
                    assert(err instanceof apiTypes.DatabaseError);
                    return;
                }
                assert.fail();
            });
        });

        describe('deleteManufacturer', () => {
            const EXISTENT_MANUFACTURER = new storage.Manufacturer({
                name: 'some name'
            });
            const NON_EXISTENT_ID = 'non_existent';
            const BAD_ID = 'bad';
            let dbMethodStub;

            before(() => {
                dbMethodStub = sinon.stub(storage.Manufacturer, 'deleteOne').callsFake((conditions) => {
                    switch (conditions._id) {
                        case EXISTENT_MANUFACTURER._id:
                            return {
                                n: 1,
                                nModified: 1,
                                ok: 1
                            };
                        case NON_EXISTENT_ID:
                            return {
                                n: 0,
                                nModified: 0,
                                ok: 1
                            };
                        case BAD_ID:
                            throw new Error('cant cast to ObjectId!');
                    }
                });
            });

            after(() => {
                dbMethodStub.restore();
            });

            it('returns void, when deletion is successful', async () => {
                let result = await warehouseMethods.deleteManufacturer({
                    _id: EXISTENT_MANUFACTURER._id
                });
                expect(result).to.be.undefined;
            });

            it('returns EntityNotFoundError, when manufacturer was not found', async () => {
                try {
                    await warehouseMethods.deleteManufacturer({_id: NON_EXISTENT_ID});
                } catch (err) {
                    assert(err instanceof apiTypes.EntityNotFoundError);
                    return;
                }
                assert.fail();
            });

            it('returns DatabaseError, when an error happens', async () => {
                try {
                    await warehouseMethods.deleteManufacturer({_id: BAD_ID});
                } catch (err) {
                    assert(err instanceof apiTypes.DatabaseError);
                    return;
                }
                assert.fail();
            });
        });
    });


    describe('Item', () => {

        before(() => {
            sinon.stub(console, 'error');
        });
        after(() => {
            sinon.restore();
        });

        describe('getItemById', () => {
            const EXISTENT_ITEM = new storage.Item({
                name: 'some name',
                price: 100,
                arrivalDate: new Date(),
                quantity: 10
            });
            const NON_EXISTENT_ID = 'non_existent';
            const BAD_ID = 'bad';
            let dbMethodStub;

            before(() => {
                dbMethodStub = sinon.stub(storage.Item, 'findById').callsFake((id) => {
                    switch (id) {
                        case EXISTENT_ITEM._id:
                            return EXISTENT_ITEM;
                        case NON_EXISTENT_ID:
                            return null;
                        case BAD_ID:
                            throw new Error('cant cast to ObjectId!');
                    }
                });
            });

            after(() => {
                dbMethodStub.restore();
            });

            it('returns Item, when found', async () => {
                let item = await warehouseMethods.getItemById(EXISTENT_ITEM._id);
                assert(item._id === EXISTENT_ITEM._id);
                assert(item.name === EXISTENT_ITEM.name);
                assert(item.price === EXISTENT_ITEM.price);
                assert(item.arrivalDate === EXISTENT_ITEM.arrivalDate);
                assert(item.quantity === EXISTENT_ITEM.quantity);
            });

            it('returns EntityNotFoundError, when item was not found', async () => {
                try {
                    await warehouseMethods.getItemById(NON_EXISTENT_ID);
                } catch (err) {
                    assert(err instanceof apiTypes.EntityNotFoundError);
                    return;
                }
                assert.fail();
            });

            it('returns DatabaseError, when an error happens', async () => {
                try {
                    await warehouseMethods.getItemById(BAD_ID);
                } catch (err) {
                    assert(err instanceof apiTypes.DatabaseError);
                    return;
                }
                assert.fail();
            });
        });

        describe('findItems', () => {
            const EXISTENT_ITEM = new storage.Item({
                name: 'some name',
                price: 100,
                arrivalDate: new Date(),
                quantity: 10
            });
            const NON_EXISTENT_ID = 'non_existent';
            const BAD_ID = 'bad';
            let dbMethodStub;

            before(() => {
                dbMethodStub = sinon.stub(storage.Item, 'find').callsFake((conditions) => {
                    switch (conditions._id) {
                        case EXISTENT_ITEM._id:
                            return [EXISTENT_ITEM];
                        case NON_EXISTENT_ID:
                            return [];
                        case BAD_ID:
                            throw new Error('cant cast to ObjectId!');
                    }
                });
            });

            after(() => {
                dbMethodStub.restore();
            });

            it('returns Items, when found', async () => {
                let items = await warehouseMethods.findItems({
                    _id: EXISTENT_ITEM._id
                });
                expect(items).to.be.an('array');
                assert(items[0]._id === EXISTENT_ITEM._id);
                assert(items[0].name === EXISTENT_ITEM.name);
                assert(items[0].price === EXISTENT_ITEM.price);
                assert(items[0].arrivalDate === EXISTENT_ITEM.arrivalDate);
                assert(items[0].quantity === EXISTENT_ITEM.quantity);
            });

            it('returns EntityNotFoundError, when items were not found', async () => {
                try {
                    await warehouseMethods.findItems({_id: NON_EXISTENT_ID});
                } catch (err) {
                    assert(err instanceof apiTypes.EntityNotFoundError);
                    return;
                }
                assert.fail();
            });

            it('returns DatabaseError, when an error happens', async () => {
                try {
                    await warehouseMethods.findItems({_id: BAD_ID});
                } catch (err) {
                    assert(err instanceof apiTypes.DatabaseError);
                    return;
                }
                assert.fail();
            });
        });

        describe('insertItem', () => {
            const INSERTED_DOCS_ID = 'id';
            let dbMethodStub;

            before(() => {
                dbMethodStub = sinon.stub(storage.Item, 'create')
                    .callsFake(async (item) => {
                        if (!item.name) {
                            let error = new Error();
                            error.name = 'ValidationError';
                            throw error;
                        }
                        return {_id: INSERTED_DOCS_ID};
                    });
            });

            after(() => {
                dbMethodStub.restore();
            });

            it('returns id of inserted item, when operations is successful', async () => {
                let id = await warehouseMethods.insertItem({name: 'ads'});
                expect(id).to.be.a('string');
                assert(id === INSERTED_DOCS_ID);
            });

            it('returns ValidationError, when wrong object is inserted', async () => {
                try {
                    await warehouseMethods.insertItem({whoa: 'no name!'});
                } catch (err) {
                    assert(err instanceof apiTypes.ValidationError);
                    return;
                }
                assert.fail();
            });

            it('returns DatabaseError, when an error happens', async () => {
                try {
                    dbMethodStub.throws(new Error());
                    await warehouseMethods.insertItem({name: 'hello'});
                } catch (err) {
                    assert(err instanceof apiTypes.DatabaseError);
                    return;
                }
                assert.fail();
            });
        });

        describe('updateItemById', () => {
            const EXISTENT_ID = 'here';
            const NON_EXISTENT_ID = 'not here';
            const BAD_ID = 'bad';
            let dbMethodStub;

            before(() => {
                dbMethodStub = sinon.stub(storage.Item, 'updateOne')
                    .callsFake((conditions, item) => {
                        if (conditions._id === EXISTENT_ID) {
                            return {
                                n: 1,
                                nModified: 1,
                                ok: 1
                            }
                        } else if (conditions._id === BAD_ID) {
                            throw new Error('Cant cast to ObjectId!');
                        } else {
                            return {
                                n: 0,
                                nModified: 0,
                                ok: 1
                            }
                        }
                    });
            });

            after(() => {
                dbMethodStub.restore();
            });

            it('returns void, if update is successful', async () => {
                let result = await warehouseMethods.updateItemById(EXISTENT_ID, {name: 'asd'});
                expect(result).to.be.undefined;
            });

            it('returns EntityNotFoundError, when item was not found', async () => {
                try {
                    await warehouseMethods.updateItemById(NON_EXISTENT_ID, {name: 'asd'});
                } catch (err) {
                    assert(err instanceof apiTypes.EntityNotFoundError);
                    return;
                }
                assert.fail();
            });

            it('returns DatabaseError, when an error happens', async () => {
                try {
                    await warehouseMethods.updateItemById(BAD_ID, {name: 'asd'});
                } catch (err) {
                    assert(err instanceof apiTypes.DatabaseError);
                    return;
                }
                assert.fail();
            });
        });

        describe('deleteItem', () => {
            const EXISTENT_ITEM = new storage.Item({
                name: 'some name',
                price: 100,
                arrivalDate: new Date(),
                quantity: 10
            });
            const NON_EXISTENT_ID = 'non_existent';
            const BAD_ID = 'bad';
            let dbMethodStub;

            before(() => {
                dbMethodStub = sinon.stub(storage.Item, 'deleteOne').callsFake((conditions) => {
                    switch (conditions._id) {
                        case EXISTENT_ITEM._id:
                            return {
                                n: 1,
                                nModified: 1,
                                ok: 1
                            };
                        case NON_EXISTENT_ID:
                            return {
                                n: 0,
                                nModified: 0,
                                ok: 1
                            };
                        case BAD_ID:
                            throw new Error('cant cast to ObjectId!');
                    }
                });
            });

            after(() => {
                dbMethodStub.restore();
            });

            it('returns void, when deletion is successful', async () => {
                let result = await warehouseMethods.deleteItem({
                    _id: EXISTENT_ITEM._id
                });
                expect(result).to.be.undefined;
            });

            it('returns EntityNotFoundError, when item was not found', async () => {
                try {
                    await warehouseMethods.deleteItem({_id: NON_EXISTENT_ID});
                } catch (err) {
                    assert(err instanceof apiTypes.EntityNotFoundError);
                    return;
                }
                assert.fail();
            });

            it('returns DatabaseError, when an error happens', async () => {
                try {
                    await warehouseMethods.deleteItem({_id: BAD_ID});
                } catch (err) {
                    assert(err instanceof apiTypes.DatabaseError);
                    return;
                }
                assert.fail();
            });
        });
    });
});
