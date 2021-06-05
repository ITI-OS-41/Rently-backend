const Validator = require("validator")

module.exports = function (data) {
    let errors = {}

    if (Validator.isEmpty(data.category)) {
        errors.category = "Category is required"
    }


    if (Validator.isEmpty(data.name)) {
        errors.name = "Item's name is required"
    }

    if (Validator.isEmpty(data.description)) {
        errors.description = "Description is required"
    }


    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}
