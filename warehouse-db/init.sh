#!/bin/sh
set -e

# if username and password aren't found in environment,
# use the default values "user" and "pass"
USERNAME="${DB_USERNAME:-user}"
PASSWORD="${DB_PASSWORD:-pass}"
NAME="${DB_NAME:-test}"

mongo <<EOF
use $NAME

db.createUser({
	user: '$USERNAME',
	pwd: '$PASSWORD',
	roles: ["readWrite"]
});

db.createCollection("manufacturers", {
	validator: {
        \$jsonSchema: {
            bsonType: "object",
            required: [ "name" ],
            properties: {
               name: {
                  bsonType: "string",
                  description: "must be a string and is required"
               },
               address: {
                  bsonType: "string",
                  description: "must be a string"
               },
               phoneNumber: {
                  bsonType: "string",
                  description: "must be a string"
               }
            }
        }
	}
});

db.createCollection("items", {
	validator: {
        \$jsonSchema: {
            bsonType: "object",
            required: [ "name", "price", "arrivalDate", "quantity" ],
            properties: {
               name: {
                  bsonType: "string",
                  description: "must be a string and is required"
               },
               manufacturer: {
                  bsonType: "objectId",
                  description: "must be of type ObjectId"
               },
               price: {
                  bsonType: "double",
                  description: "must be of type double and is required"
               },
               arrivalDate: {
                  bsonType: "date",
                  description: "must be of type date and is required"
               },
               quantity: {
                  bsonType: "int",
                  description: "must be of type int and is required"
               }
            }
        }
	}
});


db.manufacturers.insert({
	"name": "Cool manufacturer",
	"address": "3346  Monroe Street, Houston, TX",
	"phoneNumber": "+12232232"
});
db.manufacturers.insert({
	"name": "Bad manufacturer",
	"address": "2391  Park Boulevard, Marshalltown, IA",
	"phoneNumber": "+12932632"
});
db.manufacturers.insert({
	"name": "Alright manufacturer",
	"address": "1377  Werninger Street, Houston, TX",
	"phoneNumber": "+11122321"
});


db.items.insert({
	"name": "Big computer",
	"manufacturer": db.manufacturers.find()[0]._id,
	"price": 150.0,
	"arrivalDate": new Date(),
	"quantity": NumberInt(10)
});
db.items.insert({
	"name": "Very cool chair",
	"manufacturer": db.manufacturers.find()[1]._id,
	"price": 200.0,
	"arrivalDate": new Date(),
	"quantity": NumberInt(5)
});
db.items.insert({
	"name": "Little dog",
	"manufacturer": db.manufacturers.find()[2]._id,
	"price": 39.9,
	"arrivalDate": new Date(),
	"quantity": NumberInt(1)
});
EOF


