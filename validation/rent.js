import User from "../models/User"
import Item from "../models/Item"
import { ID } from "../helpers/errors"
const Validator = require("validator")


//joi library for validation 

module.exports = async (req,res,next)=> {
  let errors = {}
let data= req.body;
const id = req.params.id
const status=["pending","approved","delivered","returned","declined"]


  if (Validator.isEmpty(data.owner)) {
    errors.owner = "owner is required"
  }
  

  if (!Validator.isMongoId(data.owner)) {
    errors.owner = "this is not a valid owner id";
  } else {
    const owner = await User.findById(data.owner);
    if (!owner) {
      errors.owner = "this user is not found in our database ";
    }
  }


  if (Validator.isEmpty(data.renter)) {
    errors.renter = "renter is required"
  }
  if (!Validator.isMongoId(data.renter)) {
    errors.renter = "this is not valid user id";
  } else {
    const renter = await User.findById(data.renter);
    if (!renter) {
      errors.renter = "this user is not found in our database ";
    }
  }


  if (data.renter === data.owner) {
    errors.renter = "you can't be the owner and the renter at the same operation"
  }

  if (Validator.isEmpty(data.item)) {
    errors.item = "item is required"
  }

  if (!Validator.isMongoId(data.item)) {
    errors.item = "this is not valid item id";
  } else {
    const item = await Item.findById(data.item);
    if (!item) {
      errors.item = "this item is not found in our database ";
    }
    else if (item.stock === 0){ 
      errors.item= "this item is out of stock"
    }
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "start rental date is required"
  }

  if (Validator.isEmpty(data.to)) {
    errors.to = "end rental date is required"
  }


  const from= new Date(data.from).getTime()
  const to= new Date(data.to).getTime()

  // from should be before to
  if (from > to ){
    errors.time= "start date should be before end date"
  }

  if (Validator.isEmpty(data.insurance)) {
    errors.insurance = "insurance is required"
  }
  if (data.insurance && data.insurance < 1) {
    errors.insurance = "insurance must be greater than 1"
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = "price is required"
  }
  if (data.price && data.price < 1) {
    errors.price = "price must be greater than 1"
  }

  

  // Status check validation and controller
  if (Validator.isEmpty(data.status)) {
    errors.status = "rent status is required"
  }
  
  if (id ) {
    if (!Validator.isMongoId(id)) {
      return res.status(404).json({
        id: ID.invalid
      })
    }
    else if(data.status && !status.includes(data.status)){
      errors.satus=`${data.status} is not an accepted value for status`
    }
  }
  else{
    if(data.status!== "pending"){
      errors.satus=`${data.status} is not an accepted value for making a rent`

    }

  }
  

  if (Object.keys(errors).length> 0){
    console.log(data,errors, id)
    return res.status(404).json(errors)
  }
else{
  return next();
}
}
