#!/usr/bin/env node
/**
 * Simple Service Population Script
 * Uses the anon key to insert basic service data
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function populateBasicServices() {
  try {
    console.log('🚀 Starting basic service catalog population...');
    
    // Check if we already have categories
    const { data: existingCategories, error: checkError } = await supabase
      .from('service_categories')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Error checking existing data:', checkError);
      return;
    }
    
    if (existingCategories && existingCategories.length > 0) {
      console.log('ℹ️  Service categories already exist. Checking service types...');
    } else {
      // Insert categories
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
        if (catInsertError.message?.includes('duplicate key')) {
          console.log('ℹ️  Categories might already exist. Fetching existing ones...');
        } else {
          return;
        }
      } else {
        console.log(`✅ Inserted ${insertedCategories.length} categories`);
      }
    }
    
    // Get all categories for service type insertion
    const { data: allCategories, error: fetchCatError } = await supabase
      .from('service_categories')
      .select('*')
      .order('sort_order');
    
    if (fetchCatError) {
      console.error('❌ Error fetching categories:', fetchCatError);
      return;
    }
    
    console.log(`📋 Found ${allCategories.length} categories`);
    
    // Create a mapping of category slugs to IDs
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });
    
    // Check existing service types
    const { data: existingServices, error: checkServError } = await supabase
      .from('service_types')
      .select('*')
      .limit(5);
    
    if (checkServError) {
      console.error('❌ Error checking existing services:', checkServError);
      return;
    }
    
    if (existingServices && existingServices.length > 0) {
      console.log(`ℹ️  Found ${existingServices.length} existing service types`);
      console.log('Service types might already be populated');
    } else {
      // Insert key service types
      const serviceTypes = [
        // Manicure Services
        { category_id: categoryMap['manicure'], name: 'Classic Manicure', slug: 'classic-manicure', description: 'Traditional nail care with cuticle care, shaping, and polish', duration_minutes: 30, price_range_low: 20.00, price_range_high: 40.00, specialization_level: 'basic', trend_status: 'stable', filtering_priority: 'high', keywords: ['classic', 'basic', 'traditional', 'polish'] },
        { category_id: categoryMap['manicure'], name: 'Deluxe Manicure', slug: 'deluxe-manicure', description: 'Enhanced manicure with additional treatments and premium polish', duration_minutes: 45, price_range_low: 30.00, price_range_high: 55.00, specialization_level: 'standard', trend_status: 'stable', filtering_priority: 'high', keywords: ['deluxe', 'premium', 'enhanced', 'luxury'] },
        { category_id: categoryMap['manicure'], name: 'Gel Manicure', slug: 'gel-manicure', description: 'Long-lasting gel polish that cures under UV light', duration_minutes: 45, price_range_low: 35.00, price_range_high: 60.00, specialization_level: 'standard', trend_status: 'growing', filtering_priority: 'high', keywords: ['gel', 'long-lasting', 'uv', 'durable'] },
        { category_id: categoryMap['manicure'], name: 'French Manicure', slug: 'french-manicure', description: 'Classic white tip design with natural or pink base', duration_minutes: 45, price_range_low: 25.00, price_range_high: 50.00, specialization_level: 'standard', trend_status: 'stable', filtering_priority: 'medium', keywords: ['french', 'white-tip', 'classic', 'elegant'] },
        
        // Pedicure Services
        { category_id: categoryMap['pedicure'], name: 'Classic Pedicure', slug: 'classic-pedicure', description: 'Traditional foot care with nail shaping, cuticle care, and polish', duration_minutes: 45, price_range_low: 25.00, price_range_high: 45.00, specialization_level: 'basic', trend_status: 'stable', filtering_priority: 'high', keywords: ['classic', 'foot-care', 'traditional', 'polish'] },
        { category_id: categoryMap['pedicure'], name: 'Deluxe Pedicure', slug: 'deluxe-pedicure', description: 'Enhanced pedicure with exfoliation, mask, and massage', duration_minutes: 60, price_range_low: 35.00, price_range_high: 60.00, specialization_level: 'standard', trend_status: 'stable', filtering_priority: 'high', keywords: ['deluxe', 'exfoliation', 'mask', 'massage'] },
        { category_id: categoryMap['pedicure'], name: 'Spa Pedicure', slug: 'spa-pedicure', description: 'Luxurious pedicure with premium treatments and relaxation', duration_minutes: 60, price_range_low: 45.00, price_range_high: 75.00, specialization_level: 'standard', trend_status: 'growing', filtering_priority: 'high', keywords: ['spa', 'luxury', 'relaxation', 'premium'] },
        
        // Acrylic Nails
        { category_id: categoryMap['acrylic-nails'], name: 'Acrylic Full Set', slug: 'acrylic-full-set', description: 'Complete set of acrylic nail extensions', duration_minutes: 60, price_range_low: 35.00, price_range_high: 70.00, specialization_level: 'standard', trend_status: 'stable', filtering_priority: 'high', keywords: ['acrylic', 'full-set', 'extensions', 'artificial'] },
        { category_id: categoryMap['acrylic-nails'], name: 'Acrylic Fill', slug: 'acrylic-fill', description: 'Maintenance fill for existing acrylic nails', duration_minutes: 45, price_range_low: 25.00, price_range_high: 50.00, specialization_level: 'basic', trend_status: 'stable', filtering_priority: 'high', keywords: ['acrylic', 'fill', 'maintenance', 'touch-up'] },
        
        // Gel Extensions
        { category_id: categoryMap['gel-extensions'], name: 'Gel Extension Full Set', slug: 'gel-extension-full-set', description: 'Complete set of gel nail extensions', duration_minutes: 60, price_range_low: 40.00, price_range_high: 75.00, specialization_level: 'standard', trend_status: 'growing', filtering_priority: 'high', keywords: ['gel', 'extensions', 'full-set', 'natural'] },
        { category_id: categoryMap['gel-extensions'], name: 'Gel Extension Fill', slug: 'gel-extension-fill', description: 'Maintenance fill for existing gel extensions', duration_minutes: 45, price_range_low: 30.00, price_range_high: 55.00, specialization_level: 'basic', trend_status: 'growing', filtering_priority: 'high', keywords: ['gel', 'fill', 'maintenance', 'extensions'] },
        
        // Dip Powder
        { category_id: categoryMap['dip-powder-nails'], name: 'Dip Powder Full Set', slug: 'dip-powder-full-set', description: 'Complete dip powder manicure for long-lasting color', duration_minutes: 60, price_range_low: 35.00, price_range_high: 65.00, specialization_level: 'standard', trend_status: 'trending', filtering_priority: 'high', keywords: ['dip-powder', 'full-set', 'long-lasting', 'color'] },
        { category_id: categoryMap['dip-powder-nails'], name: 'Dip Powder Fill', slug: 'dip-powder-fill', description: 'Maintenance fill for existing dip powder nails', duration_minutes: 45, price_range_low: 25.00, price_range_high: 50.00, specialization_level: 'basic', trend_status: 'trending', filtering_priority: 'high', keywords: ['dip-powder', 'fill', 'maintenance', 'touch-up'] },
        
        // Eyelash Extensions
        { category_id: categoryMap['eyelash-extensions'], name: 'Classic Lash Extensions', slug: 'classic-lash-extensions', description: 'One extension per natural lash for subtle enhancement', duration_minutes: 90, price_range_low: 80.00, price_range_high: 150.00, specialization_level: 'standard', trend_status: 'growing', filtering_priority: 'high', keywords: ['lash-extensions', 'classic', 'subtle', 'natural'] },
        { category_id: categoryMap['eyelash-extensions'], name: 'Volume Lash Extensions', slug: 'volume-lash-extensions', description: 'Multiple lightweight lashes per natural lash', duration_minutes: 120, price_range_low: 120.00, price_range_high: 220.00, specialization_level: 'advanced', trend_status: 'trending', filtering_priority: 'high', keywords: ['lash-extensions', 'volume', 'dramatic', 'fullness'] },
        
        // Basic Services
        { category_id: categoryMap['nail-maintenance'], name: 'Nail Repair', slug: 'nail-repair', description: 'Fix broken or damaged nails', duration_minutes: 20, price_range_low: 5.00, price_range_high: 15.00, specialization_level: 'basic', trend_status: 'stable', filtering_priority: 'medium', keywords: ['repair', 'fix', 'broken', 'damaged'] },
        { category_id: categoryMap['nail-maintenance'], name: 'Nail Removal', slug: 'nail-removal', description: 'Safe removal of artificial nails', duration_minutes: 20, price_range_low: 10.00, price_range_high: 25.00, specialization_level: 'basic', trend_status: 'stable', filtering_priority: 'medium', keywords: ['removal', 'artificial', 'safe', 'clean'] },
        
        // Waxing
        { category_id: categoryMap['waxing'], name: 'Eyebrow Wax', slug: 'eyebrow-wax', description: 'Hair removal and shaping of eyebrow area', duration_minutes: 15, price_range_low: 8.00, price_range_high: 20.00, specialization_level: 'basic', trend_status: 'stable', filtering_priority: 'high', keywords: ['wax', 'eyebrow', 'hair-removal', 'shaping'] },
        { category_id: categoryMap['waxing'], name: 'Brazilian Wax', slug: 'brazilian-wax', description: 'Complete intimate area hair removal', duration_minutes: 45, price_range_low: 45.00, price_range_high: 85.00, specialization_level: 'standard', trend_status: 'stable', filtering_priority: 'medium', keywords: ['wax', 'brazilian', 'complete', 'intimate'] }
      ];
      
      console.log('💅 Inserting key service types...');
      const { data: insertedServices, error: servInsertError } = await supabase
        .from('service_types')
        .insert(serviceTypes)
        .select();
      
      if (servInsertError) {
        console.error('❌ Error inserting service types:', servInsertError);
        return;
      }
      
      console.log(`✅ Inserted ${insertedServices.length} service types`);
    }
    
    // Final verification
    console.log('\n📊 Final verification...');
    
    const { data: finalCategories, error: finalCatError } = await supabase
      .from('service_categories')
      .select('*')
      .order('sort_order');
    
    if (!finalCatError) {
      console.log(`✅ Total Service Categories: ${finalCategories?.length || 0}`);
    }
    
    const { data: finalServices, error: finalServError } = await supabase
      .from('service_types')
      .select('*');
    
    if (!finalServError) {
      console.log(`✅ Total Service Types: ${finalServices?.length || 0}`);
    }
    
    // Show sample data
    if (finalServices?.length > 0) {
      console.log('\n💅 Sample services available:');
      finalServices.slice(0, 8).forEach(service => {
        const duration = service.duration_minutes ? `${service.duration_minutes}min` : 'Custom';
        console.log(`  • ${service.name} - ${duration} - $${service.price_range_low}-${service.price_range_high}`);
      });
    }
    
    console.log('\n🎉 Service catalog population completed successfully!');
    console.log('📝 You can now use these services in your NailNav platform');
    
  } catch (error) {
    console.error('❌ Failed to populate services:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  populateBasicServices();
}

module.exports = { populateBasicServices };