const thrift = require("thrift");
const WarehouseAPI = require("./gen-nodejs/Warehouse");
const methods = require('./warehouseMethods');

module.exports = thrift.createServer(WarehouseAPI, methods);
