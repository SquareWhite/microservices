
function filterOutNullValues(dto) {
    for (let field of Object.keys(dto)) {
        if (dto[field] === null) {
            delete dto[field];
        }
    }
    return dto;
}


module.exports = {
    filterOutNullValues
};
