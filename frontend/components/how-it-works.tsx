"use client";

import { UserPlus, Search, MessageCircle, HandHeart } from "lucide-react";
import { StepCard } from "./step-card";
const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-in slide-in-from-bottom-6 duration-700">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started with SubLease Pro in just a few simple steps. Connect,
            communicate, and find your perfect housing match.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="animate-in slide-in-from-bottom-6 duration-700 delay-100">
            <StepCard
              step={1}
              icon={UserPlus}
              title="Sign Up & Verify"
              description="Create your account with your university email and get verified as a student for trusted connections."
            />
          </div>
          <div className="animate-in slide-in-from-bottom-6 duration-700 delay-200">
            <StepCard
              step={2}
              icon={Search}
              title="Browse or Post"
              description="Search for available sub-leases in your area or post your own property to find interested students."
            />
          </div>
          <div className="animate-in slide-in-from-bottom-6 duration-700 delay-300">
            <StepCard
              step={3}
              icon={MessageCircle}
              title="Connect & Chat"
              description="Message property owners directly through our secure platform. Ask questions and arrange viewings."
            />
          </div>
          <div className="animate-in slide-in-from-bottom-6 duration-700 delay-400">
            <StepCard
              step={4}
              icon={HandHeart}
              title="Secure Your Stay"
              description="Finalize your agreement and enjoy your perfect short-term housing with peace of mind."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
