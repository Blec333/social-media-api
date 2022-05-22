const e = require('express');
const connection = require('../config/connection');
const { Thought, User } = require('../models');
const { getRandomName, getRandomArrItem, appThoughts, appReactions } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing thoughts
  await Thought.deleteMany({});

  // Drop existing users
  await User.deleteMany({});


// USERS ---------------------------------------------------------------------------------------

// STEP 1: Create empty array to hold the users
const users = [];

// STEP 2: Construct user data object
const constructUserData = () => {
  const username = getRandomName();
  const email = `${username}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}@email.com`;
  const thoughts = [];
  let singleUser = { username, email, thoughts }
  return singleUser;
}

// STEP 3: Ensure user is unique within users prior to adding
var currentUser;
const checkUniqueUser = () => {
  currentUser = constructUserData();
  users.forEach((el) => {
    if (el && currentUser.username === el.username) {
      checkUniqueUser();
    }
  });
  return currentUser;
}

// STEP 4: Once determined unique, push into users array
const addUniqueUser = () => {
  let user = checkUniqueUser();
  users.push(user);
}

// Initialize steps above and loop 20 times -- adding only unique users to the users array
for (let i = 0; i < 20; i++) {
  addUniqueUser();
}





// THOUGHTS ------------------------------------------------------------------------------------



// Function to generate random reactions that we can add to user object.
const getRandomReactions = (int) => {
  const results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      username: getRandomArrItem(users).username,
      reactionName: getRandomArrItem(appReactions),
    });
  }
  return results;
};

// Function to generate random thoughts that we can add to user object.
const getRandomThoughts = (int, passedInUser) => {
  const results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      thoughtText: getRandomArrItem(appThoughts),
      username: passedInUser,
      // reactions: getRandomReactions(3),
    });
  }
  return results;
};



// Create empty array to hold the thoughts
const thoughts = [];
users.forEach((el) => {
  if (el) {
    const thoughtsToPush = getRandomThoughts(2, el.username);
    console.log(thoughtsToPush)
    thoughtsToPush.forEach((el) => {
      thoughts.push(el);
    });
    // thoughts.push(thoughtsToPush);
  }
});







// Add users to the collection and await the results
await User.collection.insertMany(users);

// Add thoughts to the collection and await the results
await Thought.collection.insertMany(thoughts);

// Log out the seed data to indicate what should appear in the database
console.table(users);
console.table(thoughts);
console.info('Seeding complete! 🌱');
process.exit(0);
});
