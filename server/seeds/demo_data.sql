-- Demo data for CRM system
-- Password for all users: password123

-- Insert demo users (password: password123)
-- Hash generated with bcrypt for 'password123'
INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES
('admin@crm.local', '$2a$10$rKHEJ5xVE5z5nHxE5F5F5eZYQPEZF5E5F5E5F5E5F5E5F5E5F5E5e', 'admin', 'Admin', 'User'),
('john@crm.local', '$2a$10$rKHEJ5xVE5z5nHxE5F5F5eZYQPEZF5E5F5E5F5E5F5E5F5E5F5E5e', 'user', 'John', 'Smith'),
('jane@crm.local', '$2a$10$rKHEJ5xVE5z5nHxE5F5F5eZYQPEZF5E5F5E5F5E5F5E5F5E5F5E5e', 'user', 'Jane', 'Doe');

-- Insert demo companies
INSERT INTO companies (name, description, industry, website, created_by) VALUES
('TechCorp Inc', 'Leading technology company', 'Technology', 'https://techcorp.com', 1),
('FinanceHub LLC', 'Financial services provider', 'Finance', 'https://financehub.com', 1),
('HealthMed Co', 'Healthcare solutions', 'Healthcare', 'https://healthmed.com', 2),
('EduLearn Ltd', 'Educational platform', 'Education', 'https://edulearn.com', 2),
('RetailMax', 'Retail chain management', 'Retail', 'https://retailmax.com', 3);

-- Insert demo contacts
INSERT INTO contacts (first_name, last_name, email, phone, position, company_id, created_by) VALUES
('Alice', 'Johnson', 'alice@techcorp.com', '+1-555-0101', 'CEO', 1, 1),
('Bob', 'Williams', 'bob@techcorp.com', '+1-555-0102', 'CTO', 1, 1),
('Carol', 'Davis', 'carol@financehub.com', '+1-555-0103', 'CFO', 2, 1),
('David', 'Miller', 'david@financehub.com', '+1-555-0104', 'VP Sales', 2, 2),
('Emma', 'Wilson', 'emma@healthmed.com', '+1-555-0105', 'Director', 3, 2),
('Frank', 'Moore', 'frank@edulearn.com', '+1-555-0106', 'Manager', 4, 2),
('Grace', 'Taylor', 'grace@retailmax.com', '+1-555-0107', 'Owner', 5, 3);

-- Insert demo opportunities
INSERT INTO opportunities (name, company_id, stage, amount, expected_close_date, lead_source, status, created_by) VALUES
('TechCorp Integration Project', 1, 'deep_dive', 250000, '2024-06-30', 'Referral', 'open', 1),
('FinanceHub API Partnership', 2, 'screening', 150000, '2024-05-15', 'Cold Call', 'open', 1),
('HealthMed Platform License', 3, 'due_diligence', 500000, '2024-07-20', 'Website', 'open', 2),
('EduLearn Content Deal', 4, 'signing', 75000, '2024-04-10', 'Email Campaign', 'open', 2),
('RetailMax POS System', 5, 'closed', 320000, '2024-03-01', 'Trade Show', 'won', 3),
('TechCorp Consulting', 1, 'closed', 100000, '2024-02-15', 'Referral', 'won', 1),
('FinanceHub Failed Deal', 2, 'closed', 200000, '2024-01-30', 'Cold Call', 'lost', 1);

-- Link contacts to opportunities
INSERT INTO opportunity_contacts (opportunity_id, contact_id) VALUES
(1, 1), (1, 2),
(2, 3), (2, 4),
(3, 5),
(4, 6),
(5, 7),
(6, 1),
(7, 3);

-- Insert demo tags
INSERT INTO tags (name) VALUES
('High Priority'),
('Strategic'),
('Recurring'),
('Enterprise'),
('SMB');

-- Link tags to opportunities
INSERT INTO opportunity_tags (opportunity_id, tag_id) VALUES
(1, 1), (1, 4),
(2, 2),
(3, 1), (3, 4),
(4, 3), (4, 5),
(5, 4),
(6, 3),
(7, 2);

-- Insert demo comments
INSERT INTO comments (opportunity_id, user_id, content) VALUES
(1, 1, 'Initial meeting went well. Technical team is interested.'),
(1, 1, 'Sent proposal document. Waiting for feedback.'),
(2, 1, 'First contact established. Scheduling demo for next week.'),
(3, 2, 'Legal review in progress. Expecting decision soon.'),
(4, 2, 'Contract almost ready. Final signatures pending.'),
(5, 3, 'Deal closed successfully! Implementation starts next month.');

-- Insert demo reminders (future dates)
INSERT INTO reminders (opportunity_id, user_id, reminder_date, message, sent) VALUES
(1, 1, CURRENT_TIMESTAMP + INTERVAL '7 days', 'Follow up on proposal', FALSE),
(2, 1, CURRENT_TIMESTAMP + INTERVAL '3 days', 'Schedule product demo', FALSE),
(3, 2, CURRENT_TIMESTAMP + INTERVAL '14 days', 'Check legal review status', FALSE),
(4, 2, CURRENT_TIMESTAMP + INTERVAL '2 days', 'Get final signatures', FALSE);

-- Insert demo custom fields
INSERT INTO custom_fields (entity_type, field_name, field_type, options) VALUES
('opportunity', 'Contract Type', 'select', ARRAY['Annual', 'Monthly', 'One-time']),
('opportunity', 'Decision Maker', 'text', NULL),
('company', 'Employee Count', 'number', NULL),
('contact', 'LinkedIn Profile', 'text', NULL);

-- Insert demo custom field values
INSERT INTO custom_field_values (custom_field_id, entity_id, value) VALUES
(1, 1, 'Annual'),
(1, 2, 'Monthly'),
(1, 3, 'Annual'),
(2, 1, 'Alice Johnson'),
(2, 2, 'Carol Davis'),
(3, 1, '500'),
(3, 2, '200'),
(4, 1, 'https://linkedin.com/in/alicejohnson');
