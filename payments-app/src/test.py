import requests


def order_test():
    URL = 'localhost:5001/api/order'
    test_data = {
        "userId": "1",
        "order": [{"_id": "123", "quantity": 2}]
    }
    response = requests.post(URL, test_data)
    print(response)


if __name__ == '__main__':
    order_test()
