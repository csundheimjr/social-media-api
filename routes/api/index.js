const router = require("express").Router();
const users = require("./userRoutes");
const thoughts = require("./thoughtRoutes");

router.use("/users", users);
router.use("/thoughts", thoughts);

module.exports = router;
