"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createSublease, type SubleaseCreateData } from "@/lib/api";
import { subleaseFormSchema, type SubleaseFormData } from "@/lib/schemas";

interface SubleaseFormProps {
  propertyId: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SubleaseForm({
  propertyId,
  title: defaultTitle = "",
  description: defaultDescription = "",
  onSuccess,
  onCancel,
}: SubleaseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<SubleaseFormData>({
    resolver: zodResolver(subleaseFormSchema),
    defaultValues: {
      title: defaultTitle,
      description: defaultDescription,
      rate: 0,
      minimum_stay_days: 1,
      maximum_stay_days: 30,
      available_from: "",
      available_until: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: SubleaseFormData) => {
    try {
      const subleaseData: SubleaseCreateData = {
        title: data.title,
        description: data.description,
        rate: data.rate,
        minimum_stay_days: data.minimum_stay_days,
        maximum_stay_days: data.maximum_stay_days,
        available_from: data.available_from,
        available_until: data.available_until,
        status: "active",
        property_id: propertyId,
      };

      const response = await createSublease(subleaseData);

      toast.success("Sublease created successfully!", {
        description: `Your sublease "${data.title}" is now active and available for booking.`,
      });

      reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create sublease", {
        description:
          "Please check your information and try again. If the problem persists, contact support.",
      });
      console.error("Error creating sublease:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Listing Title *</Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Cozy Downtown Apartment for Short-term Sublease"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe your property, amenities, location, and any special features..."
          {...register("description")}
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Rate */}
      <div className="space-y-2">
        <Label htmlFor="rate">Rate ($) *</Label>
        <Input
          id="rate"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          {...register("rate", { valueAsNumber: true })}
        />
        {errors.rate && (
          <p className="text-sm text-red-500">{errors.rate.message}</p>
        )}
      </div>

      {/* Stay Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minimum_stay_days">Minimum Stay (days) *</Label>
          <Input
            id="minimum_stay_days"
            type="number"
            min="1"
            {...register("minimum_stay_days", { valueAsNumber: true })}
          />
          {errors.minimum_stay_days && (
            <p className="text-sm text-red-500">
              {errors.minimum_stay_days.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="maximum_stay_days">Maximum Stay (days) *</Label>
          <Input
            id="maximum_stay_days"
            type="number"
            min="1"
            {...register("maximum_stay_days", { valueAsNumber: true })}
          />
          {errors.maximum_stay_days && (
            <p className="text-sm text-red-500">
              {errors.maximum_stay_days.message}
            </p>
          )}
        </div>
      </div>

      {/* Availability Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="available_from">Available From *</Label>
          <Input
            id="available_from"
            type="date"
            {...register("available_from")}
          />
          {errors.available_from && (
            <p className="text-sm text-red-500">
              {errors.available_from.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="available_until">Available Until *</Label>
          <Input
            id="available_until"
            type="date"
            {...register("available_until")}
          />
          {errors.available_until && (
            <p className="text-sm text-red-500">
              {errors.available_until.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Creating..." : "Create Sublease"}
        </Button>
      </div>
    </form>
  );
}
