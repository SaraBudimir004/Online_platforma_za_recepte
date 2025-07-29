const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    fullName: String,
    birthYear: Number,
    city: String,
    contactEmail: String,
    bio: String
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
