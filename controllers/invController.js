const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getDetailsByInvId(inv_id);
  const grid = await utilities.buildDetailsGrid(data);
  let nav = await utilities.getNav();
  const invName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/details", {
    title: invName,
    nav,
    grid,
  });
};

/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Deliver Add Classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process Add Classification Atempt
 * *************************************** */
invCont.processAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const regResult = await invModel.addClassification(classification_name);

  if (regResult) {
    req.flash(
      "notice",
      `The  ${classification_name} classification was succesfully added.`
    );
    // Refresh the navigation so it includes the newly added classification
    nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      `Sorry, adding ${classification_name} classification failed.`
    );
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Deliver Add Inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let select_classification = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    select_classification,
    errors: null,
  });
};

/* ****************************************
 *  Process Add Classification Atempt
 * *************************************** */
invCont.processAddInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let select_classification = await utilities.buildClassificationList();
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

  const regResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  if (regResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was succesfully added.`);
    // Refresh the navigation so it includes the newly added classification
    nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", `Sorry, adding ${inv_make} ${inv_model} failed.`);
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      select_classification,
      errors: null,
    });
  }
};

module.exports = invCont;
