const { Schema, model } = require('mongoose');
const assignmentSchema = require('./Assignment');

// Schema to create username model
const usernameSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: () => Promise.resolve(false),
        message: 'Email validation failed'
      },
    },
    friends: [{ type: Schema.Types.ObjectId, ref: 'friend' }],
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,//don't return the id of the element(s)
  }
);

userSchema
  .virtual('friendCount')
  // Getter
  .get(function () {
    return this.friends.length;
  })
  // Setter to set the username
  .set(function (virtual) {
    const username = virtual;
    this.set({ username });
  });


const username = model('username', usernameSchema);

module.exports = username;
