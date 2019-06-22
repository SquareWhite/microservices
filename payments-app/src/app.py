import os
from time import sleep

from dotenv import load_dotenv
from flask import Flask
from flask import request
import flask_restless
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import DOUBLE_PRECISION
from sqlalchemy.dialects.postgresql import TIMESTAMP
from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.transport.TTransport import TTransportException
from thrift.protocol import TBinaryProtocol

from warehouse_api import Warehouse
from warehouse_api.ttypes import ManufacturerInfo
from warehouse_api.ttypes import ItemInfo
from warehouse_api.ttypes import UserInfo

load_dotenv()

WAREHOUSE_HOST=os.environ['WAREHOUSE_HOST']
WAREHOUSE_PORT=os.environ['WAREHOUSE_PORT']
DB_HOST = os.environ['DB_HOST']
DB_NAME = os.environ['DB_NAME']
DB_USERNAME = os.environ['DB_USERNAME']
DB_PASSWORD = os.environ['DB_PASSWORD']
DB_URL_TEMPLATE = 'postgresql+psycopg2://{user}:{pw}@{host}:5432/{db}'
DB_URL = DB_URL_TEMPLATE.format(user=DB_USERNAME, pw=DB_PASSWORD, host=DB_HOST, db=DB_NAME)

app = Flask(__name__)
app.config['DEBUG'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# warehouse api
def connect_to_warehouse():
    global client
    transport = TSocket.TSocket(WAREHOUSE_HOST, WAREHOUSE_PORT)
    transport = TTransport.TBufferedTransport(transport)
    protocol = TBinaryProtocol.TBinaryProtocol(transport)
    client = Warehouse.Client(protocol)
    transport.open()


client = None
try:
    connect_to_warehouse()
except TTransportException as err:
    print("Couldn't connect to warehouse, reconnecting in 5 seconds")
    sleep(5)
    connect_to_warehouse()


class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    account = db.relationship('Account', back_populates='transactions')
    amount = db.Column(DOUBLE_PRECISION())
    date_completed = db.Column(TIMESTAMP())


class Account(db.Model):
    __tablename__ = 'accounts'

    id = db.Column(db.Integer, primary_key=True)
    transactions = db.relationship('Transaction', back_populates='account')
    name = db.Column(db.String(255))
    middle_name = db.Column(db.String(255))
    surname = db.Column(db.String(255))
    address = db.Column(db.String(255))
    credit_card = db.Column(db.String(16))
    cvv = db.Column(db.String(3))


manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)
manager.create_api(Transaction, methods=['GET', 'POST', 'DELETE'])
manager.create_api(Account, methods=['GET', 'POST', 'DELETE'])


@app.route('/api/order', methods=['POST'])
def send_order():
    data = request.get_json()
    item_list = list(map(
        lambda x: ItemInfo(_id=x['_id'], quantity=x['quantity']),
        data['order']
    ))
    user = Account.query.get(data['userId'])

    client.prepareOrder(
        UserInfo(_id=str(user.id),
                 name=user.name,
                 middleName=user.middle_name,
                 surname=user.surname,
                 address=user.address),
        item_list
    )
    return


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')



