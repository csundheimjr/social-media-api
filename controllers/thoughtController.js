const { Thoughts, Users } = require("../models");

module.exports = {
  async getThoughts(req, res) {
    try {
      const allThoughts = await Thoughts.find();
      return res.json(allThoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createThought(req, res) {
    try {
      const newThought = await Thoughts.create(req.body);
      const userUpdate = await Users.findOneAndUpdate(
        { username: req.body.username },
        { $addToSet: { thoughts: newThought._id } },
        { new: true }
      );
      if (!userUpdate) {
        return res.status(404).json({
          message: "Thought created, but no user with that username",
          newThought,
        });
      }
      return res.json({ message: "Thought created!", newThought });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getOneThought(req, res) {
    try {
      const singleThought = await Thoughts.findOne({
        _id: req.params.thoughtId,
      });
      if (!singleThought) {
        return res.status(404).json({ message: "No thought with this ID" });
      }
      return res.json(singleThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateThought(req, res) {
    try {
      const updatedThought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: "No thought with this ID" });
      }
      return res.json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteThought(req, res) {
    try {
      const deletedThought = await Thoughts.findOneAndDelete({
        _id: req.params.thoughtId,
      });
      if (!deletedThought) {
        return res.status(404).json({ message: "No thought with this ID" });
      }
      const thoughtsUser = await Users.findOneAndUpdate(
        {
          thoughts: req.params.thoughtId,
        },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      if (!thoughtsUser) {
        return res.status(404).json({
          message: "Thought deleted but no user with this thought",
        });
      }
      return res.json({ message: "Thought Deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async addReaction(req, res) {
    try {
      const newReaction = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!newReaction) {
        return res.status(404).json({ message: "No thought with this ID" });
      }
      return res.json(newReaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async removeReaction(req, res) {
    try {
      const removedReaction = await Thoughts.findOneAndUpdate(
        {
          _id: req.params.thoughtId,
        },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!removedReaction) {
        return res.status(404).json({ message: "No thought with this ID" });
      }
      return res.json(removedReaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
