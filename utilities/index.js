const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.buildDetailsGrid = async function (data) {
  let vehicle = data[0];
  let grid;
  grid = '<div id="vehicle-details">';
  grid += '<div class="vehicle-image">';
  grid +=
    '<picture><source media="(min-width: 700px)" srcset="' +
    vehicle.inv_image +
    '">' +
    '<img src="' +
    vehicle.inv_image +
    '" loading="lazy" alt="' +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    ' on CSE Motors"> </picture>  </div>';
  grid += '<div class="vehicle-info">';
  grid +=
    "<h2>" + vehicle.inv_make + " " + vehicle.inv_model + " Details </h2>";
  grid += "<hr />";
  grid +=
    ' <p><span class="label">Price: </span>$' +
    Intl.NumberFormat("en-US").format(vehicle.inv_price) +
    "</p>";
  grid +=
    ' <p><span class="label">Description: </span>' +
    vehicle.inv_description +
    "</p>";
  grid += ' <p><span class="label">Color: </span>' + vehicle.inv_color + "</p>";
  grid +=
    ' <p><span class="label">Miles: </span>' +
    new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
    "</p>";
  grid += "</div>";
  grid += "</div>";

  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* **************************************
 * Build the classification list for form select element HTML
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  const accountData = res.locals.accountData;
  if (
    accountData &&
    (accountData.account_type === "Admin" ||
      accountData.account_type === "Employee")
  ) {
    return next();
  }

  req.flash("notice", "Insufficient privileges to manage inventory.");
  return res.redirect("/account/login");
};

module.exports = Util;
