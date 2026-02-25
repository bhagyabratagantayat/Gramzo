import { Navigate } from 'react-router-dom';
import { getUser, isAdmin, isAgent } from '../services/auth';

const ProtectedRoute = ({ children, adminOnly = false, agentOnly = false }) => {
    const user = getUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/" replace />;
    }

    if (agentOnly && !isAgent()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
