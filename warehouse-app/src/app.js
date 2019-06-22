require('dotenv').config();
const mongoose = require('mongoose');
const thrift = require('thrift');

const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

function connect() {
    mongoose.connect(
        // `mongodb://${username}:${password}@${host}:27017/${dbName}`,
        `mongodb://${host}:27017/${dbName}`,
        {useNewUrlParser: true},
        (err) => {
            if (err) {
                // console.error(`mongodb://${username}:${password}@${host}:27017/${dbName}`);
                console.error(`mongodb://${host}:27017/${dbName}`);
                console.error('Failed to connect, retrying in 5 seconds...');
                setTimeout(connect, 5000);
            }
        }
    );
}
connect();

const server = require('./api/warehouse');
const port = process.env.API_PORT;
server.listen(port);
console.log(`Thrift server is listening on port ${port}...`);



