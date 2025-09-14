import { z } from "zod";

// Property form validation schema for form inputs
export const propertyFormSchema = z.object({
  title: z
    .string()
    .min(1, "Property title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  property_type: z
    .string()
    .optional()
    .refine(
      (val) => !val || ["1BHK", "2BHK", "3BHK"].includes(val),
      "Please select a valid property type"
    ),

  address_line1: z
    .string()
    .min(1, "Address line 1 is required")
    .min(3, "Address must be at least 3 characters")
    .max(200, "Address must be less than 200 characters"),

  address_line2: z
    .string()
    .max(100, "Address line 2 must be less than 100 characters")
    .optional(),

  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City must be at least 2 characters")
    .max(60, "City must be less than 60 characters"),

  state: z
    .string()
    .min(1, "State is required")
    .min(2, "State must be at least 2 characters")
    .max(60, "State must be less than 60 characters"),

  country: z
    .string()
    .min(1, "Country is required")
    .min(2, "Country must be at least 2 characters")
    .max(60, "Country must be less than 60 characters"),

  square_feet: z.string().optional(),

  amenities: z.array(z.string()).optional().default([]),

  images: z
    .array(z.instanceof(File))
    .optional()
    .default([])
    .refine(
      (files) => !files || files.length <= 10,
      "Maximum 10 images allowed"
    )
    .refine(
      (files) => !files || files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each image must be less than 5MB"
    )
    .refine(
      (files) =>
        !files ||
        files.every((file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        ),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
});

// Property schema for API submission (with transformations)
export const propertySchema = propertyFormSchema.transform((data) => ({
  ...data,
  square_feet:
    data.square_feet && data.square_feet !== ""
      ? parseInt(data.square_feet, 10) || undefined
      : undefined,
}));

export type PropertyFormInputs = z.infer<typeof propertyFormSchema>;
export type PropertyFormData = z.infer<typeof propertySchema>;

// Sublease form validation schema
export const subleaseFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Description must be less than 1000 characters"),
    rate: z.number().min(0, "Rate must be a positive number"),
    minimum_stay_days: z.number().min(1, "Minimum stay must be at least 1 day"),
    maximum_stay_days: z.number().min(1, "Maximum stay must be at least 1 day"),
    available_from: z.string().min(1, "Available from date is required"),
    available_until: z.string().min(1, "Available until date is required"),
  })
  .refine((data) => data.maximum_stay_days >= data.minimum_stay_days, {
    message: "Maximum stay must be greater than or equal to minimum stay",
    path: ["maximum_stay_days"],
  })
  .refine(
    (data) => new Date(data.available_until) > new Date(data.available_from),
    {
      message: "Available until date must be after available from date",
      path: ["available_until"],
    }
  );

export type SubleaseFormData = z.infer<typeof subleaseFormSchema>;
