"use client";

import { featuredProperties } from "@/lib/constants";
import Link from "next/link";
import { Button } from "./ui/button";
import { PropertyCard } from "./property-card";
import { ArrowRight } from "lucide-react";

const Featured = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-in slide-in-from-bottom-6 duration-700">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Sub-leases
          </h2>
          <p className="text-xl text-muted-foreground">
            Discover amazing short-term housing options from verified students
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property, index) => (
            <div
              key={property.id}
              className={`animate-in slide-in-from-bottom-6 duration-700 delay-${
                (index + 1) * 100
              }`}
            >
              <PropertyCard property={property} variant="grid" />
            </div>
          ))}
        </div>
        <div className="text-center mt-12 animate-in slide-in-from-bottom-6 duration-700 delay-400">
          <Link href="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 bg-transparent"
            >
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Featured;
