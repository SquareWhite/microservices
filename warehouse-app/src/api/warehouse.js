const thrift = require("thrift");
const WarehouseAPI = require("./gen-nodejs/Warehouse");
const methods = require('./warehouseMethods');

//TODO can't use null values
//TODO test api with db (best practices for db integration tests)
//TODO documentation (from stubbed tests / from thrift spec / swagger)
module.exports = thrift.createServer(WarehouseAPI, methods);


