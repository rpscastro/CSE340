const e = require("connect-flash");
const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav, errors: null });
};
/* *********Error Testing Controller******************/
baseController.errorTesting = async function (req, res) {
  null.toString();
};

module.exports = baseController;
