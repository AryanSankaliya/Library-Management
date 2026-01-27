const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: {
        type: String, // Storing Name or Email directly to keep log even if user is deleted
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['LOGIN', 'DELETE_USER', 'ISSUE_BOOK', 'RETURN_BOOK', 'FORGOT_PASS', 'REGISTER']
    },
    details: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
