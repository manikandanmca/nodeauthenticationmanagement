const Validator = require('validator');
const isEmpty = require('./isEmpty');
module.exports = function ValidateLoginInput(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  
  if(!Validator.isEmail(data.email)) {
  	errors.email = "Email should be valid.";
  }

  if(Validator.isEmpty(data.email)) {
  	errors.email = "Email should not be blank.";
  }

  if(Validator.isEmpty(data.password)) {
  	errors.password = "Password should not be blank.";
  }

  return {
  	errors, 
    isValid: isEmpty(errors)
  }
}