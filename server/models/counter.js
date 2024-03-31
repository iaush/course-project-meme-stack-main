const { Schema, model } = require('mongoose');

var counterSchema = Schema({
    _id: { 
        type: String,
        required: true 
    },
    seq: {  
        type: Number,
        default: 0 
    }
    }
);

counterSchema.index({ _id: 1, seq: 1 }, { unique: true });

var counterModel = model('Counter', counterSchema);

// Add a counter model to the db to assign numeric IDs to
// modules
const autoIncrementModelID = function (modelName, doc, next) {
counterModel.findByIdAndUpdate(
        modelName, 
        { $inc: { seq: 1 } }, 
        { new: true, upsert: true },
        function(error, counter) { 
        if(error) return next(error);

        doc.id = counter.seq;
        next();
        }
    ); 
}

module.exports = autoIncrementModelID;