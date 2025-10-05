'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, Tag, ArrowRight, Search, TrendingUp } from 'lucide-react'
import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import { useTranslation } from '../../contexts/TranslationContext'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  tags: string[]
  image: string
  readTime: number
  featured: boolean
}

export default function BlogPage() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Ultimate Guide to Nail Care: Tips for Healthy, Beautiful Nails',
      excerpt: 'Discover professional secrets for maintaining healthy nails between salon visits. From proper filing techniques to cuticle care, learn everything you need to know.',
      content: 'Full blog content here...',
      author: 'Sarah Mitchell',
      date: '2025-01-15',
      category: 'nail-care',
      tags: ['nail health', 'DIY', 'maintenance'],
      image: 'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121',
      readTime: 5,
      featured: true
    },
    {
      id: '2',
      title: 'Top 10 Nail Art Trends for 2025: What\'s Hot This Year',
      excerpt: 'Stay ahead of the curve with the latest nail art trends. From minimalist designs to bold statement nails, explore what\'s trending in nail fashion.',
      content: 'Full blog content here...',
      author: 'Emma Rodriguez',
      date: '2025-01-12',
      category: 'trends',
      tags: ['nail art', 'trends', '2025', 'fashion'],
      image: 'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8',
      readTime: 7,
      featured: true
    },
    {
      id: '3',
      title: 'Gel vs. Regular Polish: Which Is Right for You?',
      excerpt: 'Compare the pros and cons of gel and regular nail polish. Learn about durability, application process, and cost to make the best choice for your lifestyle.',
      content: 'Full blog content here...',
      author: 'Jessica Chen',
      date: '2025-01-10',
      category: 'education',
      tags: ['gel nails', 'polish', 'comparison'],
      image: 'https://page.gensparksite.com/v1/base64_upload/fd5b1d89ee755b0b188cab2569983b82',
      readTime: 4,
      featured: false
    },
    {
      id: '4',
      title: 'How to Choose the Perfect Nail Salon: A Complete Checklist',
      excerpt: 'Find the ideal nail salon with our comprehensive guide. Learn what to look for in hygiene standards, services, and customer reviews.',
      content: 'Full blog content here...',
      author: 'Amanda Taylor',
      date: '2025-01-08',
      category: 'tips',
      tags: ['salon selection', 'hygiene', 'reviews'],
      image: 'https://page.gensparksite.com/v1/base64_upload/a523c8b6623589eb5a6f0ff95c026121',
      readTime: 6,
      featured: false
    },
    {
      id: '5',
      title: 'DIY Manicure at Home: Professional Results Without the Salon',
      excerpt: 'Master the art of at-home manicures with step-by-step instructions. Save money while achieving salon-quality results in your own space.',
      content: 'Full blog content here...',
      author: 'Michelle Park',
      date: '2025-01-05',
      category: 'diy',
      tags: ['DIY', 'manicure', 'tutorial'],
      image: 'https://page.gensparksite.com/v1/base64_upload/f0d79c3ccca1056b496e94f623f0a9f8',
      readTime: 8,
      featured: false
    },
    {
      id: '6',
      title: 'Nail Health 101: Signs Your Nails Need Professional Attention',
      excerpt: 'Learn to identify common nail problems and when to seek professional help. Understand the difference between cosmetic issues and health concerns.',
      content: 'Full blog content here...',
      author: 'Dr. Lisa Wang',
      date: '2025-01-03',
      category: 'health',
      tags: ['nail health', 'medical', 'symptoms'],
      image: 'https://page.gensparksite.com/v1/base64_upload/fd5b1d89ee755b0b188cab2569983b82',
      readTime: 5,
      featured: false
    }
  ]

  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    { id: 'nail-care', name: 'Nail Care', count: blogPosts.filter(p => p.category === 'nail-care').length },
    { id: 'trends', name: 'Trends', count: blogPosts.filter(p => p.category === 'trends').length },
    { id: 'education', name: 'Education', count: blogPosts.filter(p => p.category === 'education').length },
    { id: 'tips', name: 'Tips', count: blogPosts.filter(p => p.category === 'tips').length },
    { id: 'diy', name: 'DIY', count: blogPosts.filter(p => p.category === 'diy').length },
    { id: 'health', name: 'Health', count: blogPosts.filter(p => p.category === 'health').length }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const featuredPosts = blogPosts.filter(post => post.featured)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Nail Nav Blog
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-8">
              Your ultimate resource for nail care tips, trends, and professional insights
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="text-sm opacity-60">({category.count})</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Featured Posts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Featured Posts</h3>
              </div>
              <div className="space-y-4">
                {featuredPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="group cursor-pointer">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                      {post.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all' ? 'All Posts' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-gray-500">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </span>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-shadow group cursor-pointer"
                >
                  {/* Post Image */}
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    {/* Category & Read Time */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                      <span>{post.readTime} min read</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>

                    {/* Read More */}
                    <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* No Results */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}