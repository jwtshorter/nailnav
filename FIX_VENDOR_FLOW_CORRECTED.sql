-- =====================================================
-- FIX VENDOR FLOW - CORRECTED VERSION
-- =====================================================

-- First, let's check what status values currently exist
SELECT 'CURRENT STATUS VALUES:' as info;
SELECT DISTINCT status FROM vendor_applications;

-- Update the status column to use simple text instead of enum
ALTER TABLE vendor_applications 
ALTER COLUMN status TYPE VARCHAR(50);

-- Update existing applications to use new status system
UPDATE vendor_applications 
SET status = CASE 
    WHEN status = 'pending' THEN 'submitted'
    WHEN status = 'approved' THEN 'approved' 
    WHEN status = 'rejected' THEN 'rejected'
    ELSE 'draft'
END;

-- Set default status for new applications
ALTER TABLE vendor_applications 
ALTER COLUMN status SET DEFAULT 'draft';

-- Create simple admin access table
CREATE TABLE IF NOT EXISTS admin_access (
    id SERIAL PRIMARY KEY,
    access_key VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_used TIMESTAMP
);

-- Insert simple admin access key
INSERT INTO admin_access (access_key, description) 
VALUES ('admin2024', 'Simple admin access for vendor review')
ON CONFLICT (access_key) DO NOTHING;

-- Create listings table for existing businesses (for claiming)
CREATE TABLE IF NOT EXISTS existing_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    phone VARCHAR(20),
    website TEXT,
    is_claimed BOOLEAN DEFAULT false,
    claimed_by UUID REFERENCES auth.users(id),
    claimed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add some sample listings for testing claiming functionality
INSERT INTO existing_listings (business_name, address, city, state, postal_code) VALUES
('Nail Palace', '123 Main St', 'Los Angeles', 'CA', '90210'),
('Perfect Nails Spa', '456 Oak Ave', 'Beverly Hills', 'CA', '90211'),
('Elite Nail Studio', '789 Pine Rd', 'Santa Monica', 'CA', '90401'),
('Glamour Nails', '321 Elm St', 'West Hollywood', 'CA', '90069'),
('Luxury Nail Bar', '654 Maple Dr', 'Culver City', 'CA', '90232')
ON CONFLICT DO NOTHING;

-- Update RLS to allow all access for now (fix admin issues)
ALTER TABLE vendor_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE existing_listings DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON existing_listings TO authenticated;
GRANT ALL ON admin_access TO authenticated;

-- Check updated applications
SELECT 'UPDATED VENDOR APPLICATIONS:' as info;
SELECT 
    salon_name,
    owner_name,
    email,
    status,
    created_at,
    CASE 
        WHEN status = 'draft' THEN '📝 Working on details'
        WHEN status = 'submitted' THEN '📋 Ready for review'
        WHEN status = 'under_review' THEN '👀 Being reviewed'
        WHEN status = 'approved' THEN '✅ Approved & Live'
        WHEN status = 'rejected' THEN '❌ Needs changes'
        ELSE status
    END as status_description
FROM vendor_applications
ORDER BY created_at DESC;

-- Show existing listings available for claiming
SELECT 'EXISTING LISTINGS AVAILABLE FOR CLAIMING:' as info;
SELECT 
    business_name,
    address,
    city || ', ' || state as location,
    is_claimed,
    CASE WHEN is_claimed THEN 'Already claimed' ELSE 'Available' END as claim_status
FROM existing_listings
ORDER BY city, business_name;

SELECT 'Setup complete! New flow: Register → Auto-redirect to claim/create choice' as result;