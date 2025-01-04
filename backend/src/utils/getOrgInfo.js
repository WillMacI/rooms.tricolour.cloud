// backend/src/utils/getOrgInfo.js
const Organization = require('../models/Organization');

/**
 * Get organization by UUID
 * @param {string} uuid - The UUID of the organization
 * @returns {Promise<Object>} - The organization data
 */
const getOrganizationByUuid = async (uuid) => {
    try {
        const organization = await Organization.findOne({ where: { uuid } });
        if (!organization) {
            return null;
        }
        return organization;
    } catch (error) {
        return null;
    }
};

/**
 * Get organization by Slug
 * @param {string} slug - The Slug of the organization
 * @returns {Promise<Object>} - The organization data
 */
const getOrganizationBySlug = async (slug) => {
    try {
        const organization = await Organization.findOne({ where: { slug: slug } });
        if (!organization) {
            return null;
        }
        return organization;
    } catch (error) {
        return null;
    }
};

/**
 * Get all organizations
 * @returns {Promise<Array>} - List of all organizations
 */
const getAllOrganizations = async () => {
    try {
        const organizations = await Organization.findAll();
        return organizations;
    } catch (error) {
        return null;
    }
};

/**
 * Get organization settings for users by uuid
 * @param {string} uuid - The UUID of the organization
 * @returns {Promise<Array>} - The organization settings
 */
const getOrganizationSettingsByUuid = async (uuid) => {
    try {
        const organization = await Organization.findOne({where: {uuid}});
        if (!organization) {
            return null;
        }
        return organization.settings;
    } catch (error) {
        return null;
    }
}
module.exports = {
    getOrganizationByUuid,
    getAllOrganizations,
    getOrganizationSettingsByUuid,
    getOrganizationBySlug
};