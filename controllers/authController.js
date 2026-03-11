const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    console.log('Register Request Body:', req.body);
    try {
        const { name, email, password, phone, role, location } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please add an email and password' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User with this email or phone already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role,
            location: location || 'Default'
        });

        // Log in the user after registration
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Login after registration failed' });
            }
            res.status(201).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone
                }
            });
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Server Error' });
        }
        if (!user) {
            return res.status(401).json({ success: false, error: info.message || 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Login session failed' });
            }
            return res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone
                }
            });
        });
    })(req, res, next);
};

// @desc    Logout user
// @route   GET /api/auth/logout
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Logout failed' });
        }
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ success: true, data: req.user });
    } else {
        res.status(401).json({ success: false, error: 'Not authenticated' });
    }
};
