#!/usr/bin/env python3
"""
Run the schema migration to fix database structure
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def run_migration():
    print("=" * 80)
    print("🚀 RUNNING SCHEMA MIGRATION")
    print("=" * 80)
    
    # Read migration file
    print("\n📂 Reading migration file...")
    with open('migrations/001_fix_schema_for_integration.sql', 'r') as f:
        sql_content = f.read()
    
    # Split into individual statements (rough split by semicolon)
    statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip() and not stmt.strip().startswith('--')]
    
    print(f"✅ Found {len(statements)} SQL statements to execute")
    print("\n⚠️  IMPORTANT: This migration should be run in Supabase SQL Editor")
    print("   Reason: Complex SQL with functions and procedures")
    print("\n📋 Instructions:")
    print("   1. Go to: https://supabase.com/dashboard/project/bmlvjgulciphdqyqucxv/sql/new")
    print("   2. Copy the contents of: migrations/001_fix_schema_for_integration.sql")
    print("   3. Paste into SQL Editor")
    print("   4. Click 'Run' button")
    print("\n" + "=" * 80)
    print("✅ Migration file ready at: migrations/001_fix_schema_for_integration.sql")
    print("=" * 80)

if __name__ == "__main__":
    run_migration()
