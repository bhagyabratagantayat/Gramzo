const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Validation for environment variables
const checkJWTConfig = () => {
    const required = ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'ACCESS_TOKEN_EXPIRE', 'REFRESH_TOKEN_EXPIRE'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0 && process.env.NODE_ENV === 'production') {
        throw new Error(`MISSING CONFIG: Required environment variables are missing: ${missing.join(', ')}. Please add them to your Render dashboard.`);
    }
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        checkJWTConfig();
        const { name, email, password, phone, role, location } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, error: 'Please provide name, email and password' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role,
            location: location || 'Default'
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // Always true for SameSite: 'none'
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        checkJWTConfig();
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // Always true for SameSite: 'none'
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
exports.refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }

        const accessToken = generateAccessToken(user);
        res.status(200).json({ success: true, accessToken });
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Token expired or invalid' });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    res.status(200).json({ success: true, data: req.user });
};

// Helper to generate access token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
    });
};

// Helper to generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    });
};
