const { ObjectId } = require("bson");

const usernames = ["Carl", "Beth", "Josh", "Peter", "Ember", "Bill", "Sue"];

const possibleThoughts = [
  "Today is rainy..",
  "Today is snowy..",
  "Today is sunny..",
  "Today is coudy..",
];

const possibleReactions = [
  "I love this weather!",
  "You are Correct!",
  "Miserable isn't it?",
  "Did you bring appropriate clothing?",
];

const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomUsername = () => `${getRandomArrItem(usernames)}`;

const users = [];

for (let i = 0; i < 10; i++) {
  const username = getRandomUsername();
  const email = `${username}@email.com`;

  users.push({
    username: username,
    email: email,
  });
}

const getRandomThoughts = (int) => {
  let results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      thoughtText: getRandomArrItem(possibleThoughts),
      username: getRandomArrItem(users).username,
      reactions: [...getRandomReactions(2)],
    });
  }
  return results;
};

const getRandomReactions = (int) => {
  let results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      reactionId: new ObjectId(),
      reactionBody: getRandomArrItem(possibleReactions),
      username: getRandomArrItem(users).username,
    });
  }
  return results;
};

module.exports = { users, getRandomThoughts, getRandomReactions };
