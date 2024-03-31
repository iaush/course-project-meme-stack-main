const { Schema, model, ObjectId } = require('mongoose');
const autoIncrementModelID = require('./counter');

var ModuleSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
            min: 1,
        },
        // Example: IT5007
        code: String,
        // Example: Software Engineering on Application Architecture
        name: String,
        // Example: 2
        semester: {
            type: Number,
            enum: [1, 2]
        },
        // Example: 2022-2023
        acadYear: {
            type: String,
            required: true
        },
        title: String,
        description: String,
        department: String,
        moduleCode: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: ObjectId,
            ref: 'User'
        },
        status: {
            type: Number,
            enum: [0, 1, 2]
        },
        weeks: {
            type: Map,
            of: [{
                type: ObjectId,
                ref: 'Session'
            }]
        }
    },
    {
        toObject: {virtuals: true},
        methods: {
            toJSON() {
                // Method to return object to frontend
                var module = this.toObject();
                delete module._id;
                return module;
            },
        },
    }
);

ModuleSchema.pre('save', function (next) {
    if (!this.isNew) {
        next();
        return;
    }
    autoIncrementModelID('module', this, next);
})

var Module = model('Module', ModuleSchema);

module.exports = Module;
