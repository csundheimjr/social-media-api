const connection = require("../config/connection");

const { User, Thought } = require("../models");

const { userSeed, thoughtSeed } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  await User.deleteMany({});
  await Thought.deleteMany({});

  await User.insertMany(userSeed);
  await Thought.insertMany(thoughtSeed);

  process.exit(0);
});
