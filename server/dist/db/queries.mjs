import pool from '../config/db.js';
export const getAttributes = async () => {
    const result = await pool.query('SELECT * FROM attributes ORDER BY attribute_name');
    return result.rows;
};
export const getAttributeValues = async (attributeId) => {
    const result = await pool.query('SELECT * FROM attribute_values WHERE attribute_id = $1', [attributeId]);
    return result.rows;
};
export const getXDMDetails = async (attributeId) => {
    const result = await pool.query('SELECT * FROM xdm_details WHERE attribute_id = $1', [attributeId]);
    return result.rows;
};
export const getAttributeDatasets = async (attributeId) => {
    const result = await pool.query('SELECT * FROM attribute_datasets WHERE attribute_id = $1', [attributeId]);
    return result.rows;
};
export const getAttributeLineage = async (attributeId) => {
    const result = await pool.query('SELECT * FROM attribute_lineage WHERE source_attribute_id = $1 OR target_attribute_id = $1', [attributeId]);
    return result.rows;
};
export const getLineageSteps = async (lineageId) => {
    const result = await pool.query('SELECT * FROM lineage_steps WHERE lineage_id = $1 ORDER BY step_order', [lineageId]);
    return result.rows;
};
export const getLineageSystems = async (lineageId) => {
    const result = await pool.query('SELECT * FROM lineage_systems WHERE lineage_id = $1 ORDER BY system_order', [lineageId]);
    return result.rows;
};
// Get complete attribute tree with all related data
export const getAttributeTree = async () => {
    // Get all attributes
    const attributes = await getAttributes();
    // Initialize the tree with root level attributes (those without parents)
    const rootAttributes = attributes.filter(attr => !attr.parent_id);
    // Helper function to build the tree recursively
    const buildTree = async (attribute) => {
        const node = {
            ...attribute,
            children: [],
            values: await getAttributeValues(attribute.id),
            xdmDetails: await getXDMDetails(attribute.id),
            datasets: await getAttributeDatasets(attribute.id),
            lineage: await getAttributeLineage(attribute.id)
        };
        // Get child attributes
        const childAttributes = attributes.filter(attr => attr.parent_id === attribute.id);
        // Recursively build children
        for (const child of childAttributes) {
            const childNode = await buildTree(child);
            node.children.push(childNode);
        }
        return node;
    };
    // Build the complete tree
    const tree = await Promise.all(rootAttributes.map(buildTree));
    return tree;
};
