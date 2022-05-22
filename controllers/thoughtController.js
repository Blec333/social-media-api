const { Thought, User } = require('../models');

module.exports = {

  // Get all thoughts
  getThoughts(req, res) {
    Thought.find({})
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then((thoughts) =>
        res.json(thoughts)
      )
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)})
  },

  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      })
      .catch((err) => res.status(500).json(err));
  },

  // Create a thought
  createThought(req, res) {
    console.log(req.body)
    Thought.create(req.body)
      .then((thought) => {
        User.findOneAndUpdate(
          { username: req.body.username },
          { $push: { thoughts: thought._id } },
          { new: true }
        )
          .then((user) => {
            !user
              ? res.status(404).json({ message: 'No user found with this id' })
              : res.json(user)
          })
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.findOneAndUpdate(
            { username: thought.username },
            { $pull: { thoughts: req.params.id } }
          )
            .then(() => {
              res.json({ message: 'thought deleted!' })
            })
            .catch(err => res.status(500).json(err))
      })
      .catch((err) => res.status(500).json(err));
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },




  // Add an reaction to a thought
  addReaction(req, res) {
    console.log('You are adding an reaction');
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No thought found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reaction: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No thought found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
}