export const getUser = () => {
    try {
        const user = localStorage.getItem('gramzoUser');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error("Auth error:", e);
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem('gramzoUser');
};

export const isAgent = () => {
    const user = getUser();
    return user?.role === 'Agent';
};

export const isAdmin = () => {
    const user = getUser();
    return user?.role === 'Admin';
};
