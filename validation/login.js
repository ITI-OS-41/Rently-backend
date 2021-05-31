const Validator = require('validator');


module.exports = function (data) {
    let errors = {}

    if(Validator.isEmpty(data.email)){
        errors.email = 'Email is required'
    }
    if(!Validator.isEmail(data.email)){
        errors.email = 'Email is invalid'
    }

    if(Validator.isEmpty(data.password)){
        errors.password = 'password is required'
    }
    if(!Validator.isLength(data.password, {min: 6, max: 30})){
        errors.password = 'password must be between 6 to 30'
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
};
