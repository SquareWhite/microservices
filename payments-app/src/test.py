# from thrift import Thrift
# from thrift.transport import TSocket
# from thrift.transport import TTransport
# from thrift.protocol import TBinaryProtocol
#
# from warehouse_api import Warehouse
# from warehouse_api.ttypes import ManufacturerInfo
# from warehouse_api.ttypes import ItemInfo
#
#
# def main():
#     pass
#
#
# if __name__ == '__main__':
#     transport = TSocket.TSocket('localhost', 3000)
#     transport = TTransport.TBufferedTransport(transport)
#     protocol = TBinaryProtocol.TBinaryProtocol(transport)
#     client = Warehouse.Client(protocol)
#     transport.open()
#     # main()
