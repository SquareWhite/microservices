struct Manufacturer {
    1: required string _id,
    2: required string name,
    3: optional string address,
    4: optional string phoneNumber
}

struct Item {
    1: required string _id,
    2: required string name,
    3: string manufacturerId,
    4: double price,
    5: string arrivalDate,
    6: i32 quantity
}

struct ManufacturerInfo {
    1: optional string _id,
    2: optional string name,
    3: optional string address,
    4: optional string phoneNumber
}

struct ItemInfo {
    1: optional string _id,
    2: optional string name,
    3: optional string manufacturerId,
    4: optional double price,
    5: optional string arrivalDate,
    6: optional i32 quantity
}

exception DatabaseError {
    1: string message
}

exception ValidationError {
    1: string message
}

exception EntityNotFoundError {
    1: string message
}

service Warehouse {

    Manufacturer getManufacturerById(1: string id)
        throws (1: DatabaseError error, 2: EntityNotFoundError error2),

    list<Manufacturer> findManufacturers(1: ManufacturerInfo info)
        throws (1: DatabaseError error, 2: EntityNotFoundError error2),

    string insertManufacturer(1: ManufacturerInfo info)
        throws (1: DatabaseError error, 2: ValidationError error2),

    void updateManufacturerById(1: string id, 2: ManufacturerInfo info)
        throws (1: DatabaseError error, 2: EntityNotFoundError error2),

    void deleteManufacturer(1: ManufacturerInfo info)
        throws (1: DatabaseError error, 2: EntityNotFoundError error2),


    Item getItemById(1: string id)
        throws (1: DatabaseError error, 2: EntityNotFoundError error2),

    list<Item> findItems(1: ItemInfo info)
        throws (1: DatabaseError error, 2: EntityNotFoundError error2),

    string insertItem(1: ItemInfo info)
        throws (1: DatabaseError error, 2: ValidationError error2),

    void updateItemById(1: string id, 2: ItemInfo info)
        throws (1: DatabaseError error, 2: EntityNotFoundError error2),

    void deleteItem(1: ItemInfo info)
        throws (1: DatabaseError error, 2: EntityNotFoundError error2)

}

