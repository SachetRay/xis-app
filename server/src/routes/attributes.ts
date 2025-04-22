import express from 'express';
import { getAttributeTree, getAttributes, getAttributeValues, getXDMDetails, getAttributeDatasets, getAttributeLineage, getLineageSteps, getLineageSystems } from '../db/queries';

const router = express.Router();

// Get the complete attribute tree
router.get('/tree', async (req, res) => {
  try {
    const tree = await getAttributeTree();
    res.json(tree);
  } catch (error) {
    console.error('Error fetching attribute tree:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all attributes
router.get('/', async (req, res) => {
  try {
    const attributes = await getAttributes();
    res.json(attributes);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get attribute values
router.get('/:id/values', async (req, res) => {
  try {
    const values = await getAttributeValues(req.params.id);
    res.json(values);
  } catch (error) {
    console.error('Error fetching attribute values:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get XDM details
router.get('/:id/xdm', async (req, res) => {
  try {
    const xdmDetails = await getXDMDetails(req.params.id);
    res.json(xdmDetails);
  } catch (error) {
    console.error('Error fetching XDM details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get attribute datasets
router.get('/:id/datasets', async (req, res) => {
  try {
    const datasets = await getAttributeDatasets(req.params.id);
    res.json(datasets);
  } catch (error) {
    console.error('Error fetching attribute datasets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get attribute lineage
router.get('/:id/lineage', async (req, res) => {
  try {
    const lineage = await getAttributeLineage(req.params.id);
    res.json(lineage);
  } catch (error) {
    console.error('Error fetching attribute lineage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lineage steps
router.get('/lineage/:id/steps', async (req, res) => {
  try {
    const steps = await getLineageSteps(req.params.id);
    res.json(steps);
  } catch (error) {
    console.error('Error fetching lineage steps:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lineage systems
router.get('/lineage/:id/systems', async (req, res) => {
  try {
    const systems = await getLineageSystems(req.params.id);
    res.json(systems);
  } catch (error) {
    console.error('Error fetching lineage systems:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 