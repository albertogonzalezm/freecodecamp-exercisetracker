const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    }
}, {
    versionKey: false,
    timestamps: false
})

module.exports = mongoose.model("users", userSchema);