const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ***************************
 *  Deliver login view
 * ************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ***************************
 *  Deliver Registration view
 * ************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process Login request
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Build Management view
 * ************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ***************************
 *  Build Edit Account view
 * ************************** */
async function buildEditAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Account Editing
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  const regResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (regResult) {
    // get the updated account data, remove the password, refresh the JWT cookie
    const accountData = await accountModel.getAccountById(account_id);
    if (accountData) {
      delete accountData.account_password;

      // sign a new token with the updated account data
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      // set the cookie (match the same options used on login)
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }

      // update response locals for the current request
      res.locals.accountData = accountData;
      res.locals.loggedin = 1;
    }

    req.flash(
      "notice",
      `${account_firstname} your account was successfully updated.`
    );

    res.status(201).render("./account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the update process failed.");
    res.status(501).render("./account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process Password Change
 * *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password update."
    );
    res.status(500).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.changePassword(
    hashedPassword,
    account_id
  );

  if (regResult) {
    // get the updated account data, remove the password, refresh the JWT cookie
    const accountData = await accountModel.getAccountById(account_id);
    if (accountData) {
      delete accountData.account_password;

      // sign a new token with the updated account data
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      // set the cookie (match the same options used on login)
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }

      // update response locals for the current request
      res.locals.accountData = accountData;
      res.locals.loggedin = 1;
    }

    req.flash("notice", `Your password was successfully updated.`);
    res.status(201).render("./account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  }
}

/* ***************************
 *  Process Logout request
 * ************************** */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt");
  res.locals.accountData = undefined;
  res.locals.loggedin = 0;
  let nav = await utilities.getNav();
  res.render("./", {
    title: "Home",
    nav,
    errors: null,
  });
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  buildEditAccount,
  updateAccount,
  changePassword,
  accountLogout,
};
