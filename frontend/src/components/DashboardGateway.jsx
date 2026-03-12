import { useAuth } from '../context/AuthContext';
import UserDashboard from '../pages/UserDashboard';
import AgentDashboard from '../pages/AgentDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import { Navigate } from 'react-router-dom';

const DashboardGateway = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case 'Admin':
            return <AdminDashboard />;
        case 'Agent':
            return <AgentDashboard />;
        case 'User':
            return <UserDashboard />;
        default:
            return <UserDashboard />;
    }
};

export default DashboardGateway;
