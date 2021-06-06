import Category from "../models/Category"
import SubCategory from "../models/SubCategory"
import User from "../models/User"
const Validator = require("validator")

module.exports = async function (data) {
    let errors = {}

    if (Validator.isEmpty(data.category)) {
        errors.category = "Category is required"
    }
    const category = await Category.findById(data.category)

    if (!category) {
      errors.category = "category is not valid category"
    }


    if (Validator.isEmpty(data.subcategory)) {
        errors.subcategory = "SubCategory is required"
    }
    const subcategory = await SubCategory.findById(data.subcategory)

    if (!subcategory) {
      errors.subcategory = "subcategory is not valid subcategory"
    }

    if (Validator.isEmpty(data.condition)) {
        errors.condition = "item Condition is required"
    }

    if (Validator.isEmpty(data.stock)) {
        errors.condition = "item Condition is required"
    }

    if (Validator.isEmpty(data.photo)) {
        errors.condition = "item Photo is required"
    }

    if (data.location.type !== "Point") {
        errors.location = "item location type must be Point"
    }

    if (data.location.coordinates.length !== 2) {
        errors.location = "item location coordinates are invalid"
    }

    if (data.location.coordinates.length < 1) {
        errors.location = "item location coordinates are required"
    }
    
    if (Validator.isEmpty(data.location.address)) {
        errors.location = "item location address is required"
    }

    if (Validator.isEmpty(data.cancellation)) {
        errors.cancellation = "item cancellation type is required"
    }

    if(data.price <=0  ) {
        errors.price ="item price should be bigger than 1"

    }
    if (Validator.isEmpty(data.deliverable)) {
        errors.deliverable = "item delivery should bedetermined"
    }


    if (Validator.isEmpty(data.name)) {
        errors.name = "Item's name is required"
    }

    if (Validator.isEmpty(data.description)) {
        errors.description = "Description is required"
    }

    if (Validator.isEmpty(data.owner)) {
        errors.owner = "owner is required"
      }
      
      const owner = await User.findById(data.owner)
    
      if (!owner) {
        errors.owner = "owner is not valid user"
      }

      if (Validator.isEmpty(data.status)) {
        errors.status = "status is required"
      }
    


    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}
