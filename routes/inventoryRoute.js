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
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
);

// Route to show Add Classification view
router.get(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

// Process the Add Classification atempt
router.post(
  "/add-classification",
  utilities.checkAccountType,
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.processAddClassification)
);

// Route to show Add Inventory view
router.get(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

// Process the Add Inventory atempt
router.post(
  "/add-inventory",
  utilities.checkAccountType,
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.processAddInventory)
);

router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to show inventory item edit view
router.get(
  "/edit/:invId",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
);

// Process the Edit Inventory atempt
router.post(
  "/edit-inventory",
  utilities.checkAccountType,
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to show inventory item delete view
router.get(
  "/delete/:invId",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteInventory)
);

// Process the Delete Inventory atempt
router.post(
  "/delete-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
);


// Route to show favorites view
router.get(
  "/favorites",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildFavoritesView)
);

// Route to add an item to favorites
router.get(
  "/add-favorite/:invId",
  utilities.checkLogin,
  utilities.handleErrors(invController.addToFavoritesPage)
);

// Route to add an item to favorites
router.post(
  "/add-favorite",
  utilities.checkLogin,
  invValidate.addFavoriteRules(),
  invValidate.checkFavoriteData,
  utilities.handleErrors(invController.addToFavoritesProcess)
);

module.exports = router;
