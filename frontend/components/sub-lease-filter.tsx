"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, List, Grid } from "lucide-react";
import { SocialPost } from "@/components/social-post";
import { socialPosts } from "@/lib/constants";
import { useState } from "react";
const SubLeaseFilter = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <Card className="bg-card border-border sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Filters
                </h3>
                <Button variant="ghost" size="sm" className="text-primary">
                  Clear all
                </Button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div className="animate-in slide-in-from-left-4 duration-500">
                  <h4 className="font-medium text-foreground mb-3">
                    Price Range
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Min" className="text-sm" />
                    <Input placeholder="Max" className="text-sm" />
                  </div>
                </div>

                {/* Duration */}
                <div className="animate-in slide-in-from-left-4 duration-500 delay-100">
                  <h4 className="font-medium text-foreground mb-3">Duration</h4>
                  <div className="space-y-2">
                    {[
                      "1 week - 1 month",
                      "1-2 months",
                      "2-3 months",
                      "3+ months",
                    ].map((duration) => (
                      <label
                        key={duration}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {duration}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div className="animate-in slide-in-from-left-4 duration-500 delay-200">
                  <h4 className="font-medium text-foreground mb-3">
                    Property Type
                  </h4>
                  <div className="space-y-2">
                    {["Studio", "1 Bedroom", "2 Bedroom", "Shared Room"].map(
                      (type) => (
                        <label
                          key={type}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-muted-foreground">
                            {type}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div className="animate-in slide-in-from-left-4 duration-500 delay-300">
                  <h4 className="font-medium text-foreground mb-3">
                    Amenities
                  </h4>
                  <div className="space-y-2">
                    {[
                      "WiFi",
                      "Furnished",
                      "Parking",
                      "Gym",
                      "Pool",
                      "Laundry",
                    ].map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 animate-in slide-in-from-top-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Available Sub-leases
              </h2>
              <p className="text-muted-foreground mt-1">127 properties found</p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="border border-border rounded-md px-3 py-2 text-sm focus:border-primary focus:ring-primary bg-background">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Social Feed */}
          <div className="space-y-6">
            {socialPosts.map((post, index) => (
              <div
                key={post.id}
                className={`animate-in slide-in-from-bottom-4 duration-500 delay-${
                  index * 100
                }`}
              >
                <SocialPost post={post} />
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8 animate-in slide-in-from-bottom-4 duration-500 delay-400">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10 bg-transparent"
            >
              Load More Properties
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubLeaseFilter;
