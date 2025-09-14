"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";
import {
  Upload,
  MapPin,
  Home,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  WashingMachine,
  ChefHat,
  X,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { amenities } from "@/lib/constants";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyFormSchema, PropertyFormInputs } from "@/lib/schemas";
import { createProperty } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const PropertyPage = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PropertyFormInputs>({
    resolver: zodResolver(propertyFormSchema) as any,
    mode: "onChange", // This ensures isValid is updated in real-time
  });

  const selectedAmenities = watch("amenities") || [];

  const toggleAmenity = (amenityId: string) => {
    const currentAmenities = selectedAmenities;
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter((id: string) => id !== amenityId)
      : [...currentAmenities, amenityId];
    setValue("amenities", newAmenities);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedImages(files);
    setValue("images", files);
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setValue("images", newImages);
  };

  const onSubmit = async (data: PropertyFormInputs) => {
    try {
      // Transform the form data before sending to API
      const transformedData = {
        ...data,
        square_feet:
          data.square_feet && data.square_feet !== ""
            ? parseInt(data.square_feet, 10) || undefined
            : undefined,
        images: uploadedImages,
      };

      const result = await createProperty(transformedData);

      toast.success("You registered your property!");
      router.push("/browse");
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create property"
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            List Your Property
          </h1>
          <p className="text-muted-foreground">
            Share your space with fellow students and earn extra income
          </p>
        </div>

        <div className="">
          {/* Main Form */}
          <form
            onSubmit={handleSubmit(onSubmit as any)}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Home className="h-5 w-5 text-primary" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="e.g., Cozy Studio Near Campus"
                      className="mt-1"
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive dark:text-red-400 mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Describe your property, what makes it special, nearby amenities..."
                      className="mt-1 min-h-[120px]"
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive dark:text-red-400 mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="property-type">Property Type</Label>
                      <select
                        id="property-type"
                        {...register("property_type")}
                        className="mt-1 w-full border border-border rounded-md px-3 py-2 focus:border-primary focus:ring-primary bg-background"
                      >
                        <option value="">Select type</option>
                        <option value="1BHK">1BHK</option>
                        <option value="2BHK">2BHK</option>
                        <option value="3BHK">3BHK</option>
                      </select>
                      {errors.property_type && (
                        <p className="text-sm text-destructive dark:text-red-400 mt-1">
                          {errors.property_type.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="square-feet">Square Feet</Label>
                      <Input
                        id="square-feet"
                        {...register("square_feet")}
                        type="number"
                        placeholder="e.g., 500"
                        className="mt-1"
                      />
                      {errors.square_feet && (
                        <p className="text-sm text-destructive dark:text-red-400 mt-1">
                          {errors.square_feet.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address-line1">Address Line 1</Label>
                    <Input
                      id="address-line1"
                      {...register("address_line1")}
                      placeholder="123 University Ave"
                      className="mt-1"
                    />
                    {errors.address_line1 && (
                      <p className="text-sm text-destructive dark:text-red-400 mt-1">
                        {errors.address_line1.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="address-line2">
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="address-line2"
                      {...register("address_line2")}
                      placeholder="Apt 4B, Unit 203"
                      className="mt-1"
                    />
                    {errors.address_line2 && (
                      <p className="text-sm text-destructive  dark:text-red-400 mt-1">
                        {errors.address_line2.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        placeholder="College Town"
                        className="mt-1"
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive dark:text-red-400 mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        {...register("state")}
                        placeholder="TX"
                        className="mt-1"
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive dark:text-red-400 mt-1">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        {...register("country")}
                        placeholder="USA"
                        className="mt-1"
                      />
                      {errors.country && (
                        <p className="text-sm text-destructive dark:text-red-400 mt-1">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {amenities.map((amenity) => {
                      const Icon = amenity.icon;
                      const isSelected = selectedAmenities.includes(amenity.id);
                      return (
                        <button
                          key={amenity.id}
                          type="button"
                          onClick={() => toggleAmenity(amenity.id)}
                          className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                          <span className="text-sm font-medium">
                            {amenity.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.amenities && (
                    <p className="text-sm text-destructive dark:text-red-400 mt-2">
                      {errors.amenities.message}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Photos */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Upload Photos
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Add photos to showcase your property
                    </p>
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById("images")?.click()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Choose Files
                    </Button>
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.images && (
                    <p className="text-sm text-destructive dark:text-red-400 mt-2">
                      {errors.images.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Tips */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Tips for Success</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">
                        Add high-quality photos to attract more interest
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">
                        Write a detailed description highlighting unique
                        features
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">
                        Set competitive pricing based on similar properties
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">
                        Respond quickly to messages from interested students
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Property...
                    </>
                  ) : (
                    "Publish Listing"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent disabled:opacity-50"
                >
                  Save as Draft
                </Button>
              </div>
            </div>

            {/* Submit Buttons */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
