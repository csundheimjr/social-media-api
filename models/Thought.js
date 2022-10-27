const { Schema, model, Types } = require("mongoose");

//Formatting the timestamp
const formatTimestamp = () => {
  //creating a new date object of current date
  const timestamp = new Date();

  //setting requirements for the formatting -- refer to MDN Date doc
  const dateOptions = { year: "numeric", month: "short", day: "numeric" };
  const timeOptions = {
    timeZoneName: "short",
    hour: "2-digit",
    minute: "2-digit",
  };

  // date should look something like - Jan 01, 2000
  const date = timestamp.toDateString("en-US", dateOptions);
  // time should look something like - 12:00 PM MST
  const time = timestamp.toLocaleTimeString("en-US", timeOptions);

  //returning the formatted timestamp - Jan 01, 2000 at 12:00 PM MST
  return `${date} at ${time}`;
};

//Reaction Schema (schema only - used as subdocument schema)
const reactionSchema = new Schema(
  {
    reactionId: { type: Types.ObjectId, default: new Types.ObjectId() },
    _id: { id: false },
    reactionBody: { type: String, require: true, maxLength: 280 },
    username: { type: String, require: true },
    createdAt: {
      type: Date,
      default: Date.now,
      //getter to format timestamp
      get: formatTimestamp,
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Schema for thoughts
const thoughtSchema = new Schema(
  {
    thoughtText: { type: String, require: true, minLength: 1, maxLength: 280 },
    createdAt: {
      type: Date,
      default: Date.now,
      //getter to format the timestamp
      get: formatTimestamp,
    },
    //user that created the thought
    username: { type: String, require: true },
    //reactions are like replies
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
