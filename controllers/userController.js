const User = require("../models/User");

module.exports = {
  getAllUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("thoughts", "friends")
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: "No user found with that Id",
          });
        } else {
          res.json(user);
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  createUser(req, res) {
    User.create(req.body)
      .then((newUserData) => res.json(newUserData))
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          res.status(404).json({
            message: "No user with that Id",
          });
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  deleteUser(req, res) {
    User.findByIdAndRemove({ _id: req.params.userId })
      .then((deletedUser) => {
        if (!deletedUser) {
          res.status(404).json({
            message: "No user with that Id",
          });
        } else {
          res.json(`${deletedUser.username} was deleted!!`);
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  addFriend(req, res) {
    User.findByIdAndUpdate(
      { _id: req.params.userId },
      {
        $push: {
          friends: req.params.friendId,
        },
      },
      { runValidators: true, new: true }
    )
      .then((addedFriend) => {
        if (!addedFriend) {
          res.status(404).json({
            message: "Cannot add friend. No user found with that Id",
          });
        } else {
          res.json(addedFriend);
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  deleteFriend(req, res) {
    User.findOne({ _id: req.params.userId }).then((userData) => {
      if (!userData) {
        res.status(404).json({
          message: "No user found with that Id",
        });
      } else {
        User.findOneAndRemove({ friends: req.params.friendId })
          .then((removedFriend) => {
            if (!removedFriend) {
              res.status(404).json({
                message: "Friend does not exist.",
              });
            } else {
              res.json("Friend removed!");
            }
          })
          .catch((err) => res.status(500).json(err));
      }
    });
  },
};
