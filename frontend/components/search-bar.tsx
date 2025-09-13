"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar } from "lucide-react";

interface SearchBarProps {
  variant?: "hero" | "header";
  className?: string;
}

export function SearchBar({
  variant = "hero",
  className = "",
}: SearchBarProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={`bg-white rounded-lg shadow-lg border border-gray-200 ${
        isHero ? "p-6" : "p-3"
      } ${className}`}
    >
      <div
        className={`grid gap-4 ${isHero ? "md:grid-cols-4" : "md:grid-cols-3"}`}
      >
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Where are you looking?"
            className={`pl-10 border-gray-300 focus:border-primary focus:ring-primary ${
              isHero ? "h-12" : "h-10"
            }`}
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="date"
            className={`pl-10 border-gray-300 focus:border-primary focus:ring-primary ${
              isHero ? "h-12" : "h-10"
            }`}
          />
        </div>

        {isHero && (
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
        )}

        <Button
          className={`bg-primary hover:bg-primary/90 text-white ${
            isHero ? "h-12" : "h-10"
          }`}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}
