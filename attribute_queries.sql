-- 1. Basic Attribute Queries

-- Get all attributes with their basic information
SELECT 
    a.id,
    a.attribute_name,
    a.display_name,
    a.data_type,
    a.definition,
    a.data_classification,
    a.latency,
    a.is_identity,
    a.historical_data_enabled,
    a.data_owner,
    a.data_steward,
    a.data_source
FROM attributes a
ORDER BY a.attribute_name;

-- Get attributes by classification
SELECT *
FROM attributes
WHERE data_classification = 'PII'  -- Replace with desired classification
ORDER BY attribute_name;

-- Get attributes by data owner
SELECT *
FROM attributes
WHERE data_owner = 'John Doe'  -- Replace with desired owner
ORDER BY attribute_name;

-- 2. Values Queries

-- Get all values (both sample and possible) for an attribute
SELECT 
    av.value,
    CASE WHEN av.is_sample THEN 'Sample' ELSE 'Possible' END as value_type
FROM attribute_values av
JOIN attributes a ON av.attribute_id = a.id
WHERE a.attribute_name = 'email'  -- Replace with desired attribute name
ORDER BY av.is_sample DESC, av.value;

-- Get only sample values for an attribute
SELECT value
FROM attribute_values av
JOIN attributes a ON av.attribute_id = a.id
WHERE a.attribute_name = 'email'  -- Replace with desired attribute name
AND av.is_sample = true
ORDER BY value;

-- 3. XDM Details Queries

-- Get XDM details for an attribute
SELECT 
    a.attribute_name,
    xd.schema_name,
    xd.schema_url,
    xd.field_group_name,
    xd.field_group_url,
    xd.xdm_data_type,
    xd.xdm_path
FROM xdm_details xd
JOIN attributes a ON xd.attribute_id = a.id
WHERE a.attribute_name = 'email';  -- Replace with desired attribute name

-- Get all attributes in a specific XDM schema
SELECT 
    a.attribute_name,
    a.display_name,
    xd.field_group_name,
    xd.xdm_data_type
FROM xdm_details xd
JOIN attributes a ON xd.attribute_id = a.id
WHERE xd.schema_name = 'Profile'  -- Replace with desired schema name
ORDER BY a.attribute_name;

-- 4. Dataset Queries

-- Get all datasets for an attribute
SELECT 
    a.attribute_name,
    ad.dataset_name
FROM attribute_datasets ad
JOIN attributes a ON ad.attribute_id = a.id
WHERE a.attribute_name = 'email'  -- Replace with desired attribute name
ORDER BY ad.dataset_name;

-- Get all attributes in a specific dataset
SELECT 
    a.attribute_name,
    a.display_name,
    a.data_type
FROM attribute_datasets ad
JOIN attributes a ON ad.attribute_id = a.id
WHERE ad.dataset_name = 'Profile Dataset'  -- Replace with desired dataset name
ORDER BY a.attribute_name;

-- 5. Lineage Queries

-- Get direct dependencies for an attribute
SELECT 
    source.attribute_name as source_attribute,
    target.attribute_name as target_attribute,
    al.relationship_type,
    al.transformation_logic
FROM attribute_lineage al
JOIN attributes source ON al.source_attribute_id = source.id
JOIN attributes target ON al.target_attribute_id = target.id
WHERE target.attribute_name = 'email'  -- Replace with desired attribute name
ORDER BY source.attribute_name;

-- Get complete transformation path for an attribute (recursive)
WITH RECURSIVE lineage_path AS (
    -- Base case: direct dependencies
    SELECT 
        source_attribute_id,
        target_attribute_id,
        ARRAY[source_attribute_id] as path,
        1 as depth
    FROM attribute_lineage
    WHERE target_attribute_id = (
        SELECT id FROM attributes WHERE attribute_name = 'email'  -- Replace with desired attribute name
    )
    
    UNION ALL
    
    -- Recursive case: upstream dependencies
    SELECT 
        al.source_attribute_id,
        al.target_attribute_id,
        path || al.source_attribute_id,
        lp.depth + 1
    FROM attribute_lineage al
    JOIN lineage_path lp ON al.target_attribute_id = lp.source_attribute_id
    WHERE NOT al.source_attribute_id = ANY(path)
)
SELECT 
    a.attribute_name,
    lp.depth
FROM lineage_path lp
JOIN attributes a ON lp.source_attribute_id = a.id
ORDER BY lp.depth, a.attribute_name;

-- Get transformation steps for a lineage relationship
SELECT 
    ls.step_order,
    ls.step_type,
    ls.step_description,
    ls.step_logic
FROM lineage_steps ls
JOIN attribute_lineage al ON ls.lineage_id = al.id
JOIN attributes source ON al.source_attribute_id = source.id
JOIN attributes target ON al.target_attribute_id = target.id
WHERE source.attribute_name = 'source_attribute'  -- Replace with desired source attribute
AND target.attribute_name = 'target_attribute'    -- Replace with desired target attribute
ORDER BY ls.step_order;

-- Get system touchpoints for a lineage relationship
SELECT 
    ls.system_name,
    ls.system_role,
    ls.system_order
FROM lineage_systems ls
JOIN attribute_lineage al ON ls.lineage_id = al.id
JOIN attributes source ON al.source_attribute_id = source.id
JOIN attributes target ON al.target_attribute_id = target.id
WHERE source.attribute_name = 'source_attribute'  -- Replace with desired source attribute
AND target.attribute_name = 'target_attribute'    -- Replace with desired target attribute
ORDER BY ls.system_order;

-- 6. Combined Information Queries

-- Get complete attribute information including values, XDM details, and datasets
SELECT 
    a.attribute_name,
    a.display_name,
    a.data_type,
    a.definition,
    xd.schema_name,
    xd.field_group_name,
    xd.xdm_data_type,
    (
        SELECT string_agg(value, ', ')
        FROM attribute_values av
        WHERE av.attribute_id = a.id
        AND av.is_sample = true
    ) as sample_values,
    (
        SELECT string_agg(dataset_name, ', ')
        FROM attribute_datasets ad
        WHERE ad.attribute_id = a.id
    ) as datasets
FROM attributes a
LEFT JOIN xdm_details xd ON a.id = xd.attribute_id
WHERE a.attribute_name = 'email'  -- Replace with desired attribute name;

-- 7. Search Queries

-- Search attributes by name or definition
SELECT 
    a.attribute_name,
    a.display_name,
    a.definition,
    a.data_type
FROM attributes a
WHERE 
    a.attribute_name ILIKE '%email%' OR
    a.display_name ILIKE '%email%' OR
    a.definition ILIKE '%email%'
ORDER BY a.attribute_name;

-- Search attributes by value
SELECT DISTINCT
    a.attribute_name,
    a.display_name,
    av.value
FROM attributes a
JOIN attribute_values av ON a.id = av.attribute_id
WHERE av.value ILIKE '%example%'  -- Replace with desired search term
ORDER BY a.attribute_name, av.value; 