interface FAQSection {
  question: string
  answer: string
}

export const parseDescriptionFAQ = (description: string, fallbackName?: string): FAQSection[] | null => {
  if (!description) return null
  
  // Split by common FAQ patterns: **Question** or <strong>Question</strong>
  const sections = description.split(/(?=\*\*|<strong>)/g)
  
  return sections.map((section) => {
    // Extract question and answer from HTML strong tags
    const strongMatch = section.match(/<strong>(.*?)<\/strong>(.*)/s)
    // Extract question and answer from markdown bold
    const boldMatch = section.match(/\*\*(.*?)\*\*(.*)/s)
    
    if (strongMatch) {
      return {
        question: strongMatch[1].trim(),
        answer: strongMatch[2].trim().replace(/<\/?[^>]+(>|$)/g, "")
      }
    } else if (boldMatch) {
      return {
        question: boldMatch[1].trim(),
        answer: boldMatch[2].trim()
      }
    } else {
      return {
        question: `About ${fallbackName || 'This Salon'}`,
        answer: section.trim()
      }
    }
  }).filter(item => item.answer.length > 10) // Filter out empty sections
}
