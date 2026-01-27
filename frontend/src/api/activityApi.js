import api from "./axios";

// Get recent activities (Admin only)
export const getRecentActivities = async () => {
    return api.get("/activity");
};
