const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Classification Data Validation Rules
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
  ];
};

/* ******************************
 * Check data and return errors or continue to classification
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

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [
    // classification_id is required and must be a number
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .matches(/^[1-9]\d*$/)
      .withMessage("Please provide a valid Classification."), // on error this message is sent.

    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid Make name."), // on error this message is sent.

    // inv_model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a Model name."), // on error this message is sent.

    // inv_description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a Description."), // on error this message is sent.

    // inv_image is required and must be string
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 22 })
      .withMessage("Please provide a valid Image path."), // on error this message is sent.

    // inv_thumbnail is required and must be string
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 22 })
      .withMessage("Please provide a valid Thumbnail image path."), // on error this message is sent.

    // inv_price is required
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid Price."), // on error this message is sent.

    // inv_year is required and must be string
    body("inv_year")
      .isNumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a valid Year."), // on error this message is sent.

    // inv-miles is required and must be string
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Please provide a valid Miles amount."), // on error this message is sent.

    // inv_color is required and must be string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a Color."), // on error this message is sent.
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let select_classification = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      select_classification,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate;
