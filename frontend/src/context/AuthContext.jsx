import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            // Check if we can get a new access token via refresh token cookie
            const res = await api.post('/auth/refresh');
            if (res.data.success) {
                setAccessToken(res.data.accessToken);
                const userRes = await api.get('/auth/me');
                if (userRes.data.success) {
                    setUser(userRes.data.data);
                }
            }
        } catch (error) {
            console.error('Silent refresh failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = (userData, token) => {
        setAccessToken(token);
        setUser(userData);
    };

    const signup = (userData, token) => {
        setAccessToken(token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAgent: user?.role === 'Agent',
        isAdmin: user?.role === 'Admin',
        loadUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
