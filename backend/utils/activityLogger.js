const ActivityLog = require('../models/ActivityLog');

const logActivity = async (user, action, details) => {
    try {
        await ActivityLog.create({
            user,
            action,
            details
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
        // We don't want to block the main flow if logging fails
    }
};

module.exports = logActivity;
