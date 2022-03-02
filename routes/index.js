const {
    Router
} = require("express");
const router = Router();
const controllers = require("../controllers");

router.get("/", (req, res) => res.send("Getting started..."));
router.get("/address", controllers.getAllAddress);
router.post("/address", controllers.postAddress);
router.get("/address/:id", controllers.getAddressById);
router.patch("/address/:id", controllers.updateAddress);
router.delete("/address/:id", controllers.deleteAddressById);

module.exports = router;