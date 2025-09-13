"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, Star } from "lucide-react";
import { SearchBar } from "./search-bar";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-primary/10 py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in slide-in-from-left-8 duration-700">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Find Your Perfect
              <span className="text-primary block"> Subleasing </span>
              in Minutes
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect directly with verified students for flexible sub-leasing.
              Whether you need a place for a few weeks or several months,
              discover your ideal temporary home today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/sub-leases">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
                >
                  Start Browsing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/post-property">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 px-8 py-4 text-lg bg-transparent"
                >
                  List Your Place
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-muted border-2 border-background"
                    ></div>
                  ))}
                </div>
                <span>2,500+ verified students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>

          <div className="relative animate-in slide-in-from-right-8 duration-700 delay-200">
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-card rounded-lg p-4 shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-primary rounded-full"></div>
                      <div>
                        <div className="h-2 bg-muted rounded w-16"></div>
                        <div className="h-2 bg-muted/50 rounded w-12 mt-1"></div>
                      </div>
                    </div>
                    <div className="h-20 bg-muted rounded mb-2"></div>
                    <div className="h-2 bg-muted rounded w-full mb-1"></div>
                    <div className="h-2 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="bg-card rounded-lg p-4 shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="h-2 bg-muted rounded w-16"></div>
                        <div className="h-2 bg-muted/50 rounded w-12 mt-1"></div>
                      </div>
                    </div>
                    <div className="h-20 bg-muted rounded mb-2"></div>
                    <div className="h-2 bg-muted rounded w-full mb-1"></div>
                    <div className="h-2 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-card rounded-lg p-4 shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="h-2 bg-muted rounded w-16"></div>
                        <div className="h-2 bg-muted/50 rounded w-12 mt-1"></div>
                      </div>
                    </div>
                    <div className="h-20 bg-muted rounded mb-2"></div>
                    <div className="h-2 bg-muted rounded w-full mb-1"></div>
                    <div className="h-2 bg-muted rounded w-4/5"></div>
                  </div>
                  <div className="bg-primary/20 rounded-lg p-4 border-2 border-primary border-dashed">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">
                          +
                        </span>
                      </div>
                      <div className="h-2 bg-primary/30 rounded w-20 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 animate-in slide-in-from-bottom-8 duration-700 delay-300">
          <SearchBar variant="hero" className="max-w-4xl mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
