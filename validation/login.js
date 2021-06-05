const Validator = require('validator');
import { EMAIL, USERNAME, PASSWORD } from "../helpers/errors"


module.exports = function (data) {
    let errors = {}

    if(Validator.isEmpty(data.email)){
        errors.email = EMAIL.required
    }
    if(!Validator.isEmail(data.email)){
        errors.email = EMAIL.invalid
    }

    if(Validator.isEmpty(data.password)){
        errors.password = PASSWORD.required
    }
    if(!Validator.isLength(data.password, {min: 6, max: 30})){
        errors.password = PASSWORD.criteria
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
};
