'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Tag, Clock, Share2 } from 'lucide-react'
import Navigation from '@/components/mobile-first/Navigation'
import Footer from '@/components/mobile-first/Footer'
import { useTranslation } from '../../../contexts/TranslationContext'

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

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  const blogPosts: Record<string, BlogPost> = {
    '1': {
      id: '1',
      title: 'The Ultimate Guide to Nail Care: Tips for Healthy, Beautiful Nails',
      excerpt: 'Discover professional secrets for maintaining healthy nails between salon visits. From proper filing techniques to cuticle care, learn everything you need to know.',
      content: `
        <div class="prose max-w-none">
          <h2>Introduction to Nail Care</h2>
          <p>Healthy nails are not just about appearance—they're a reflection of your overall health and hygiene. Whether you're preparing for a special occasion or maintaining your everyday look, proper nail care is essential for keeping your nails strong, beautiful, and healthy.</p>
          
          <h2>Essential Daily Nail Care Routine</h2>
          <p>A consistent daily routine is the foundation of healthy nails. Here's what you should be doing every day:</p>
          <ul>
            <li><strong>Keep nails clean and dry:</strong> Wash your hands regularly and thoroughly dry your nails to prevent bacterial and fungal infections.</li>
            <li><strong>Moisturize regularly:</strong> Apply hand cream and cuticle oil daily to keep the nail bed and surrounding skin healthy.</li>
            <li><strong>Protect your nails:</strong> Wear gloves when cleaning, gardening, or doing dishes to prevent damage and chemical exposure.</li>
          </ul>

          <h2>Proper Filing Techniques</h2>
          <p>Filing your nails correctly is crucial for preventing breaks and maintaining shape:</p>
          <ul>
            <li>Always file in one direction, from the outside edge toward the center</li>
            <li>Use a fine-grit file to prevent splitting</li>
            <li>File nails when they're dry, never when wet</li>
            <li>Round the corners slightly to prevent snagging</li>
          </ul>

          <h2>Cuticle Care</h2>
          <p>Healthy cuticles are essential for nail health. Here's how to care for them properly:</p>
          <ul>
            <li>Never cut your cuticles—push them back gently after softening with cuticle oil</li>
            <li>Apply cuticle oil daily, especially before bedtime</li>
            <li>Use a cuticle pusher, not your fingernails or teeth</li>
          </ul>

          <h2>Nutrition for Healthy Nails</h2>
          <p>What you eat affects your nail health. Include these nutrients in your diet:</p>
          <ul>
            <li><strong>Protein:</strong> Essential for nail growth and strength</li>
            <li><strong>Biotin:</strong> Helps strengthen nails and prevent brittleness</li>
            <li><strong>Iron:</strong> Prevents nail ridges and discoloration</li>
            <li><strong>Zinc:</strong> Supports nail growth and repair</li>
          </ul>

          <h2>Common Nail Problems and Solutions</h2>
          <p>Understanding common nail issues can help you address them quickly:</p>
          <ul>
            <li><strong>Brittle nails:</strong> Often caused by frequent water exposure or harsh chemicals</li>
            <li><strong>Hangnails:</strong> Usually result from dry cuticles or nail biting</li>
            <li><strong>White spots:</strong> Typically minor injuries to the nail bed</li>
            <li><strong>Ridges:</strong> Can indicate aging, injury, or nutritional deficiencies</li>
          </ul>

          <h2>Professional vs. At-Home Care</h2>
          <p>While regular at-home care is essential, professional treatments can provide additional benefits:</p>
          <ul>
            <li>Professional manicures every 2-4 weeks for maintenance</li>
            <li>Nail treatments for specific concerns like strengthening or hydration</li>
            <li>Regular nail health assessments by professionals</li>
          </ul>

          <h2>Conclusion</h2>
          <p>Healthy, beautiful nails are achievable with consistent care and the right techniques. Remember that nail health is a marathon, not a sprint—be patient and consistent with your routine, and you'll see improvement over time.</p>
        </div>
      `,
      author: 'Sarah Mitchell',
      date: '2025-01-15',
      category: 'nail-care',
      tags: ['nail health', 'DIY', 'maintenance'],
      image: 'https://cdn1.genspark.ai/user-upload-image/5_generated/5de0f390-7a30-4ecd-821b-9cf041783001',
      readTime: 5,
      featured: true
    },
    '2': {
      id: '2',
      title: 'Top 10 Nail Art Trends for 2025: What\'s Hot This Year',
      excerpt: 'Stay ahead of the curve with the latest nail art trends. From minimalist designs to bold statement nails, explore what\'s trending in nail fashion.',
      content: `
        <div class="prose max-w-none">
          <h2>The Year of Bold Expression</h2>
          <p>2025 is shaping up to be an exciting year for nail art, with trends ranging from minimalist elegance to maximalist creativity. Whether you're a nail art novice or a seasoned pro, there's a trend for everyone this year.</p>

          <h2>1. Minimalist Line Art</h2>
          <p>Clean, simple lines continue to dominate the nail art scene. Think geometric patterns, abstract faces, and delicate botanical illustrations. This trend is perfect for those who want something sophisticated yet eye-catching.</p>

          <h2>2. Chrome and Metallic Finishes</h2>
          <p>Mirror-like chrome nails and metallic finishes are having a major moment. Silver, gold, and rose gold are the most popular choices, creating a futuristic and glamorous look.</p>

          <h2>3. Mixed Textures</h2>
          <p>Combining different textures on the same nail or across different nails is trending big. Think matte and glossy combinations, or textured glitter paired with smooth finishes.</p>

          <h2>4. Negative Space Designs</h2>
          <p>These designs play with the natural nail color, leaving portions unpainted to create artistic patterns. It's a sophisticated way to showcase creativity while maintaining elegance.</p>

          <h2>5. 3D Elements</h2>
          <p>From tiny pearls to sculptural elements, 3D nail art is making nails into miniature works of art. This trend is perfect for special occasions and fashion-forward individuals.</p>

          <h2>6. Color Blocking</h2>
          <p>Bold, contrasting colors placed in geometric patterns create striking visual impact. This trend allows for endless creativity and personal expression.</p>

          <h2>7. Gradient and Ombre</h2>
          <p>Smooth color transitions remain popular, with sunset gradients and rainbow ombres leading the way. These designs create a soft, dreamy effect.</p>

          <h2>8. Micro French Tips</h2>
          <p>The classic French manicure gets a modern update with ultra-thin tips in various colors. This trend offers a fresh take on a timeless favorite.</p>

          <h2>9. Abstract Art</h2>
          <p>Freeform designs inspired by abstract paintings are gaining popularity. These unique patterns ensure no two manicures are exactly alike.</p>

          <h2>10. Seasonal Motifs</h2>
          <p>Nature-inspired designs that change with the seasons are trending. Think cherry blossoms in spring, tropical themes in summer, and cozy autumn leaves in fall.</p>

          <h2>Tips for Trying New Trends</h2>
          <ul>
            <li>Start with one accent nail if you're hesitant about bold designs</li>
            <li>Practice on nail wheels before attempting complex designs</li>
            <li>Invest in quality tools for better results</li>
            <li>Don't be afraid to modify trends to suit your personal style</li>
          </ul>
        </div>
      `,
      author: 'Emma Rodriguez',
      date: '2025-01-12',
      category: 'trends',
      tags: ['nail art', 'trends', '2025', 'fashion'],
      image: 'https://cdn1.genspark.ai/user-upload-image/5_generated/4370c9c9-49cb-4ff5-97bd-7a9196f0b295',
      readTime: 7,
      featured: true
    },
    '3': {
      id: '3',
      title: 'Gel vs. Regular Polish: Which Is Right for You?',
      excerpt: 'Compare the pros and cons of gel and regular nail polish. Learn about durability, application process, and cost to make the best choice for your lifestyle.',
      content: `
        <div class="prose max-w-none">
          <h2>The Great Polish Debate</h2>
          <p>Choosing between gel and regular nail polish can be confusing. Both have their advantages and drawbacks, and the best choice depends on your lifestyle, budget, and nail health priorities.</p>

          <h2>Regular Nail Polish</h2>
          <h3>Pros:</h3>
          <ul>
            <li><strong>Affordable:</strong> Lower upfront cost and widely available</li>
            <li><strong>Easy removal:</strong> Comes off easily with regular nail polish remover</li>
            <li><strong>No special equipment:</strong> Air dries naturally</li>
            <li><strong>Frequent color changes:</strong> Perfect for those who like to switch colors often</li>
            <li><strong>Less commitment:</strong> Easy to fix chips or change your mind</li>
          </ul>

          <h3>Cons:</h3>
          <ul>
            <li><strong>Short lifespan:</strong> Typically lasts 3-5 days before chipping</li>
            <li><strong>Longer dry time:</strong> Takes 10-15 minutes to fully dry</li>
            <li><strong>Less durable:</strong> More prone to chips and scratches</li>
            <li><strong>Frequent touch-ups:</strong> Requires regular maintenance</li>
          </ul>

          <h2>Gel Nail Polish</h2>
          <h3>Pros:</h3>
          <ul>
            <li><strong>Long-lasting:</strong> Can last 2-3 weeks without chipping</li>
            <li><strong>High shine:</strong> Maintains glossy finish throughout wear</li>
            <li><strong>Instant dry:</strong> Cures immediately under UV/LED light</li>
            <li><strong>Durable:</strong> Resistant to chips and scratches</li>
            <li><strong>Great for active lifestyles:</strong> Withstands daily activities</li>
          </ul>

          <h3>Cons:</h3>
          <ul>
            <li><strong>Higher cost:</strong> More expensive initially and requires special equipment</li>
            <li><strong>UV exposure:</strong> Requires UV or LED light for curing</li>
            <li><strong>Difficult removal:</strong> Needs soaking and can be damaging if not done properly</li>
            <li><strong>Less flexibility:</strong> Harder to change colors frequently</li>
            <li><strong>Potential nail damage:</strong> Can weaken nails if removed improperly</li>
          </ul>

          <h2>Cost Comparison</h2>
          <p>While gel polish has a higher upfront cost, it can be more economical in the long run if you get regular manicures. Consider:</p>
          <ul>
            <li>Initial investment in UV/LED lamp for at-home use</li>
            <li>Frequency of salon visits</li>
            <li>Cost per wear (gel lasts longer)</li>
            <li>Time saved on touch-ups and reapplication</li>
          </ul>

          <h2>Health Considerations</h2>
          <p>Both types of polish can affect nail health:</p>
          <ul>
            <li><strong>Regular polish:</strong> Frequent removal can dry out nails</li>
            <li><strong>Gel polish:</strong> Improper removal can cause nail damage and thinning</li>
            <li>Take breaks between manicures to let nails breathe</li>
            <li>Use strengthening treatments during polish-free periods</li>
          </ul>

          <h2>Which Should You Choose?</h2>
          <p><strong>Choose Regular Polish If:</strong></p>
          <ul>
            <li>You like changing colors frequently</li>
            <li>You have a limited budget</li>
            <li>You prefer simple at-home application</li>
            <li>You're concerned about UV exposure</li>
          </ul>

          <p><strong>Choose Gel Polish If:</strong></p>
          <ul>
            <li>You want long-lasting results</li>
            <li>You have an active lifestyle</li>
            <li>You don't mind the higher cost</li>
            <li>You prefer less frequent nail maintenance</li>
          </ul>

          <h2>Conclusion</h2>
          <p>There's no right or wrong choice—it all depends on your personal preferences, lifestyle, and priorities. Many people even alternate between the two depending on the occasion or season.</p>
        </div>
      `,
      author: 'Jessica Chen',
      date: '2025-01-10',
      category: 'education',
      tags: ['gel nails', 'polish', 'comparison'],
      image: 'https://cdn1.genspark.ai/user-upload-image/5_generated/209ff14d-37f2-409e-8b07-aaf607457f83',
      readTime: 4,
      featured: false
    },
    '4': {
      id: '4',
      title: 'How to Choose the Perfect Nail Salon: A Complete Checklist',
      excerpt: 'Find the ideal nail salon with our comprehensive guide. Learn what to look for in hygiene standards, services, and customer reviews.',
      content: `
        <div class="prose max-w-none">
          <h2>Your Guide to Finding the Perfect Nail Salon</h2>
          <p>Choosing the right nail salon is crucial for both the health of your nails and your overall experience. A good salon should make you feel pampered, safe, and satisfied with the results. Here's your comprehensive guide to finding the perfect nail salon.</p>

          <h2>Hygiene and Sanitation Standards</h2>
          <p>This should be your top priority when evaluating any salon:</p>
          
          <h3>What to Look For:</h3>
          <ul>
            <li><strong>Autoclave sterilization:</strong> The salon should use hospital-grade autoclaves to sterilize metal tools</li>
            <li><strong>Disposable items:</strong> Files, buffers, and pumice stones should be single-use and discarded after each client</li>
            <li><strong>Clean workstations:</strong> Each station should be thoroughly cleaned and disinfected between clients</li>
            <li><strong>Fresh towels and linens:</strong> All textiles should be freshly laundered for each client</li>
            <li><strong>Proper ventilation:</strong> The salon should have adequate airflow to remove chemical fumes</li>
          </ul>

          <h3>Red Flags:</h3>
          <ul>
            <li>Reusing files or buffers between clients</li>
            <li>Dirty or cluttered workstations</li>
            <li>Strong chemical odors with poor ventilation</li>
            <li>Rushing between clients without proper cleaning</li>
          </ul>

          <h2>Professional Qualifications</h2>
          <p>Ensure your nail technician is properly qualified:</p>
          <ul>
            <li><strong>Licensed professionals:</strong> All technicians should have current state licenses displayed</li>
            <li><strong>Continuing education:</strong> Look for salons that invest in ongoing training</li>
            <li><strong>Specialized certifications:</strong> Additional certifications in specific techniques or products</li>
            <li><strong>Experience level:</strong> Ask about the technician's experience with your desired service</li>
          </ul>

          <h2>Service Quality and Range</h2>
          <h3>Services Offered:</h3>
          <ul>
            <li>Basic manicures and pedicures</li>
            <li>Gel and shellac applications</li>
            <li>Nail art and design services</li>
            <li>Nail repair and strengthening treatments</li>
            <li>Spa treatments and add-ons</li>
          </ul>

          <h3>Quality Indicators:</h3>
          <ul>
            <li>Detailed consultation before service begins</li>
            <li>Use of high-quality products and tools</li>
            <li>Attention to detail and precision</li>
            <li>Comfortable and relaxing experience</li>
            <li>Results that meet or exceed expectations</li>
          </ul>

          <h2>Atmosphere and Customer Service</h2>
          <p>The salon environment should be:</p>
          <ul>
            <li><strong>Welcoming and comfortable:</strong> Clean, well-lit, and aesthetically pleasing</li>
            <li><strong>Professional atmosphere:</strong> Organized and efficient operations</li>
            <li><strong>Respectful staff:</strong> Courteous, attentive, and responsive to your needs</li>
            <li><strong>Clear communication:</strong> Prices, services, and policies clearly explained</li>
            <li><strong>Punctual service:</strong> Appointments start on time with minimal waiting</li>
          </ul>

          <h2>Pricing and Value</h2>
          <p>Consider both cost and value:</p>
          <ul>
            <li><strong>Transparent pricing:</strong> All costs should be clearly posted or explained upfront</li>
            <li><strong>Fair pricing:</strong> Prices should be competitive for the area and service quality</li>
            <li><strong>Value for money:</strong> Quality and longevity should justify the cost</li>
            <li><strong>Package deals:</strong> Look for loyalty programs or package discounts</li>
            <li><strong>No hidden fees:</strong> Additional charges should be discussed beforehand</li>
          </ul>

          <h2>Reviews and Recommendations</h2>
          <p>Research before you visit:</p>
          <ul>
            <li><strong>Online reviews:</strong> Check Google, Yelp, and social media for customer feedback</li>
            <li><strong>Word of mouth:</strong> Ask friends and family for recommendations</li>
            <li><strong>Before and after photos:</strong> Look at the salon's portfolio of work</li>
            <li><strong>Consistency:</strong> Look for consistently positive feedback over time</li>
            <li><strong>Response to complaints:</strong> How does the salon handle negative reviews?</li>
          </ul>

          <h2>Your Checklist for the First Visit</h2>
          <p>On your first visit, evaluate:</p>
          <ul>
            <li>Overall cleanliness and organization</li>
            <li>Staff professionalism and friendliness</li>
            <li>Quality of consultation and communication</li>
            <li>Comfort level during the service</li>
            <li>Satisfaction with the final results</li>
            <li>Value received for the price paid</li>
          </ul>

          <h2>Questions to Ask</h2>
          <p>Don't hesitate to ask:</p>
          <ul>
            <li>How do you sterilize your tools?</li>
            <li>What products do you use?</li>
            <li>How long will this service last?</li>
            <li>What aftercare do you recommend?</li>
            <li>What is your policy for unsatisfactory results?</li>
          </ul>

          <h2>Conclusion</h2>
          <p>Finding the perfect nail salon takes some research, but it's worth the effort for your health, safety, and satisfaction. Don't settle for anything less than professional, clean, and high-quality service. Trust your instincts—if something doesn't feel right, it's okay to look elsewhere.</p>
        </div>
      `,
      author: 'Amanda Taylor',
      date: '2025-01-08',
      category: 'tips',
      tags: ['salon selection', 'hygiene', 'reviews'],
      image: 'https://cdn1.genspark.ai/user-upload-image/5_generated/1e0f356a-74af-42c5-923e-e07aa56d7a45',
      readTime: 6,
      featured: false
    },
    '5': {
      id: '5',
      title: 'DIY Manicure at Home: Professional Results Without the Salon',
      excerpt: 'Master the art of at-home manicures with step-by-step instructions. Save money while achieving salon-quality results in your own space.',
      content: `
        <div class="prose max-w-none">
          <h2>Achieving Salon-Quality Results at Home</h2>
          <p>With the right techniques, tools, and patience, you can achieve professional-looking manicures from the comfort of your home. Not only will you save money, but you'll also have the flexibility to pamper yourself whenever you want.</p>

          <h2>Essential Tools and Supplies</h2>
          <h3>Basic Tools:</h3>
          <ul>
            <li><strong>Nail clippers:</strong> For trimming length</li>
            <li><strong>Glass or crystal nail file:</strong> Gentler than metal files</li>
            <li><strong>Buffer block:</strong> For smoothing nail surface</li>
            <li><strong>Cuticle pusher:</strong> Metal or wooden tool</li>
            <li><strong>Cuticle nippers:</strong> For removing hangnails only</li>
            <li><strong>Small scissors:</strong> For trimming cuticles if needed</li>
          </ul>

          <h3>Products Needed:</h3>
          <ul>
            <li><strong>Cuticle oil or cream:</strong> For softening cuticles</li>
            <li><strong>Hand cream or lotion:</strong> For moisturizing</li>
            <li><strong>Base coat:</strong> Protects nails and helps polish adhere</li>
            <li><strong>Nail polish:</strong> Your chosen color</li>
            <li><strong>Top coat:</strong> For shine and protection</li>
            <li><strong>Nail polish remover:</strong> Acetone or non-acetone</li>
            <li><strong>Cotton pads and swabs:</strong> For cleanup</li>
          </ul>

          <h2>Step-by-Step DIY Manicure</h2>

          <h3>Step 1: Remove Old Polish</h3>
          <p>Start with clean nails by removing any existing polish completely. Use a cotton pad soaked in polish remover, working from the cuticle to the tip.</p>

          <h3>Step 2: Trim and Shape</h3>
          <ul>
            <li>Trim nails to your desired length using clippers</li>
            <li>File in one direction only, from outside edge to center</li>
            <li>Choose your preferred shape: square, round, oval, or almond</li>
            <li>Keep all nails the same length for a polished look</li>
          </ul>

          <h3>Step 3: Soak and Soften</h3>
          <p>Soak your hands in warm, soapy water for 3-5 minutes to soften cuticles and remove debris. This makes cuticle care much easier and more comfortable.</p>

          <h3>Step 4: Cuticle Care</h3>
          <ul>
            <li>Apply cuticle oil or cream to each nail</li>
            <li>Gently push back cuticles with a cuticle pusher</li>
            <li>Only trim cuticles if absolutely necessary—pushing back is usually sufficient</li>
            <li>Remove any hangnails carefully with cuticle nippers</li>
          </ul>

          <h3>Step 5: Buff and Smooth</h3>
          <ul>
            <li>Lightly buff the nail surface to smooth ridges</li>
            <li>Don't over-buff—this can thin and weaken nails</li>
            <li>Wipe nails clean with a damp cloth</li>
          </ul>

          <h3>Step 6: Apply Base Coat</h3>
          <ul>
            <li>Apply a thin layer of base coat to each nail</li>
            <li>Let it dry completely (usually 1-2 minutes)</li>
            <li>Base coat prevents staining and helps polish last longer</li>
          </ul>

          <h3>Step 7: Polish Application</h3>
          <ul>
            <li>Apply thin, even coats rather than one thick coat</li>
            <li>Start with a stripe down the center, then fill in the sides</li>
            <li>Stay slightly away from the cuticles to avoid flooding</li>
            <li>Apply 2-3 thin coats for best coverage</li>
            <li>Let each coat dry completely before applying the next</li>
          </ul>

          <h3>Step 8: Top Coat and Cleanup</h3>
          <ul>
            <li>Apply a clear top coat for shine and protection</li>
            <li>Clean up any mistakes with a small brush dipped in polish remover</li>
            <li>Apply cuticle oil around the nail beds</li>
            <li>Moisturize hands and massage in the lotion</li>
          </ul>

          <h2>Pro Tips for Better Results</h2>

          <h3>Application Techniques:</h3>
          <ul>
            <li><strong>Thin coats are key:</strong> Multiple thin coats look better and last longer than thick coats</li>
            <li><strong>Clean brushes:</strong> Wipe the brush on the bottle neck to remove excess polish</li>
            <li><strong>Steady hands:</strong> Rest your elbows on a table for stability</li>
            <li><strong>Good lighting:</strong> Work in bright, natural light when possible</li>
          </ul>

          <h3>Drying Tips:</h3>
          <ul>
            <li>Allow adequate drying time between coats</li>
            <li>Use quick-dry top coat or spray to speed up the process</li>
            <li>Avoid hot water for at least an hour after painting</li>
            <li>Apply a drop of cuticle oil over dry polish to add shine and flexibility</li>
          </ul>

          <h2>Common Mistakes to Avoid</h2>
          <ul>
            <li><strong>Skipping base coat:</strong> This leads to staining and poor adhesion</li>
            <li><strong>Thick coats:</strong> Result in uneven coverage and longer drying time</li>
            <li><strong>Rushing the process:</strong> Take your time for professional results</li>
            <li><strong>Ignoring cuticle care:</strong> Healthy cuticles frame the nail beautifully</li>
            <li><strong>Using old polish:</strong> Thick, goopy polish doesn't apply well</li>
          </ul>

          <h2>Making Your Manicure Last</h2>
          <ul>
            <li>Wear gloves when cleaning or doing dishes</li>
            <li>Apply cuticle oil daily</li>
            <li>Use hand cream regularly</li>
            <li>Avoid using nails as tools</li>
            <li>Touch up chips immediately to prevent further damage</li>
          </ul>

          <h2>When to Seek Professional Help</h2>
          <p>While DIY manicures are great for regular maintenance, consider professional services for:</p>
          <ul>
            <li>Complex nail art or designs</li>
            <li>Gel or shellac applications</li>
            <li>Nail repair or reconstruction</li>
            <li>Treatment of nail problems or infections</li>
            <li>Special occasions when you want guaranteed perfect results</li>
          </ul>

          <h2>Conclusion</h2>
          <p>With practice and patience, DIY manicures can give you beautiful, salon-quality results at home. Start with basic techniques and gradually build your skills. Remember, practice makes perfect, so don't be discouraged if your first attempts aren't flawless. Enjoy the process and the satisfaction of beautiful nails you created yourself!</p>
        </div>
      `,
      author: 'Michelle Park',
      date: '2025-01-05',
      category: 'diy',
      tags: ['DIY', 'manicure', 'tutorial'],
      image: 'https://cdn1.genspark.ai/user-upload-image/5_generated/05c3be11-a17c-4eb5-9809-23740d71c9df',
      readTime: 8,
      featured: false
    },
    '6': {
      id: '6',
      title: 'Nail Health 101: Signs Your Nails Need Professional Attention',
      excerpt: 'Learn to identify common nail problems and when to seek professional help. Understand the difference between cosmetic issues and health concerns.',
      content: `
        <div class="prose max-w-none">
          <h2>Understanding Nail Health</h2>
          <p>Your nails can be a window into your overall health. While many nail changes are harmless and cosmetic, some can indicate underlying health conditions that require professional attention. Learning to recognize the difference is crucial for maintaining both nail and overall health.</p>

          <h2>Anatomy of a Healthy Nail</h2>
          <p>Before identifying problems, it's important to understand what healthy nails look like:</p>
          <ul>
            <li><strong>Color:</strong> Pink nail bed with white tips (in lighter skin tones)</li>
            <li><strong>Texture:</strong> Smooth, even surface without ridges or indentations</li>
            <li><strong>Shape:</strong> Gently curved, not flat or extremely curved</li>
            <li><strong>Thickness:</strong> Uniform thickness across the nail</li>
            <li><strong>Growth:</strong> Steady growth rate (about 3mm per month)</li>
            <li><strong>Cuticles:</strong> Smooth, intact skin around the nail base</li>
          </ul>

          <h2>Common Cosmetic Issues (Usually Harmless)</h2>

          <h3>White Spots (Leukonychia)</h3>
          <ul>
            <li><strong>Appearance:</strong> Small white dots or patches on the nail</li>
            <li><strong>Common cause:</strong> Minor trauma or injury to the nail matrix</li>
            <li><strong>Treatment:</strong> Usually resolve on their own as the nail grows out</li>
            <li><strong>When to worry:</strong> If spots appear suddenly across multiple nails</li>
          </ul>

          <h3>Vertical Ridges</h3>
          <ul>
            <li><strong>Appearance:</strong> Vertical lines running from cuticle to tip</li>
            <li><strong>Common cause:</strong> Normal aging process, like wrinkles for nails</li>
            <li><strong>Treatment:</strong> Regular moisturizing and gentle buffing</li>
            <li><strong>When to worry:</strong> If ridges become very pronounced suddenly</li>
          </ul>

          <h3>Hangnails</h3>
          <ul>
            <li><strong>Appearance:</strong> Small pieces of torn skin around the nail</li>
            <li><strong>Common cause:</strong> Dry cuticles, nail biting, or harsh chemicals</li>
            <li><strong>Treatment:</strong> Careful trimming and moisturizing</li>
            <li><strong>When to worry:</strong> If they become infected or very painful</li>
          </ul>

          <h2>Warning Signs That Need Professional Attention</h2>

          <h3>Sudden Color Changes</h3>
          <p><strong>Yellow nails:</strong></p>
          <ul>
            <li>Can indicate fungal infection, especially if accompanied by thickening</li>
            <li>May signal respiratory conditions or lymphatic problems</li>
            <li>Sometimes caused by heavy nail polish use</li>
          </ul>

          <p><strong>Blue or purple nails:</strong></p>
          <ul>
            <li>May indicate poor circulation or heart problems</li>
            <li>Can be a sign of inadequate oxygen in the blood</li>
            <li>Requires immediate medical evaluation if sudden</li>
          </ul>

          <p><strong>Dark lines or spots:</strong></p>
          <ul>
            <li>Vertical dark lines can be normal in darker skin tones</li>
            <li>New dark lines or spots may indicate melanoma</li>
            <li>Any sudden changes should be evaluated by a dermatologist</li>
          </ul>

          <h3>Texture and Shape Changes</h3>

          <p><strong>Horizontal ridges (Beau's lines):</strong></p>
          <ul>
            <li>Can indicate serious illness or severe stress</li>
            <li>May suggest nutritional deficiencies</li>
            <li>Often appear weeks after the triggering event</li>
          </ul>

          <p><strong>Clubbing:</strong></p>
          <ul>
            <li>Nails curve around fingertips</li>
            <li>Can indicate heart or lung disease</li>
            <li>Requires immediate medical evaluation</li>
          </ul>

          <p><strong>Spoon nails (koilonychia):</strong></p>
          <ul>
            <li>Nails curve inward like a spoon</li>
            <li>Often indicates iron deficiency anemia</li>
            <li>May suggest other nutritional deficiencies</li>
          </ul>

          <h3>Nail Separation</h3>
          <ul>
            <li><strong>Onycholysis:</strong> Nail separates from the nail bed</li>
            <li>Can be caused by infection, injury, or medications</li>
            <li>May indicate thyroid problems or psoriasis</li>
            <li>Requires professional evaluation to determine cause</li>
          </ul>

          <h2>Infection Warning Signs</h2>

          <h3>Fungal Infections:</h3>
          <ul>
            <li>Yellowing, thickening, or crumbling nails</li>
            <li>White or yellow spots under the nail</li>
            <li>Brittle or ragged nail edges</li>
            <li>Foul odor from the nail</li>
          </ul>

          <h3>Bacterial Infections:</h3>
          <ul>
            <li>Swelling, redness, and pain around the nail</li>
            <li>Pus or discharge</li>
            <li>Red streaking from the nail area</li>
            <li>Fever or feeling unwell</li>
          </ul>

          <h2>When to See a Doctor vs. Nail Professional</h2>

          <h3>See a Doctor When:</h3>
          <ul>
            <li>Sudden changes in nail color, especially blue, purple, or dark lines</li>
            <li>Signs of infection (swelling, pus, red streaking)</li>
            <li>Nails that separate from the nail bed</li>
            <li>Clubbing or significant shape changes</li>
            <li>Horizontal ridges across multiple nails</li>
            <li>Any changes that concern you or seem unusual</li>
          </ul>

          <h3>See a Nail Professional For:</h3>
          <ul>
            <li>Cosmetic concerns and improvements</li>
            <li>Proper nail shaping and cuticle care</li>
            <li>Suspected fungal infections (they can refer you to a doctor)</li>
            <li>Ingrown nails (mild cases)</li>
            <li>Regular maintenance and prevention advice</li>
          </ul>

          <h2>Prevention and Maintenance</h2>

          <h3>Daily Care:</h3>
          <ul>
            <li>Keep nails clean and dry</li>
            <li>Moisturize nails and cuticles daily</li>
            <li>Avoid biting nails or picking at cuticles</li>
            <li>Wear gloves when cleaning or gardening</li>
          </ul>

          <h3>Regular Monitoring:</h3>
          <ul>
            <li>Check your nails weekly for changes</li>
            <li>Take photos if you notice something unusual</li>
            <li>Keep a nail diary if you have ongoing concerns</li>
            <li>Report significant changes to your healthcare provider</li>
          </ul>

          <h2>Nutrition for Nail Health</h2>
          <p>Support nail health from the inside out:</p>
          <ul>
            <li><strong>Protein:</strong> Essential for nail structure and growth</li>
            <li><strong>Iron:</strong> Prevents spoon nails and brittleness</li>
            <li><strong>Biotin:</strong> Supports nail strength and thickness</li>
            <li><strong>Zinc:</strong> Important for nail growth and repair</li>
            <li><strong>Vitamin D:</strong> Supports nail growth and health</li>
          </ul>

          <h2>Conclusion</h2>
          <p>While most nail changes are harmless, knowing when to seek professional help is important for maintaining both nail and overall health. Trust your instincts—if something seems off, it's always better to have it checked. Regular nail care and attention to changes can help catch problems early and keep your nails healthy and beautiful.</p>

          <p>Remember: Your nails are a reflection of your health. Take care of them, pay attention to changes, and don't hesitate to seek professional advice when needed.</p>
        </div>
      `,
      author: 'Dr. Lisa Wang',
      date: '2025-01-03',
      category: 'health',
      tags: ['nail health', 'medical', 'symptoms'],
      image: 'https://cdn1.genspark.ai/user-upload-image/5_generated/d50b8c86-3fd4-45d3-97cb-c29de5211d4b',
      readTime: 5,
      featured: false
    }
  }

  useEffect(() => {
    const currentPost = blogPosts[params.id]
    setPost(currentPost || null)
    setLoading(false)
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <button
              onClick={() => window.location.href = '/blog'}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Back to Blog
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Article Header */}
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            onClick={() => window.location.href = '/blog'}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </motion.button>

          {/* Article Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                {post.category.charAt(0).toUpperCase() + post.category.slice(1).replace('-', ' ')}
              </span>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.date)}</span>
                </div>
              </div>

              <button className="p-2 text-gray-400 hover:text-primary-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-card p-8 mb-8"
          >
            <div 
              className="prose prose-lg max-w-none"
              style={{
                color: '#374151',
                lineHeight: '1.75'
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </article>

      <Footer />
    </div>
  )
}