"use client";

import { Calendar, MessageCircle, Shield } from "lucide-react";
import { FeatureCard } from "./feature-card";

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-in slide-in-from-bottom-6 duration-700">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose SubLease Pro?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The most trusted platform for student housing, designed specifically
            for flexible short-term stays
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="animate-in slide-in-from-bottom-6 duration-700 delay-100">
            <FeatureCard
              icon={Shield}
              title="Safe & Verified"
              description="All users are verified students with university email addresses. Connect with confidence knowing you're dealing with real, trustworthy people."
            />
          </div>
          <div className="animate-in slide-in-from-bottom-6 duration-700 delay-200">
            <FeatureCard
              icon={MessageCircle}
              title="Direct Communication"
              description="Chat directly with property owners through our secure messaging system. No middlemen, no extra fees - just honest, direct communication."
            />
          </div>
          <div className="animate-in slide-in-from-bottom-6 duration-700 delay-300">
            <FeatureCard
              icon={Calendar}
              title="Flexible Terms"
              description="From one week to several months, find exactly the duration you need. Perfect for internships, study abroad, or semester breaks."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
