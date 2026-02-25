// Basic admin check middleware
// Simulated for now: checks for role in headers
const adminAuth = (req, res, next) => {
    const role = req.headers['x-user-role'];

    if (role !== 'Admin') {
        return res.status(403).json({
            success: false,
            error: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

module.exports = adminAuth;
