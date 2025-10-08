#!/usr/bin/env node
/**
 * Populate Services Script
 * This script loads the comprehensive service catalog into the database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function populateServices() {
  try {
    console.log('🚀 Starting service catalog population...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'INSERT_COMPREHENSIVE_SERVICES.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split SQL commands (basic splitting - might need refinement)
    const sqlCommands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--') && cmd !== 'COMMIT');
    
    console.log(`📋 Found ${sqlCommands.length} SQL commands to execute`);
    
    // Execute each command
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      if (command.length < 10) continue; // Skip very short commands
      
      console.log(`⏳ Executing command ${i + 1}/${sqlCommands.length}...`);
      
      try {
        const { error } = await supabase.rpc('execute_sql', { 
          sql_query: command 
        });
        
        if (error) {
          console.error(`❌ Error in command ${i + 1}:`, error);
          // Continue with other commands unless it's a critical error
          if (error.message?.includes('does not exist')) {
            console.log('⚠️  Skipping command due to missing table - might be expected');
            continue;
          }
        } else {
          console.log(`✅ Command ${i + 1} completed successfully`);
        }
      } catch (cmdError) {
        console.error(`❌ Exception in command ${i + 1}:`, cmdError);
      }
    }
    
    // Verify the data was inserted
    console.log('\n📊 Verifying data insertion...');
    
    const { data: categories, error: catError } = await supabase
      .from('service_categories')
      .select('*')
      .order('sort_order');
    
    if (catError) {
      console.error('❌ Error fetching categories:', catError);
    } else {
      console.log(`✅ Service Categories inserted: ${categories?.length || 0}`);
    }
    
    const { data: services, error: servError } = await supabase
      .from('service_types')
      .select('*');
    
    if (servError) {
      console.error('❌ Error fetching service types:', servError);
    } else {
      console.log(`✅ Service Types inserted: ${services?.length || 0}`);
    }
    
    // Show some sample data
    if (categories?.length > 0) {
      console.log('\n📋 Sample categories:');
      categories.slice(0, 5).forEach(cat => {
        console.log(`  • ${cat.name} (${cat.slug})`);
      });
    }
    
    if (services?.length > 0) {
      console.log('\n💅 Sample services:');
      services.slice(0, 10).forEach(service => {
        console.log(`  • ${service.name} - ${service.duration_minutes}min - $${service.price_range_low}-${service.price_range_high}`);
      });
    }
    
    console.log('\n🎉 Service catalog population completed!');
    
  } catch (error) {
    console.error('❌ Failed to populate services:', error);
    process.exit(1);
  }
}

// Alternative direct insertion method if SQL execution fails
async function populateServicesDirectly() {
  console.log('🔄 Attempting direct insertion method...');
  
  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await supabase.from('salon_services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('service_types').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('service_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Insert categories first
    const categories = [
      { name: 'Manicure', slug: 'manicure', description: 'Professional nail care and polish services for hands', icon: 'nail-polish', sort_order: 1 },
      { name: 'Pedicure', slug: 'pedicure', description: 'Professional nail care and polish services for feet', icon: 'foot', sort_order: 2 },
      { name: 'Acrylic Nails', slug: 'acrylic-nails', description: 'Artificial nail extensions using acrylic powder and liquid', icon: 'extensions', sort_order: 3 },
      { name: 'Gel Extensions', slug: 'gel-extensions', description: 'Nail extensions using gel-based products', icon: 'gel', sort_order: 4 },
      { name: 'Dip Powder Nails', slug: 'dip-powder-nails', description: 'Long-lasting nail treatment using colored powder', icon: 'powder', sort_order: 5 },
      { name: 'Builder Gel', slug: 'builder-gel', description: 'Strengthening gel overlay for natural or extended nails', icon: 'builder', sort_order: 6 },
      { name: 'Gel X', slug: 'gel-x', description: 'Pre-formed soft gel nail extensions', icon: 'gel-x', sort_order: 7 },
      { name: 'Nail Maintenance', slug: 'nail-maintenance', description: 'Repair and removal services', icon: 'tools', sort_order: 8 },
      { name: 'Nail Art & Finish', slug: 'nail-art-finish', description: 'Decorative designs and finishing touches', icon: 'art', sort_order: 9 },
      { name: 'Hand & Foot Treatments', slug: 'hand-foot-treatments', description: 'Spa treatments for hands and feet', icon: 'spa', sort_order: 10 },
      { name: 'Massage', slug: 'massage', description: 'Relaxing massage services', icon: 'massage', sort_order: 11 },
      { name: 'Facials', slug: 'facials', description: 'Professional facial treatments', icon: 'face', sort_order: 12 },
      { name: 'Eyelash Extensions', slug: 'eyelash-extensions', description: 'Individual eyelash extension services', icon: 'eyelash', sort_order: 13 },
      { name: 'Lash Treatments', slug: 'lash-treatments', description: 'Eyelash enhancement treatments', icon: 'lash-lift', sort_order: 14 },
      { name: 'Brow Treatments', slug: 'brow-treatments', description: 'Eyebrow shaping and enhancement', icon: 'eyebrow', sort_order: 15 },
      { name: 'Waxing', slug: 'waxing', description: 'Hair removal services using wax', icon: 'wax', sort_order: 16 },
      { name: 'Add-Ons & Extras', slug: 'add-ons-extras', description: 'Additional services and upgrades', icon: 'plus', sort_order: 17 },
      { name: 'Hair Services', slug: 'hair-services', description: 'Professional hair cutting and styling', icon: 'hair', sort_order: 18 }
    ];
    
    console.log('📝 Inserting service categories...');
    const { data: insertedCategories, error: catInsertError } = await supabase
      .from('service_categories')
      .insert(categories)
      .select();
    
    if (catInsertError) {
      console.error('❌ Error inserting categories:', catInsertError);
      return;
    }
    
    console.log(`✅ Inserted ${insertedCategories.length} categories`);
    
    // Now insert some key service types
    const manicureCatId = insertedCategories.find(c => c.slug === 'manicure')?.id;
    const pedicureCatId = insertedCategories.find(c => c.slug === 'pedicure')?.id;
    const acrylicCatId = insertedCategories.find(c => c.slug === 'acrylic-nails')?.id;
    const gelCatId = insertedCategories.find(c => c.slug === 'gel-extensions')?.id;
    
    const serviceTypes = [
      { category_id: manicureCatId, name: 'Classic Manicure', slug: 'classic-manicure', description: 'Traditional nail care with cuticle care, shaping, and polish', duration_minutes: 30, price_range_low: 20.00, price_range_high: 40.00, specialization_level: 'basic', trend_status: 'stable', filtering_priority: 'high', keywords: ['classic', 'basic', 'traditional', 'polish'] },
      { category_id: manicureCatId, name: 'Gel Manicure', slug: 'gel-manicure', description: 'Long-lasting gel polish that cures under UV light', duration_minutes: 45, price_range_low: 35.00, price_range_high: 60.00, specialization_level: 'standard', trend_status: 'growing', filtering_priority: 'high', keywords: ['gel', 'long-lasting', 'uv', 'durable'] },
      { category_id: pedicureCatId, name: 'Classic Pedicure', slug: 'classic-pedicure', description: 'Traditional foot care with nail shaping, cuticle care, and polish', duration_minutes: 45, price_range_low: 25.00, price_range_high: 45.00, specialization_level: 'basic', trend_status: 'stable', filtering_priority: 'high', keywords: ['classic', 'foot-care', 'traditional', 'polish'] },
      { category_id: acrylicCatId, name: 'Acrylic Full Set', slug: 'acrylic-full-set', description: 'Complete set of acrylic nail extensions', duration_minutes: 60, price_range_low: 35.00, price_range_high: 70.00, specialization_level: 'standard', trend_status: 'stable', filtering_priority: 'high', keywords: ['acrylic', 'full-set', 'extensions', 'artificial'] },
      { category_id: gelCatId, name: 'Gel Extension Full Set', slug: 'gel-extension-full-set', description: 'Complete set of gel nail extensions', duration_minutes: 60, price_range_low: 40.00, price_range_high: 75.00, specialization_level: 'standard', trend_status: 'growing', filtering_priority: 'high', keywords: ['gel', 'extensions', 'full-set', 'natural'] }
    ];
    
    console.log('💅 Inserting service types...');
    const { data: insertedServices, error: servInsertError } = await supabase
      .from('service_types')
      .insert(serviceTypes)
      .select();
    
    if (servInsertError) {
      console.error('❌ Error inserting service types:', servInsertError);
      return;
    }
    
    console.log(`✅ Inserted ${insertedServices.length} service types`);
    console.log('🎉 Basic service catalog populated successfully!');
    
  } catch (error) {
    console.error('❌ Error in direct insertion:', error);
  }
}

// Run the script
if (require.main === module) {
  populateServices().catch(error => {
    console.error('❌ SQL method failed, trying direct insertion...');
    populateServicesDirectly();
  });
}

module.exports = { populateServices, populateServicesDirectly };