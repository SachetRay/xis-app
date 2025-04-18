-- Insert additional folder attributes for better organization
INSERT INTO attributes (attribute_name, display_name, data_type, definition, data_classification, is_identity, historical_data_enabled, data_owner, data_steward, data_source)
VALUES
    ('memberAccountGUID', 'Member Account GUID', 'folder', 'Member account identification and details', 'Security', true, true, 'Identity Team', 'Sarah Chen', 'Identity System'),
    ('modelsAndScores', 'Models and Scores', 'folder', 'User modeling and scoring information', 'Analytics', false, true, 'Data Science Team', 'Mike Johnson', 'Scoring System'),
    ('appUsage', 'Application Usage', 'folder', 'Application usage tracking and metrics', 'Analytics', false, true, 'Analytics Team', 'Priya Shanmugan', 'Usage Tracking'),
    ('entitlements', 'Entitlements', 'folder', 'User product entitlements and licenses', 'Product', false, true, 'Product Team', 'John Smith', 'License System');

-- Insert attribute details for models and scores
INSERT INTO attributes (attribute_name, display_name, data_type, definition, data_classification, is_identity, historical_data_enabled, data_owner, data_steward, data_source)
VALUES
    ('modelScore', 'Model Score', 'number', 'Numerical score from predictive model', 'Analytics', false, true, 'Data Science Team', 'Mike Johnson', 'Scoring System'),
    ('modelPercentileScore', 'Model Percentile', 'string', 'Percentile ranking of the model score', 'Analytics', false, true, 'Data Science Team', 'Mike Johnson', 'Scoring System'),
    ('modelUserSegment', 'User Segment', 'string', 'Assigned user segment based on model', 'Analytics', false, true, 'Data Science Team', 'Mike Johnson', 'Scoring System'),
    ('firstActivityDate', 'First Activity Date', 'datetime', 'Date of first user activity', 'Analytics', false, true, 'Analytics Team', 'Priya Shanmugan', 'Usage Tracking'),
    ('recentActivityDate', 'Recent Activity Date', 'datetime', 'Date of most recent user activity', 'Analytics', false, true, 'Analytics Team', 'Priya Shanmugan', 'Usage Tracking'),
    ('numberOfEntitledProducts', 'Entitled Products Count', 'number', 'Number of products user is entitled to', 'Product', false, true, 'Product Team', 'John Smith', 'License System');

-- Insert sample values for new attributes
INSERT INTO attribute_values (attribute_id, value, is_sample)
SELECT id, '80', true FROM attributes WHERE attribute_name = 'modelScore'
UNION ALL
SELECT id, '95', true FROM attributes WHERE attribute_name = 'modelScore'
UNION ALL
SELECT id, '75th', true FROM attributes WHERE attribute_name = 'modelPercentileScore'
UNION ALL
SELECT id, '90th', true FROM attributes WHERE attribute_name = 'modelPercentileScore'
UNION ALL
SELECT id, 'High Value', true FROM attributes WHERE attribute_name = 'modelUserSegment'
UNION ALL
SELECT id, 'At Risk', true FROM attributes WHERE attribute_name = 'modelUserSegment'
UNION ALL
SELECT id, '2024-01-15T10:00:00Z', true FROM attributes WHERE attribute_name = 'firstActivityDate'
UNION ALL
SELECT id, '2024-08-15T14:30:00Z', true FROM attributes WHERE attribute_name = 'recentActivityDate'
UNION ALL
SELECT id, '3', true FROM attributes WHERE attribute_name = 'numberOfEntitledProducts'
UNION ALL
SELECT id, '5', true FROM attributes WHERE attribute_name = 'numberOfEntitledProducts';

-- Insert XDM schema details
INSERT INTO xdm_details (attribute_id, schema_name, schema_url, field_group_name, field_group_url, xdm_data_type, xdm_path)
SELECT id, 'Experience Event Schema', 'https://ns.adobe.com/xdm/context/experienceevent', 'Time-series Events', 'https://ns.adobe.com/xdm/context/time-series', 'DateTime', '/timestamp'
FROM attributes WHERE attribute_name IN ('firstActivityDate', 'recentActivityDate')
UNION ALL
SELECT id, 'Profile Schema', 'https://ns.adobe.com/xdm/context/profile', 'Scoring', 'https://ns.adobe.com/xdm/context/scoring', 'Double', '/scores/modelScore'
FROM attributes WHERE attribute_name = 'modelScore'
UNION ALL
SELECT id, 'Profile Schema', 'https://ns.adobe.com/xdm/context/profile', 'Segmentation', 'https://ns.adobe.com/xdm/context/segmentation', 'String', '/segments/value'
FROM attributes WHERE attribute_name = 'modelUserSegment'
UNION ALL
SELECT id, 'Profile Schema', 'https://ns.adobe.com/xdm/context/profile', 'Entitlements', 'https://ns.adobe.com/xdm/context/entitlements', 'Integer', '/entitlements/count'
FROM attributes WHERE attribute_name = 'numberOfEntitledProducts';

-- Insert more complex lineage relationships
INSERT INTO attribute_lineage (source_attribute_id, target_attribute_id, relationship_type, transformation_logic)
SELECT s.id, t.id, 'computes', 'Calculate percentile from raw score'
FROM attributes s, attributes t
WHERE s.attribute_name = 'modelScore' AND t.attribute_name = 'modelPercentileScore'
UNION ALL
SELECT s.id, t.id, 'determines', 'Assign segment based on percentile score'
FROM attributes s, attributes t
WHERE s.attribute_name = 'modelPercentileScore' AND t.attribute_name = 'modelUserSegment';

-- Insert detailed transformation steps
INSERT INTO lineage_steps (lineage_id, step_order, step_type, step_description, step_logic)
SELECT l.id, 1, 'calculation', 'Calculate raw model score', 'Apply predictive model algorithm'
FROM attribute_lineage l
JOIN attributes s ON l.source_attribute_id = s.id
JOIN attributes t ON l.target_attribute_id = t.id
WHERE s.attribute_name = 'modelScore' AND t.attribute_name = 'modelPercentileScore'
UNION ALL
SELECT l.id, 2, 'transformation', 'Convert to percentile', 'Compare against population distribution'
FROM attribute_lineage l
JOIN attributes s ON l.source_attribute_id = s.id
JOIN attributes t ON l.target_attribute_id = t.id
WHERE s.attribute_name = 'modelScore' AND t.attribute_name = 'modelPercentileScore'
UNION ALL
SELECT l.id, 1, 'rule_based', 'Apply segmentation rules', 'Map percentile ranges to segments'
FROM attribute_lineage l
JOIN attributes s ON l.source_attribute_id = s.id
JOIN attributes t ON l.target_attribute_id = t.id
WHERE s.attribute_name = 'modelPercentileScore' AND t.attribute_name = 'modelUserSegment';

-- Insert system touchpoints for the scoring pipeline
INSERT INTO lineage_systems (lineage_id, system_name, system_role, system_order)
SELECT l.id, 'Scoring Engine', 'source', 1
FROM attribute_lineage l
JOIN attributes s ON l.source_attribute_id = s.id
JOIN attributes t ON l.target_attribute_id = t.id
WHERE s.attribute_name = 'modelScore' AND t.attribute_name = 'modelPercentileScore'
UNION ALL
SELECT l.id, 'Analytics Processing', 'transformation', 2
FROM attribute_lineage l
JOIN attributes s ON l.source_attribute_id = s.id
JOIN attributes t ON l.target_attribute_id = t.id
WHERE s.attribute_name = 'modelScore' AND t.attribute_name = 'modelPercentileScore'
UNION ALL
SELECT l.id, 'Segmentation Engine', 'destination', 3
FROM attribute_lineage l
JOIN attributes s ON l.source_attribute_id = s.id
JOIN attributes t ON l.target_attribute_id = t.id
WHERE s.attribute_name = 'modelPercentileScore' AND t.attribute_name = 'modelUserSegment';

-- Insert dataset associations
INSERT INTO attribute_datasets (attribute_id, dataset_name)
SELECT id, 'User Scoring Dataset'
FROM attributes 
WHERE attribute_name IN ('modelScore', 'modelPercentileScore', 'modelUserSegment')
UNION ALL
SELECT id, 'Usage Analytics Dataset'
FROM attributes 
WHERE attribute_name IN ('firstActivityDate', 'recentActivityDate')
UNION ALL
SELECT id, 'Entitlements Dataset'
FROM attributes 
WHERE attribute_name = 'numberOfEntitledProducts'; 