const Org = require('../models/Organization');
const bcrypt = require('bcrypt');

// Create a new org
const createOrg = async (req, res) => {
    try {
        const user = await Org.create(req.body);

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all orgs
const getAllOrgs = async (req, res) => {
    try {
        const users = await Org.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a org by UUID
const getOrgByUUID = async (req, res) => {
    try {
        const user = await Org.findByPk(req.params.uuid);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a org by UUID
const updateOrgByUUID = async (req, res) => {
    try {
        const [updated] = await Org.update(req.body, {
            where: { uuid: req.params.uuid },
        });
        if (!updated) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a org by UUID
const deleteOrgByUUID = async (req, res) => {
    try {
        const deleted = await Org.destroy({
            where: { uuid: req.params.uuid },
        });
        if (!deleted) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrgBySlug = async (req, res) => {
    try {
        const org = await Org.findOne({
            where: { slug: req.params.slug },
            attributes: ['uuid', 'name', 'logo_path', 'primary_color', 'settings'] // Specify the fields to include

        });
        if (!org) return res.status(404).json({ error: 'Org not found' });
        res.status(200).json(org);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getOrgBySlug,
    createOrg,
    getAllOrgs,
    updateOrgByUUID,
    deleteOrgByUUID,
    getOrgByUUID
};
