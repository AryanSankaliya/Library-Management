const express = require('express');
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middlewares/auth');

const router = express.Router();

// GET Recent Activities (Admin Only ideally, or protected)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const activities = await ActivityLog.find()
            .sort({ timestamp: -1 })
            .limit(50); // Limit to last 50 activities

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch activities",
            error: error.message
        });
    }
});

module.exports = router;
