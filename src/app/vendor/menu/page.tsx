'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
  Store, 
  ArrowLeft,
  Save, 
  Plus,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Scissors,
  Palette,
  Sparkles,
  Heart,
  Crown
} from 'lucide-react'

interface MenuItem {
  id: string
  category: string
  service: string
  duration: number
  price: number
  description?: string
  isActive: boolean
}

interface VendorApplication {
  id: string
  salon_name: string
  draft_data?: any
}

// Default menu template based on common nail salon services
const defaultMenuItems: Omit<MenuItem, 'id'>[] = [
  // Manicures
  { category: 'Manicures', service: 'Classic Manicure', duration: 45, price: 35, description: 'Traditional nail care with cuticle treatment and polish', isActive: true },
  { category: 'Manicures', service: 'Gel Manicure', duration: 60, price: 55, description: 'Long-lasting gel polish that stays chip-free for up to 3 weeks', isActive: true },
  { category: 'Manicures', service: 'French Manicure', duration: 50, price: 40, description: 'Classic white-tip French style manicure', isActive: true },
  { category: 'Manicures', service: 'Luxury Spa Manicure', duration: 75, price: 65, description: 'Premium manicure with hand massage and premium products', isActive: false },
  
  // Pedicures  
  { category: 'Pedicures', service: 'Classic Pedicure', duration: 60, price: 45, description: 'Relaxing foot treatment with exfoliation and polish', isActive: true },
  { category: 'Pedicures', service: 'Gel Pedicure', duration: 75, price: 65, description: 'Long-lasting gel polish pedicure with foot massage', isActive: true },
  { category: 'Pedicures', service: 'Luxury Spa Pedicure', duration: 90, price: 85, description: 'Ultimate pedicure experience with aromatherapy and premium foot massage', isActive: false },
  
  // Nail Art & Extensions
  { category: 'Nail Art', service: 'Simple Nail Art', duration: 30, price: 15, description: 'Basic designs and decorations per nail', isActive: true },
  { category: 'Nail Art', service: 'Complex Nail Art', duration: 60, price: 35, description: 'Detailed artistic designs and patterns', isActive: false },
  { category: 'Extensions', service: 'Acrylic Extensions', duration: 120, price: 75, description: 'Full set of acrylic nail extensions', isActive: false },
  { category: 'Extensions', service: 'Gel Extensions', duration: 120, price: 85, description: 'Natural-looking gel nail extensions', isActive: false },
  
  // Special Services
  { category: 'Special Services', service: 'Nail Repair', duration: 20, price: 10, description: 'Fix broken or damaged nails', isActive: true },
  { category: 'Special Services', service: 'Polish Change', duration: 20, price: 15, description: 'Quick polish removal and reapplication', isActive: true },
  { category: 'Special Services', service: 'Cuticle Treatment', duration: 15, price: 12, description: 'Specialized cuticle care and conditioning', isActive: true },
  
  // Add-ons
  { category: 'Add-ons', service: 'Hand Massage', duration: 10, price: 8, description: 'Relaxing hand and arm massage', isActive: true },
  { category: 'Add-ons', service: 'Paraffin Treatment', duration: 15, price: 12, description: 'Moisturizing paraffin wax treatment', isActive: false },
  { category: 'Add-ons', service: 'Callus Removal', duration: 15, price: 10, description: 'Professional callus removal service', isActive: true }
]

export default function VendorMenuPage() {
  const [application, setApplication] = useState<VendorApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  
  useEffect(() => {
    loadVendorData()
  }, [])

  const loadVendorData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      window.location.href = '/vendor/login'
      return
    }

    try {
      let { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error && session.user.email) {
        const { data: dataByEmail, error: emailError } = await supabase
          .from('vendor_applications')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (!emailError && dataByEmail) {
          await supabase
            .from('vendor_applications')
            .update({ user_id: session.user.id })
            .eq('id', dataByEmail.id)
          
          data = { ...dataByEmail, user_id: session.user.id }
        } else {
          throw emailError || error
        }
      } else if (error) {
        throw error
      }

      setApplication(data)
      
      // Load existing menu items or use default template
      if (data.draft_data?.menu_items && data.draft_data.menu_items.length > 0) {
        setMenuItems(data.draft_data.menu_items)
      } else {
        // Create default menu items with IDs
        const defaultItems = defaultMenuItems.map((item, index) => ({
          ...item,
          id: `default-${index}`
        }))
        setMenuItems(defaultItems)
      }
      
    } catch (error) {
      console.error('Error loading vendor data:', error)
      alert('Error loading your data. Please try refreshing the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!application) return

    setSaving(true)
    try {
      const updatedDraftData = {
        ...application.draft_data,
        menu_items: menuItems
      }

      const { error } = await supabase
        .from('vendor_applications')
        .update({ 
          draft_data: updatedDraftData,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id)

      if (error) throw error

      setApplication(prev => prev ? { ...prev, draft_data: updatedDraftData } : null)
      
      alert('Menu saved successfully!')
    } catch (error) {
      console.error('Error saving menu:', error)
      alert('Failed to save menu. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addMenuItem = (category?: string) => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      category: category || selectedCategory || '',
      service: '',
      duration: 30,
      price: 0,
      description: '',
      isActive: true
    }
    setMenuItems([...menuItems, newItem])
  }

  const updateMenuItem = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems(items => 
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const removeMenuItem = (id: string) => {
    setMenuItems(items => items.filter(item => item.id !== id))
  }

  const toggleItemActive = (id: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    )
  }

  const duplicateItem = (id: string) => {
    const itemToDuplicate = menuItems.find(item => item.id === id)
    if (itemToDuplicate) {
      const newItem = {
        ...itemToDuplicate,
        id: `item-${Date.now()}`,
        service: `${itemToDuplicate.service} (Copy)`
      }
      setMenuItems([...menuItems, newItem])
    }
  }

  const loadDefaultMenu = () => {
    if (confirm('This will replace your current menu with a default template. Are you sure?')) {
      const defaultItems = defaultMenuItems.map((item, index) => ({
        ...item,
        id: `default-${Date.now()}-${index}`
      }))
      setMenuItems(defaultItems)
    }
  }

  const exportMenu = () => {
    const dataStr = JSON.stringify(menuItems, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${application?.salon_name || 'salon'}-menu.json`
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Application Found</h2>
          <p className="text-gray-600 mb-4">You don't have a vendor application yet.</p>
          <a
            href="/vendor/register"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Submit Application
          </a>
        </div>
      </div>
    )
  }

  // Group menu items by category
  const categories = [...new Set(menuItems.map(item => item.category).filter(Boolean))]
  const activeItems = menuItems.filter(item => item.isActive && item.price > 0)
  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = menuItems.filter(item => item.category === category)
    return acc
  }, {} as Record<string, MenuItem[]>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <a 
                href="/vendor/dashboard"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadDefaultMenu}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                <span>Load Template</span>
              </button>
              <button
                onClick={exportMenu}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                <span>Export Menu</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Menu'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu & Services</h1>
          <p className="text-gray-600">
            Manage your salon's services and pricing. Only services with prices above $0 will appear on your public page.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Scissors className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
                <p className="text-gray-600">Total Services</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{activeItems.length}</p>
                <p className="text-gray-600">Active Services</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Palette className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                <p className="text-gray-600">Categories</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${activeItems.length > 0 ? Math.min(...activeItems.map(item => item.price)).toFixed(0) : '0'}
                </p>
                <p className="text-gray-600">Starting From</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Filter */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === '' 
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Services ({menuItems.length})
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category 
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category} ({groupedItems[category]?.length || 0})
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => addMenuItem()}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {(selectedCategory ? groupedItems[selectedCategory] || [] : menuItems).map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                    item.isActive ? 'border-green-500' : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateMenuItem(item.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="e.g., Manicures"
                        />
                      </div>

                      {/* Service Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                        <input
                          type="text"
                          value={item.service}
                          onChange={(e) => updateMenuItem(item.id, 'service', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="e.g., Gel Manicure"
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                        <input
                          type="number"
                          value={item.duration}
                          onChange={(e) => updateMenuItem(item.id, 'duration', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          min="0"
                          step="15"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateMenuItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleItemActive(item.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.isActive 
                            ? 'text-green-600 hover:bg-green-100' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={item.isActive ? 'Hide from public menu' : 'Show on public menu'}
                      >
                        {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => duplicateItem(item.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Duplicate service"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => removeMenuItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => updateMenuItem(item.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Brief description of the service..."
                    />
                  </div>

                  {/* Status indicators */}
                  <div className="flex items-center space-x-4 mt-3 text-xs">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                      item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Hidden'}
                    </span>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                      item.price > 0 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.price > 0 ? 'Priced' : 'No price'}
                    </span>
                    
                    {item.price > 0 && item.isActive && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Will show on public page
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {menuItems.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <Scissors className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No services added yet</h3>
                  <p className="text-gray-600 mb-6">Start building your service menu to attract customers</p>
                  <div className="space-x-3">
                    <button
                      onClick={() => addMenuItem()}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Service</span>
                    </button>
                    <button
                      onClick={loadDefaultMenu}
                      className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Load Template</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}