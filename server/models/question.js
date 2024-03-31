const { Schema, model, ObjectId} = require('mongoose');

var QuestionSchema = new Schema(
  {
    sessionId: ObjectId,
    question: {
        type: String,
        required: true,
        index: true,
    },
    answer: String,
    created: {
        type: Date,
        default: Date.now
    },
    submitter: {
        type: String
    },
    
  },
  {
    methods: {
      toJSON() {
        // Method to return object to frontend
        var question = this.toObject();
        delete question.__v;
        return question;
      },
    },
  }
);

var Question = model('Question', QuestionSchema);

module.exports = Question;
