const { Schema, model, ObjectId } = require('mongoose');

var ScoreSchema = new Schema(
  {
    created: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: ObjectId,
        ref: 'User'
    },
    score: Number,
    tagId: {
      type: ObjectId,
      ref: 'Tag'
    },
    sessionId: {
        type: ObjectId,
        ref: 'Session'
    }
  }
);

var Score = model('Score', ScoreSchema);

module.exports = Score;