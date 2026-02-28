const Service = require('../models/Service');
const Agent = require('../models/Agent');

// @desc    Add service
// @route   POST /api/services/add
exports.addService = async (req, res) => {
    try {
        const { title, description, price, category, agentId, availableTime, location, locationName, latitude, longitude, requiresAppointment, image } = req.body;

        if (!title || !price) {
            return res.status(400).json({ success: false, error: 'Title and price are required' });
        }

        const service = await Service.create({
            title,
            description,
            price,
            category,
            agentId,
            availableTime,
            location,
            locationName,
            latitude,
            longitude,
            requiresAppointment,
            image: image || "https://via.placeholder.com/300"
        });

        res.status(201).json({ success: true, data: service });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all services
// @route   GET /api/services
exports.getServices = async (req, res) => {
    try {
        let query = {};

        // Filter by location name — matches old `location` OR new `locationName` field
        if (req.query.locationName) {
            const regex = new RegExp(req.query.locationName.trim(), 'i');
            query.$or = [
                { location: regex },
                { locationName: regex }
            ];
        }

        const services = await Service.find(query).populate('category').populate('agentId');
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get agent's services
// @route   GET /api/services/agent/:agentId
exports.getAgentServices = async (req, res) => {
    try {
        const services = await Service.find({ agentId: req.params.agentId }).populate('category');
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }

        // Ownership check
        const userRole = req.headers['x-user-role'];
        const agentIdHeader = req.headers['x-agent-id'];

        if (userRole !== 'Admin' && service.agentId?.toString() !== agentIdHeader) {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this service' });
        }

        await service.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('category').populate('agentId');
        if (!service) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
