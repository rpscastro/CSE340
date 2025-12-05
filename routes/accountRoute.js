// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");
const { route } = require("./static");

// Route to Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to Registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

//Route to process Registration form
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)  
);


// Route to show management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement));

// Route to Edit Account view
router.get(
  "/edit",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildEditAccount));
module.exports = router;

// Process the Edit Account attempt
router.post(
  "/edit",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);
module.exports = router;

// Process the Edit Account attempt
router.post(
  "/password-change",
  regValidate.changePasswordRules(),
  utilities.handleErrors(accountController.changePassword)
);

//Process the Logout request
router.get("/logout",
  utilities.handleErrors(accountController.accountLogout)
);

module.exports = router;