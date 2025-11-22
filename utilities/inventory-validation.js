const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    // firstname is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .matches(/^[A-Za-z]+$/)
      .withMessage("The classification name given does not meet requirements."), // on error this message is sent.

    // password is required and must be strong password
    // body("account_password")
    //   .trim()
    //   .notEmpty()
    //   .isStrongPassword({
    //     minLength: 12,
    //     minLowercase: 1,
    //     minUppercase: 1,
    //     minNumbers: 1,
    //     minSymbols: 1,
    //   })
    //   .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {  
      errors,
      title: "Add New Classification",
      nav,
      classification_name,

    });
    return;
  }
  next();
};

module.exports = validate;
