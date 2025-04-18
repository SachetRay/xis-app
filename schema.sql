-- Create extension for UUID generation if using PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the main table to store JSON data
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_account_guid VARCHAR(255) NOT NULL,  -- Extracted from JSON for indexing
    email VARCHAR(255),                         -- Extracted from JSON for indexing
    first_name VARCHAR(255),                    -- Extracted from JSON for indexing
    last_name VARCHAR(255),                     -- Extracted from JSON for indexing
    is_adobe_employee BOOLEAN,                  -- Extracted from JSON for indexing
    profile_data JSONB NOT NULL,               -- Store complete JSON document
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_member_guid UNIQUE (member_account_guid)
);

-- Create indexes for commonly queried fields
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_member_guid ON user_profiles(member_account_guid);
CREATE INDEX idx_user_profiles_names ON user_profiles(first_name, last_name);
CREATE INDEX idx_user_profiles_adobe_employee ON user_profiles(is_adobe_employee);

-- Create GIN index for JSON content searching
CREATE INDEX idx_user_profiles_jsonb ON user_profiles USING GIN (profile_data);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for basic profile information
CREATE VIEW user_profiles_basic_info AS
SELECT 
    id,
    member_account_guid,
    email,
    first_name,
    last_name,
    is_adobe_employee,
    created_at,
    updated_at
FROM user_profiles;

-- Comments for documentation
COMMENT ON TABLE user_profiles IS 'Stores user profile data including personal information, entitlements, and usage data';
COMMENT ON COLUMN user_profiles.profile_data IS 'Complete JSON document containing all user profile information';
COMMENT ON COLUMN user_profiles.member_account_guid IS 'Unique identifier for the member account';
COMMENT ON INDEX idx_user_profiles_jsonb IS 'GIN index for efficient JSON content searching'; 