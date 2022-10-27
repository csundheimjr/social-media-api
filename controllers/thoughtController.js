const Thought = require("../models/Thought");
const User = require("../models/User");

module.exports = {
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .populate("reactions")
      .then((thought) => {
        if (!thought) {
          res.status(404).json({
            message: "No thought found with that Id",
          });
        } else {
          res.json(thought);
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then((userData) => {
        User.findByIdAndUpdate(
          { username: req.body.userName },
          {
            $push: { thoughts: userData._id },
          },
          { new: true }
        );
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((updatedThought) => {
        if (!updatedThought) {
          res.status(404).json({
            message: "No thought with that Id",
          });
        } else {
          res.json(updatedThought);
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  deleteThought(req, res) {
    Thought.findByIdAndRemove({ _id: req.params.thoughtId })
      .then((deletedThought) => {
        if (!deletedThought) {
          res.status(404).json({
            message: "No thought with that Id",
          });
        } else {
          res.json("Thought deleted");
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  createReaction(req, res) {
    Thought.findByIdAndUpdate(
      { _id: req.params.thoughtId },
      {
        $addToSet: {
          reactions: req.body,
        },
      },
      { runValidators: true, new: true }
    )
      .then((newReaction) => {
        if (!newReaction) {
          res.status(404).json({
            message: "No thought found with that Id",
          });
        } else {
          res.json(newReaction);
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },

      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((removedReaction) => {
        if (!removedReaction) {
          res.status(404).json({
            message: "No thought with that Id",
          });
        } else {
          res.json("Reaction removed from thought");
        }
      })
      .catch((err) => res.status(500).json(err));
  },
};
