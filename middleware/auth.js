/**
 * Middleware to check user role and ownership
 * Expected headers: 
 * 'x-user-role': 'Admin' | 'Agent' | 'User'
 * 'x-agent-id': ObjectId (for agents)
 */

exports.authorize = (roles = []) => {
    return (req, res, next) => {
        const role = req.headers['x-user-role'];
        const agentId = req.headers['x-agent-id'];

        if (!role) {
            return res.status(401).json({
                success: false,
                error: 'No role provided in headers'
            });
        }

        if (roles.length && !roles.includes(role)) {
            return res.status(403).json({
                success: false,
                error: `Access denied. ${roles.join(' or ')} required.`
            });
        }

        // Attach to request for use in controllers
        req.userRole = role;
        req.userAgentId = agentId;

        next();
    };
};
