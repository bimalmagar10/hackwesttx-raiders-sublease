"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { PropertyCard } from "@/components/property-card";
import { Grid, List, Filter, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getProperties, PropertyResponse } from "@/lib/api";
import { toast } from "sonner";

export default function Browse() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const fetchedProperties = await getProperties();
        console.log(fetchedProperties);
        setProperties(fetchedProperties);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError("Failed to load properties. Please try again.");
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`w-full lg:w-80 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
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
                  {/* Location */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Location
                    </h4>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Enter location" className="pl-10" />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Price Range
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Min" className="text-sm" />
                      <Input placeholder="Max" className="text-sm" />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Duration
                    </h4>
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
                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Property Type
                    </h4>
                    <div className="space-y-2">
                      {["1BHK", "2BHK", "3BHK"].map((type) => (
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
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Browse My Properties
                </h2>
                <p className="text-muted-foreground mt-1">
                  {loading
                    ? "Loading..."
                    : `${properties.length} properties found`}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden border-border"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <select className="border border-border rounded-md px-3 py-2 text-sm focus:border-primary focus:ring-primary bg-background">
                  <option>Sort by: Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Distance</option>
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

            {/* Properties Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading properties...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No properties found
                </p>
                <Button variant="outline">Clear Filters</Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {properties.map((property) => (
                  <PropertyCard
                    key={property.property_id}
                    property={property}
                    variant={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {/* <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                Load More Properties
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
