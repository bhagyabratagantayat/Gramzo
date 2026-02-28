import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlineCalendar,
    HiOutlineChartBar,
    HiOutlineBell
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const { user, isAgent } = useAuth();

    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
                <HiOutlineHome className="bottom-nav-icon" />
                <span>Home</span>
            </NavLink>
            <NavLink to={user ? (user.role === 'Agent' ? "/agent/marketplace" : "/marketplace") : "/marketplace"} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineShoppingBag className="bottom-nav-icon" />
                <span>Shop</span>
            </NavLink>
            <NavLink to={user ? "/bookings" : "/login"} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineCalendar className="bottom-nav-icon" />
                <span>Bookings</span>
            </NavLink>
            <NavLink to={user ? "/notifications" : "/login"} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineBell className="bottom-nav-icon" />
                <span>Updates</span>
            </NavLink>
            <NavLink to={user ? "/dashboard" : "/login"} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <HiOutlineChartBar className="bottom-nav-icon" />
                <span>Account</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
