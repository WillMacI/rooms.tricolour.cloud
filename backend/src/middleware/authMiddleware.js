const jwt = require('jsonwebtoken');

// Middleware to authenticate requests, attach user info to the request
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info (uuid, role) to the request
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to check if the user accessing data about an organization is a member of that organization.
const orgCheck = (req, res, next) => {
    if (req.user.org_uuid === req.params.organization || req.user.role === 'super_admin') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: You are not allowed to pull data from an organization you do not belong to.' });
    }
}

// Middleware to check if the user accessing data is the owner of the data.
const ownerCheck = (req, res, next) => {
    if (req.user.uuid === req.params.uuid || req.user.role === 'super_admin' || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: You do not have the correct privileges to pull that data.' });
    }
}

// Middleware to authorize requests based on user role
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
};

module.exports = { authenticate, authorize, orgCheck, ownerCheck };
