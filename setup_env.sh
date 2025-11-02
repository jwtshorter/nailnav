#!/bin/bash
# Setup environment file for Supabase connection

echo "==========================================="
echo "🔧 SUPABASE ENVIRONMENT SETUP"
echo "==========================================="
echo ""
echo "This script will help you create .env.local with your Supabase credentials."
echo ""
echo "You can find these values at:"
echo "https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api"
echo ""
echo "Based on your README, your Supabase project is: ddenulleuvyhwqsulrod"
echo "URL: https://ddenulleuvyhwqsulrod.supabase.co/dashboard/project/YOUR_PROJECT/settings/api"
echo ""
read -p "Do you want to enter Supabase credentials now? (y/n): " answer

if [ "$answer" != "y" ]; then
    echo ""
    echo "❌ Setup cancelled. Please create .env.local manually with:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    echo ""
    exit 1
fi

echo ""
read -p "Enter SUPABASE_URL (e.g., https://ddenulleuvyhwqsulrod.supabase.co): " SUPABASE_URL
read -p "Enter SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
read -p "Enter SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_KEY

# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY

# Google Maps API (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=https://nailnav.com
NEXT_PUBLIC_APP_NAME=NailNav
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,es,vi
EOF

echo ""
echo "✅ Created .env.local file successfully!"
echo ""
echo "You can now run the import script:"
echo "python3 import_real_salons.py"
echo ""
