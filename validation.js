//validation
const Joi = require("joi");
require("dotenv").config();

//address validation
const addressValidation = data => {
  const schema = Joi.object({
    name: Joi.string()
      .strip()
      .required()
  });

  return schema.validate(data);
};



module.exports = {
  addressValidation
};
