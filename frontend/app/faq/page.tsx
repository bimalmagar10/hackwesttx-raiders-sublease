"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { faqData, faqCategories, searchFAQs } from "@/lib/faq-data";

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = searchQuery 
    ? searchFAQs(searchQuery)
    : selectedCategory === "All" 
      ? faqData 
      : faqData.filter(faq => faq.category === selectedCategory);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Find answers to common questions about SubLease Pro
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Search through our FAQ or filter by category
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {searchQuery ? `Search Results (${filteredFAQs.length})` : 
             selectedCategory === "All" ? `All Questions (${filteredFAQs.length})` :
             `${selectedCategory} (${filteredFAQs.length})`}
          </h2>
        </div>

        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No FAQs found matching your search criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div 
                    className="flex items-center justify-between"
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{faq.question}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground ml-4" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground ml-4" />
                    )}
                  </div>
                  
                  {expandedFAQ === faq.id && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <Card className="mt-12">
        <CardContent className="text-center py-8">
          <h3 className="font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? Try our AI assistant or contact support.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/help" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Chat with AI Assistant
            </a>
            <a 
              href="mailto:support@subleasepro.com"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Contact Support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
