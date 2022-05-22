const { User, Thought } = require('../models');


// Aggregate function to get the number of Users overall
const friendCount = async () =>
  User.aggregate()
    // Your code here
    .count("numberOfUsers")
    .then((numberOfUsers) => numberOfUsers);

// A function that executes the aggregate method on the user model and will calculate the overall grade by using the $avg operator
const grade = async (userId) =>
  User.aggregate(
    [
      {
        $unwind: '$reactions',
      },
      {
        $group: {
          // Your code here
          _id: userId,
          avg_score: { $avg: '$reactions.score' },
        },
      },
    ]);


module.exports = {

  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
          friendCount: await friendCount(),
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .lean()
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
            user,
            grade: await grade(req.params.userId),
          })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      {
        new: true,
        runValidators: true
      }
      )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // Delete a User and remove them from the thought
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Thought.findOneAndUpdate(
            { users: req.params.userId },
            { $pull: { Users: req.params.userId } },
            { new: true }
          )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
            message: 'user deleted, but no thoughts found',
          })
          : res.json({ message: 'user successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },



  // POST /api/users/:userId/friends/:friendId
  addFriend({ params }, res) {
    // add friendId to userId's friend list
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this userId' });
          return;
        }
        // add userId to friendId's friend list
        User.findOneAndUpdate(
          { _id: params.friendId },
          { $addToSet: { friends: params.userId } },
          { new: true, runValidators: true }
        )
          .then(dbUserData2 => {
            if (!dbUserData2) {
              res.status(404).json({ message: 'No user found with this friendId' })
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  },

  // DELETE /api/users/:userId/friends/:friendId
  deleteFriend({ params }, res) {
    // remove friendId from userId's friend list
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this userId' });
          return;
        }
        // remove userId from friendId's friend list
        User.findOneAndUpdate(
          { _id: params.friendId },
          { $pull: { friends: params.userId } },
          { new: true, runValidators: true }
        )
          .then(dbUserData2 => {
            if (!dbUserData2) {
              res.status(404).json({ message: 'No user found with this friendId' })
              return;
            }
            res.json({ message: 'Successfully deleted the friend' });
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  }














};
