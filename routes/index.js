const router = require("express").Router();
const api = require("./api");

router.use("/api", api);

router.use((req, res) => {
  return res.send("Wrong route!");
});

module.exports = router;
