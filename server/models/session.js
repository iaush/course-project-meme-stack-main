const { Schema, model, ObjectId } = require('mongoose');

var SessionSchema = new Schema(
  {
    created: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: ObjectId,
        ref: 'User'
    },
    // By reference to keep questions doc at top level
    // Requires schema to be populated before use (avoid loading all if not required)
    // More info: https://mongoosejs.com/docs/subdocs.html
    questions: [{
      type: ObjectId,
      ref: 'Question'
    }],
    tags: [{
      type: ObjectId,
      ref: 'Tag'
    }],
    scores: [{
      type: ObjectId,
      ref: 'Score'
    }],
    overallScores: [{
      type: ObjectId,
      ref: 'Score'
    }]
  }
);

var Session = model('Session', SessionSchema);

module.exports = Session;
