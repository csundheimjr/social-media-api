const { connect, connection } = require("mongoose");

connect("mongodb://localhost/socialMediaAPI", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
