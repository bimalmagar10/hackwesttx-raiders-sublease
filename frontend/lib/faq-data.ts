export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords?: string[];
}

export const faqData: FAQItem[] = [
  {
    id: "1",
    question: "How do I list my property for sublease?",
    answer: "To list your property, go to the 'Post Sublease' section in your dashboard. Fill out the property details, upload photos, set your price and availability dates. Make sure to include accurate information to attract the right tenants.",
    category: "Listing",
    keywords: ["list", "post", "property", "sublease", "upload", "photos"]
  },
  {
    id: "2", 
    question: "What documents do I need to sublease my apartment?",
    answer: "You'll typically need: your original lease agreement, landlord permission (if required), sublease agreement template, tenant screening documents, and proof of your right to sublease. Check with your landlord first!",
    category: "Documentation",
    keywords: ["documents", "lease", "agreement", "landlord", "permission", "screening"]
  },
  {
    id: "3",
    question: "How does the payment system work?",
    answer: "We use secure payment processing. Tenants pay through our platform, and funds are released to property owners after successful check-in. We charge a small service fee for payment processing and platform maintenance.",
    category: "Payment",
    keywords: ["payment", "money", "fee", "secure", "processing", "funds"]
  },
  {
    id: "4",
    question: "Can I sublease if I'm a student?",
    answer: "Yes! Many students sublease their apartments during summer breaks or when studying abroad. Just make sure you have permission from your landlord and that subleasing is allowed in your lease agreement.",
    category: "Students",
    keywords: ["student", "summer", "break", "study abroad", "university", "college"]
  },
  {
    id: "5",
    question: "How do I verify potential tenants?",
    answer: "We provide tenant verification tools including background checks, income verification, and references. You can also request video calls and additional documentation before finalizing any agreement.",
    category: "Verification",
    keywords: ["verify", "background check", "income", "references", "video call", "tenant"]
  },
  {
    id: "6",
    question: "What if there's a problem during the sublease?",
    answer: "Our support team is here to help resolve any issues. We also provide dispute resolution services and can connect you with legal resources if needed. Always document any problems and contact us immediately.",
    category: "Support",
    keywords: ["problem", "issue", "dispute", "support", "help", "legal"]
  },
  {
    id: "7",
    question: "How far in advance should I post my sublease?",
    answer: "We recommend posting 30-60 days in advance for best results. This gives potential tenants time to plan and increases your chances of finding the right match. For summer subleases, start posting in March/April.",
    category: "Timing",
    keywords: ["advance", "timing", "when", "post", "summer", "plan"]
  },
  {
    id: "8",
    question: "Are there any restrictions on who can sublease?",
    answer: "Sublease eligibility depends on your original lease terms and local laws. Generally, you need landlord permission and the subtenant must meet basic requirements. We help facilitate the approval process.",
    category: "Eligibility",
    keywords: ["restrictions", "eligibility", "requirements", "approval", "laws"]
  },
  {
    id: "9",
    question: "How do I handle utilities and other bills?",
    answer: "You can include utilities in your sublease price or have the subtenant pay directly. Clearly specify this in your listing and sublease agreement. Many choose to include utilities for simplicity.",
    category: "Utilities",
    keywords: ["utilities", "bills", "electricity", "water", "internet", "include"]
  },
  {
    id: "10",
    question: "Can I cancel a sublease agreement?",
    answer: "Cancellation policies depend on the terms in your sublease agreement. We recommend including reasonable cancellation terms for both parties. Emergency cancellations may be possible with proper documentation.",
    category: "Cancellation",
    keywords: ["cancel", "cancellation", "terminate", "emergency", "policy"]
  }
];

export const faqCategories = [
  "All",
  "Listing",
  "Documentation", 
  "Payment",
  "Students",
  "Verification",
  "Support",
  "Timing",
  "Eligibility",
  "Utilities",
  "Cancellation"
];

export function searchFAQs(query: string): FAQItem[] {
  if (!query.trim()) return faqData;
  
  const lowercaseQuery = query.toLowerCase();
  
  return faqData.filter(faq => 
    faq.question.toLowerCase().includes(lowercaseQuery) ||
    faq.answer.toLowerCase().includes(lowercaseQuery) ||
    faq.keywords?.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
  );
}
