const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        require: true,
        default: 'https://via.placeholder.com/160'
    },
    following:[{
        type:ObjectId,
        ref: "User"
    }],
    followers:[{
        type:ObjectId,
        ref: "User"
    }]

});

// Update the existing User model if it exists, or create a new one
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;