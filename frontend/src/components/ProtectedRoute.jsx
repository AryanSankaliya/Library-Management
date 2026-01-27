import React from 'react'
import NotFound from '../pages/NotFound'

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if (!token) {
        return <Navigate to='/login' replace />
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <NotFound />
    }

    return children
}

export default ProtectedRoute