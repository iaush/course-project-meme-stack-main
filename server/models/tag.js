const { Schema, model, ObjectId } = require('mongoose');

var TagSchema = new Schema(
  {
    created: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: ObjectId,
        ref: 'User'
    },
    name: {type: String},
    sessionId: {
        type: ObjectId,
        ref: 'Session'
    }
  }
);

var Tag = model('Tag', TagSchema);

module.exports = Tag;