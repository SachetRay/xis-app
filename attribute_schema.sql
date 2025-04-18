-- Create extension for UUID generation if using PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the main attributes table
CREATE TABLE attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_classification TEXT,
    attribute_name TEXT,          -- XDM name
    display_name TEXT,
    data_type TEXT,
    definition TEXT,
    latency TEXT,
    is_identity BOOLEAN,
    historical_data_enabled BOOLEAN,
    data_owner TEXT,
    data_steward TEXT,
    data_source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the values table for both sample and possible values
CREATE TABLE attribute_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attribute_id UUID REFERENCES attributes(id) ON DELETE CASCADE,
    value TEXT,
    is_sample BOOLEAN,           -- True for sample values, False for all possible values
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the XDM details table
CREATE TABLE xdm_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attribute_id UUID REFERENCES attributes(id) ON DELETE CASCADE,
    schema_name TEXT,
    schema_url TEXT,             -- URL to the schema
    field_group_name TEXT,
    field_group_url TEXT,        -- URL to the field group
    xdm_data_type TEXT,
    xdm_path TEXT,              -- Optional, as mentioned
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the AEP datasets table
CREATE TABLE attribute_datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attribute_id UUID REFERENCES attributes(id) ON DELETE CASCADE,
    dataset_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the lineage table
CREATE TABLE attribute_lineage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_attribute_id UUID REFERENCES attributes(id) ON DELETE CASCADE,
    target_attribute_id UUID REFERENCES attributes(id) ON DELETE CASCADE,
    relationship_type TEXT,       -- e.g., 'derives_from', 'transforms_to', 'depends_on'
    transformation_logic TEXT,    -- Description or actual transformation logic
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the lineage steps table
CREATE TABLE lineage_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lineage_id UUID REFERENCES attribute_lineage(id) ON DELETE CASCADE,
    step_order INTEGER,          -- Order of transformation steps
    step_type TEXT,              -- e.g., 'transformation', 'validation', 'enrichment'
    step_description TEXT,
    step_logic TEXT,             -- Specific logic/rules applied in this step
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the system touchpoints table
CREATE TABLE lineage_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lineage_id UUID REFERENCES attribute_lineage(id) ON DELETE CASCADE,
    system_name TEXT,            -- e.g., 'AEP', 'Data Lake', 'ETL System'
    system_role TEXT,            -- e.g., 'source', 'transformation', 'destination'
    system_order INTEGER,        -- Order in the lineage flow
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for commonly queried fields
CREATE INDEX idx_attributes_name ON attributes(attribute_name);
CREATE INDEX idx_attributes_display_name ON attributes(display_name);
CREATE INDEX idx_attribute_values_attribute_id ON attribute_values(attribute_id);
CREATE INDEX idx_xdm_details_attribute_id ON xdm_details(attribute_id);
CREATE INDEX idx_attribute_datasets_attribute_id ON attribute_datasets(attribute_id);
CREATE INDEX idx_attribute_lineage_source ON attribute_lineage(source_attribute_id);
CREATE INDEX idx_attribute_lineage_target ON attribute_lineage(target_attribute_id);
CREATE INDEX idx_lineage_steps_lineage_id ON lineage_steps(lineage_id);
CREATE INDEX idx_lineage_systems_lineage_id ON lineage_systems(lineage_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_attributes_updated_at
    BEFORE UPDATE ON attributes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_xdm_details_updated_at
    BEFORE UPDATE ON xdm_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attribute_lineage_updated_at
    BEFORE UPDATE ON attribute_lineage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lineage_steps_updated_at
    BEFORE UPDATE ON lineage_steps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lineage_systems_updated_at
    BEFORE UPDATE ON lineage_systems
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE attributes IS 'Stores core attribute information and metadata';
COMMENT ON TABLE attribute_values IS 'Stores sample and possible values for attributes';
COMMENT ON TABLE xdm_details IS 'Stores XDM-specific information for attributes';
COMMENT ON TABLE attribute_datasets IS 'Stores AEP dataset associations for attributes';
COMMENT ON TABLE attribute_lineage IS 'Stores relationships and transformations between attributes';
COMMENT ON TABLE lineage_steps IS 'Stores detailed steps in attribute transformations';
COMMENT ON TABLE lineage_systems IS 'Stores system touchpoints in attribute lineage'; 