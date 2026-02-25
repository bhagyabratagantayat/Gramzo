import { Navigate } from 'react-router-dom';
import { getUser, isAdmin } from '../services/auth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const user = getUser();

    if (!user) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        // Role mismatch
        alert("Access Denied: Admins Only");
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
