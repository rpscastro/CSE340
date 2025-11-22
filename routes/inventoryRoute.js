// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");
// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to show inventory item detail view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
);

// Route to show management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to show Add Classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Process the Add Classification atempt
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.processAddClassification)
);

module.exports = router;
