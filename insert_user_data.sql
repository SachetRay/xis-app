-- Insert main attribute folders
INSERT INTO attributes (attribute_name, display_name, data_type, definition, data_classification, is_identity, historical_data_enabled, data_owner, data_steward, data_source)
VALUES
    ('person', 'Person Information', 'folder', 'Personal information about the user', 'PII', false, true, 'Data Team', 'John Smith', 'User Profile'),
    ('homeAddress', 'Home Address', 'folder', 'User''s home address information', 'PII', false, true, 'Data Team', 'Sarah Chen', 'User Profile'),
    ('personalEmail', 'Personal Email', 'folder', 'User''s email information', 'PII', true, true, 'Data Team', 'Mike Johnson', 'User Profile'),
    ('adobeCorpnew', 'Adobe Corporate', 'folder', 'Adobe corporate information', 'Internal', false, true, 'Data Team', 'Priya Shanmugan', 'Adobe Systems');

-- Insert person attributes
INSERT INTO attributes (attribute_name, display_name, data_type, definition, data_classification, is_identity, historical_data_enabled, data_owner, data_steward, data_source)
VALUES
    ('firstname', 'First Name', 'string', 'User''s first name', 'PII', true, true, 'Data Team', 'John Smith', 'User Profile'),
    ('lastname', 'Last Name', 'string', 'User''s last name', 'PII', true, true, 'Data Team', 'John Smith', 'User Profile'),
    ('countryCode', 'Country Code', 'string', 'User''s country code', 'PII', false, true, 'Data Team', 'Sarah Chen', 'User Profile'),
    ('email_address', 'Email Address', 'string', 'User''s email address', 'PII', true, true, 'Data Team', 'Mike Johnson', 'User Profile');

-- Insert Adobe Corp attributes
INSERT INTO attributes (attribute_name, display_name, data_type, definition, data_classification, is_identity, historical_data_enabled, data_owner, data_steward, data_source)
VALUES
    ('isAdobeEmployee', 'Is Adobe Employee', 'boolean', 'Indicates if the user is an Adobe employee', 'Internal', false, true, 'Data Team', 'Priya Shanmugan', 'Adobe Systems'),
    ('emailDomain', 'Email Domain', 'string', 'User''s email domain', 'PII', false, true, 'Data Team', 'Mike Johnson', 'User Profile'),
    ('emailValidFlag', 'Email Valid Flag', 'boolean', 'Indicates if the email is valid', 'Internal', false, true, 'Data Team', 'Mike Johnson', 'Email Validation'),
    ('hashedEmail', 'Hashed Email', 'string', 'Hashed version of email for security', 'Security', true, true, 'Security Team', 'Mike Johnson', 'Security System');

-- Insert sample values
INSERT INTO attribute_values (attribute_id, value, is_sample)
SELECT id, 'John', true FROM attributes WHERE attribute_name = 'firstname'
UNION ALL
SELECT id, 'Jane', true FROM attributes WHERE attribute_name = 'firstname'
UNION ALL
SELECT id, 'Doe', true FROM attributes WHERE attribute_name = 'lastname'
UNION ALL
SELECT id, 'Smith', true FROM attributes WHERE attribute_name = 'lastname'
UNION ALL
SELECT id, 'US', true FROM attributes WHERE attribute_name = 'countryCode'
UNION ALL
SELECT id, 'UK', true FROM attributes WHERE attribute_name = 'countryCode'
UNION ALL
SELECT id, 'john.doe@gmail.com', true FROM attributes WHERE attribute_name = 'email_address'
UNION ALL
SELECT id, 'YES', true FROM attributes WHERE attribute_name = 'isAdobeEmployee'
UNION ALL
SELECT id, 'NO', true FROM attributes WHERE attribute_name = 'isAdobeEmployee'
UNION ALL
SELECT id, 'adobe.com', true FROM attributes WHERE attribute_name = 'emailDomain'
UNION ALL
SELECT id, 'gmail.com', true FROM attributes WHERE attribute_name = 'emailDomain';

-- Insert XDM details
INSERT INTO xdm_details (attribute_id, schema_name, schema_url, field_group_name, field_group_url, xdm_data_type)
SELECT id, 'Profile Schema', 'https://ns.adobe.com/xdm/profile', 'Person Core', 'https://ns.adobe.com/xdm/context/person', 'String'
FROM attributes WHERE attribute_name IN ('firstname', 'lastname')
UNION ALL
SELECT id, 'Profile Schema', 'https://ns.adobe.com/xdm/profile', 'Email Core', 'https://ns.adobe.com/xdm/context/email', 'String'
FROM attributes WHERE attribute_name IN ('email_address', 'emailDomain')
UNION ALL
SELECT id, 'Profile Schema', 'https://ns.adobe.com/xdm/profile', 'Adobe Corporate', 'https://ns.adobe.com/xdm/context/corporate', 'Boolean'
FROM attributes WHERE attribute_name = 'isAdobeEmployee';

-- Insert lineage relationships
INSERT INTO attribute_lineage (source_attribute_id, target_attribute_id, relationship_type, transformation_logic)
SELECT s.id, t.id, 'derives_from', 'Extract domain from email address'
FROM attributes s, attributes t
WHERE s.attribute_name = 'email_address' AND t.attribute_name = 'emailDomain';

-- Insert lineage steps
INSERT INTO lineage_steps (lineage_id, step_order, step_type, step_description, step_logic)
SELECT l.id, 1, 'transformation', 'Extract domain from email', 'Split email address by @ and take second part'
FROM attribute_lineage l
JOIN attributes s ON l.source_attribute_id = s.id
JOIN attributes t ON l.target_attribute_id = t.id
WHERE s.attribute_name = 'email_address' AND t.attribute_name = 'emailDomain';

-- Insert system touchpoints
INSERT INTO lineage_systems (lineage_id, system_name, system_role, system_order)
SELECT l.id, 'Email Processing System', 'source', 1
FROM attribute_lineage l
JOIN attributes s ON l.source_attribute_id = s.id
JOIN attributes t ON l.target_attribute_id = t.id
WHERE s.attribute_name = 'email_address' AND t.attribute_name = 'emailDomain'; 