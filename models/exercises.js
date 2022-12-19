const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    duration: {
        type: Number,
        require: true
    },
    date: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: false
})

module.exports = mongoose.model("exercises", exerciseSchema);