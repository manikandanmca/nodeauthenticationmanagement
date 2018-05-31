const Validator = require('validator');
const isEmpty = require('./isEmpty');
module.exports = function ValidateRegisterInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  
  if(!Validator.isLength(data.name, {min: 2, max: 30})) {
  	errors.name = "Name should be between 2 to 30 characters"; 
  }

  if(Validator.isEmpty(data.name)) {
  	errors.name = "Name should not be blank.";
  }

  if(!Validator.isEmail(data.email)) {
  	errors.email = "Email should be valid.";
  }

  if(Validator.isEmpty(data.email)) {
  	errors.email = "Email should not be blank.";
  }

  if(!Validator.isLength(data.password, {min: 6, max: 30})) {
  	errors.password = "Password should be min 6 characters max 30 characters.";
  }

  if(Validator.isEmpty(data.password)) {
  	errors.password = "Password should not be blank.";
  }
  
  if(!Validator.equals(data.password, data.password2)) {
  	errors.password2 = "Password and Confirm Password is not equal.";
  }

  if(Validator.isEmpty(data.password2)) {
  	errors.password2 = "Confirm Password should not be blank.";
  }
 
  return {
  	errors, 
    isValid: isEmpty(errors)
  }
}